import axios, { AxiosError } from "axios";

// ============================================
// 1. BASE CONFIGURATION
// ============================================

// Use environment variable if available, otherwise fallback to live URL
// To use local API, create a .env file with: VITE_API_URL=http://localhost:8000/api/
const BASE_URL = import.meta.env.VITE_API_URL || "https://dev.belyv.in/api/";

console.log("🚀 Current API Environment:", BASE_URL.includes("localhost") ? "LOCAL" : "LIVE");
console.log("🔗 API URL:", BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const log = (msg: string, data: any = null) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${msg}`);
  if (data) console.log(data);
};

// ============================================
// 2. TOKEN & USER MANAGEMENT
// ============================================

export interface UserRole {
  code: string;
  name: string;
}

export interface UserProfile {
  id: number | string;
  email: string;
  name: string;
}

export interface UserData {
  access: string;
  role: UserRole; // This is the ACTIVE role
  available_roles: UserRole[];
  permissions: string[];
  user: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Get current user data from localStorage
 * Returns full user object with token, role, permissions
 */
export const getCurrentUser = (): UserData | null => {
  try {
    const userData = localStorage.getItem("belyv_user");
    return userData ? JSON.parse(userData) : null;
  } catch (err) {
    log("⚠️ Error parsing user data from localStorage", err);
    return null;
  }
};

/**
 * Get access token only
 */
export const getAccessToken = (): string | null => {
  const user = getCurrentUser();
  return user?.access || localStorage.getItem("access");
};

/**
 * Get active role code for header injection
 */
export const getActiveRoleCode = (): string | null => {
  const user = getCurrentUser();
  return user?.role?.code || localStorage.getItem("active_role_code");
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (permissionCode: string): boolean => {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permissionCode);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * Get user role
 */
export const getUserRole = (): UserRole | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

// ============================================
// 3. INTERCEPTORS (ENTERPRISE SECURITY)
// ============================================

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    const activeRoleCode = getActiveRoleCode();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (activeRoleCode) {
      config.headers["X-Active-Role"] = activeRoleCode;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data: any = error.response?.data;
    const cfg: any = error.config;
    const skipAuthLogout =
      cfg?.headers?.["X-Skip-Auth-Logout"] === "true" ||
      (typeof cfg?.url === "string" && cfg.url.includes("rbac/public/onboard/"));

    // Handle Role Revocation / Inactivation
    if (status === 403) {
      const errorCode = data?.code;
      if (errorCode === "ROLE_INACTIVE" || errorCode === "ROLE_REVOKED") {
        log(`⛔ Access Denied: ${errorCode}. Logging out...`);
        logoutUser();
      }
    }
    
    // Handle Unauthorized (Token Expired/Invalid)
    if (status === 401 && !skipAuthLogout) {
       // Optional: Add refresh token logic here if needed later
       log("⛔ Unauthorized. Logging out...");
       logoutUser();
    }

    return Promise.reject(error);
  }
);

// ============================================
// 4. AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Login user with RBAC API
 */
export const loginUser = async (credentials: LoginCredentials): Promise<UserData> => {
  log(`🌐 Calling: ${BASE_URL}rbac/auth/login/`);
  log(`📧 Email: ${credentials.email}`);

  try {
    const res = await api.post("rbac/auth/login/", credentials);

    log("✅ Logged in successfully!");
    
    // Extract data from RBAC response
    const { access, active_role, available_roles, permissions, user, role, must_change_password } = res.data;

    // NOTE: 'role' in older API might be 'active_role' in new API.
    // We map 'active_role' (preferred) or 'role' (fallback) to the 'role' property in UserData
    const currentRole = active_role || role || { code: "ADMIN", name: "Admin" };

    // Create user object to store (no refresh token)
    const userData: UserData = {
      access,
      role: currentRole,
      available_roles: available_roles || [currentRole],
      permissions: permissions || [],
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
      },
    };

    // Store secure data
    localStorage.setItem("belyv_user", JSON.stringify(userData));
    localStorage.setItem("access", access);
    localStorage.setItem("active_role_code", userData.role.code);
    localStorage.setItem("isAuthenticated", JSON.stringify(true));
    if (typeof must_change_password !== "undefined") {
      localStorage.setItem("must_change_password", JSON.stringify(!!must_change_password));
    }

    return userData;
  } catch (err: any) {
    log(`❌ Login failed: ${err.message}`);
    log(`📍 Full URL attempted: ${BASE_URL}rbac/auth/login/`);

    if (err.response) {
      log(`📊 Status: ${err.response.status}`);
      log(`📄 Response:`, err.response.data);
      log(`📋 Detail: ${err.response.data?.detail || "No detail provided"}`);
    }
    
    throw err;
  }
};

/**
 * Fetch current user's permissions for active role
 * GET /api/rbac/user/permissions
 */
export const getCurrentPermissions = async (): Promise<string[]> => {
  try {
    const res = await api.get("rbac/auth/me/");
    const perms = res.data?.permissions;
    return Array.isArray(perms) ? perms : [];
  } catch (err) {
    return [];
  }
};

/**
 * Switch Role
 */
export const switchRole = async (roleCode: string): Promise<UserData> => {
  log(`🔄 Switching role to: ${roleCode}`);
  
  try {
    const res = await api.post("rbac/auth/switch-role/", { role_code: roleCode });
    
    log("✅ Role switched successfully!");
    
    const { access, active_role, available_roles, permissions, user } = res.data;

    const userData: UserData = {
      access,
      role: active_role,
      available_roles: available_roles || [],
      permissions: permissions || [],
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
      },
    };

    // Update Storage
    localStorage.setItem("belyv_user", JSON.stringify(userData));
    localStorage.setItem("access", access);
    localStorage.setItem("active_role_code", active_role.code);

    return userData;
  } catch (err: any) {
    log(`❌ Switch role failed: ${err.message}`);
    throw err;
  }
};

/**
 * Get Current User Context (Rehydration)
 */
export const getMe = async (): Promise<UserData> => {
  log(`🔍 Fetching current context (getMe)...`);
  
  try {
    const res = await api.get("rbac/auth/me/");
    
    const { access, active_role, available_roles, permissions, user } = res.data;
    
    // Use existing access token if not provided in refresh
    const existingUser = getCurrentUser();
    
    const userData: UserData = {
      access: access || existingUser?.access || "",
      role: active_role,
      available_roles: available_roles || [],
      permissions: permissions || [],
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
      },
    };

    localStorage.setItem("belyv_user", JSON.stringify(userData));
    if (access) localStorage.setItem("access", access);
    localStorage.setItem("active_role_code", active_role.code);
    
    return userData;
  } catch (err: any) {
    log(`❌ getMe failed: ${err.message}`);
    throw err;
  }
};

/**
 * Logout user - clears local storage and redirects immediately
 */
export const logoutUser = () => {
  log("🚪 Logout initiated...");

  try {
    // Clear all auth data immediately
    localStorage.removeItem("belyv_user");
    localStorage.removeItem("access");
    localStorage.removeItem("active_role_code");
    localStorage.setItem("isAuthenticated", JSON.stringify(false));

    log("🧹 Local storage cleared");
    log("🚪 Redirecting to login page NOW");

    sessionStorage.setItem("showLogoutTransition", "true");
    window.location.href = "/";
  } catch (error: any) {
    console.error("⚠️ Error during logout:", error);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  }
};
