import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  loginUser, 
  logoutUser, 
  switchRole as switchRoleService, 
  getMe, 
  getCurrentUser,
  UserProfile, 
  UserRole 
} from '../services/AuthenticationService/AuthenticationService';
import { getCurrentPermissions } from '../services/AuthenticationService/AuthenticationService';

interface AuthContextType {
  user: UserProfile | null;
  activeRole: UserRole | null;
  availableRoles: UserRole[];
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (roleCode: string) => Promise<void>;
  hasPermission: (permissionCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth State
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First, check local storage for immediate UI feedback (Optimistic UI)
        const localData = getCurrentUser();
        if (localData) {
          setUser(localData.user);
          setActiveRole(localData.role);
          setAvailableRoles(localData.available_roles || []);
          setPermissions(localData.permissions || []);
          // UNBLOCK UI IMMEDIATELY - Don't wait for server
          setIsLoading(false);
        }

        // Then verify with backend silently in background
        if (localData?.access) {
          const freshData = await getMe();
          // Update state with fresh data
          setUser(freshData.user);
          setActiveRole(freshData.role);
          setAvailableRoles(freshData.available_roles || []);
          setPermissions(freshData.permissions || []);
        } else {
          // No local data, ensure loading stops so login page can show
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // If background check failed, interceptor handles logout/redirect
        // We just ensure loading state is cleared
        if (!getCurrentUser()) {
            setIsLoading(false);
        }
      }
    };

    initAuth();

    // LISTEN FOR EXTERNAL AUTH UPDATES (e.g., from Interceptor 403 Handler)
    const handleAuthUpdate = () => {
      console.log("🔄 Auth Context: Received external update signal. Reloading state...");
      const localData = getCurrentUser();
      if (localData) {
        setUser(localData.user);
        setActiveRole(localData.role);
        setAvailableRoles(localData.available_roles || []);
        setPermissions(localData.permissions || []);
      }
    };

    window.addEventListener("belyv_auth_update", handleAuthUpdate);
    return () => window.removeEventListener("belyv_auth_update", handleAuthUpdate);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await loginUser({ email, password });
      
      // OPTIMIZATION: Use data directly from login response
      // No need to call getCurrentPermissions() immediately because login response
      // already contains the fresh permissions for the active role.
      
      setUser(userData.user);
      setActiveRole(userData.role);
      setAvailableRoles(userData.available_roles);
      setPermissions(userData.permissions);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setActiveRole(null);
    setAvailableRoles([]);
    setPermissions([]);
  };

  const switchRole = async (roleCode: string) => {
    setIsLoading(true);
    try {
      const userData = await switchRoleService(roleCode);
      // Update state with new context
      setUser(userData.user);
      setActiveRole(userData.role);
      setAvailableRoles(userData.available_roles);
      // Reload permissions for new role context
      try {
        const freshPerms = await getCurrentPermissions();
        setPermissions(freshPerms.length ? freshPerms : userData.permissions);
      } catch {
        setPermissions(userData.permissions);
      }
      
      // Navigate to dashboard is usually handled by the component calling this, 
      // or we can force it here if strictly required.
      // For now, we update state, and the app should react.
      // window.location.href = "/dashboard"; 
    } catch (error) {
      console.error("Failed to switch role:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = useCallback((permissionCode: string) => {
    if (!permissionCode) return true;
    return permissions.includes(permissionCode);
  }, [permissions]);

  const value = {
    user,
    activeRole,
    availableRoles,
    permissions,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchRole,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
