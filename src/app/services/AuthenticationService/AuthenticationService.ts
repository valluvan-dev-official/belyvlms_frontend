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
  role: UserRole;
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
// 3. AUTHENTICATION FUNCTIONS
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
    log("📦 Response data:", res.data);

    // Extract data from RBAC response (only use access token)
    const { access, role, permissions, user } = res.data;

    // Create user object to store (no refresh token)
    const userData: UserData = {
      access,
      role: {
        code: role?.code || "ADMIN",
        name: role?.name || "Admin",
      },
      permissions: permissions || [],
      user: {
        id: user?.id || 1,
        email: user?.email || credentials.email,
        name: user?.name || user?.email?.split("@")[0] || "User",
      },
    };

    // Store only access token (60 days validity)
    localStorage.setItem("belyv_user", JSON.stringify(userData));
    localStorage.setItem("access", access);
    localStorage.setItem("isAuthenticated", JSON.stringify(true));

    // Return userData so the login form can access it
    return userData;
  } catch (err: any) {
    log(`❌ Login failed: ${err.message}`);
    log(`📍 Full URL attempted: ${BASE_URL}rbac/auth/login/`);

    if (err.response) {
      log(`📊 Status: ${err.response.status}`);
      log(`📄 Response:`, err.response.data);
      log(`📋 Detail: ${err.response.data?.detail || "No detail provided"}`);
    }
    if (err.request) {
      log(`📨 Request was sent but no response received`);
    }

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
    localStorage.setItem("isAuthenticated", JSON.stringify(false));

    log("🧹 Local storage cleared");
    log("🚪 Redirecting to login page NOW");

    // Set a flag for showing logout transition
    sessionStorage.setItem("showLogoutTransition", "true");

    // Immediate redirect - use href for instant navigation
    window.location.href = "/";
  } catch (error: any) {
    // Handle SecurityError or any other error during logout
    console.error("⚠️ SecurityError during logout:", error);

    // Even if there's an error, try to clear what we can
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error("Could not clear storage:", e);
    }

    // Set security error flag
    try {
      sessionStorage.setItem("securityError", "true");
      sessionStorage.setItem(
        "securityErrorMessage",
        error.message || "Unknown error"
      );
    } catch (e) {
      // If even sessionStorage fails, just redirect
      console.error("SessionStorage blocked:", e);
    }

    // Force redirect even if storage is blocked
    window.location.href = "/";
  }
};

// ============================================
// 4. AXIOS INTERCEPTOR
// ============================================

/**
 * Request interceptor - Auto-attach JWT token
 */
api.interceptors.request.use(
  (config) => {
    // LOGGING REQUEST
    console.log(`🌐 API REQUEST: [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);

    const token = getAccessToken();
    if (token) {
      // Remove "Bearer " prefix if it exists, then add it fresh
      const cleanToken = token.startsWith("Bearer ")
        ? token.substring(7)
        : token;
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ API REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle 401 unauthorized errors
 * If token is invalid/expired (401), set unauthorized flag
 */
api.interceptors.response.use(
  (response) => {
    // LOGGING SUCCESS RESPONSE
    console.log(`✅ API SUCCESS: [${response.status}] ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    // LOGGING ERROR RESPONSE
    const url = error.config?.url || "Unknown URL";
    const status = error.response?.status || "Network Error";
    console.error(`❌ API ERROR: [${status}] ${url}`, error.response?.data || error.message);

    // Handle 401 errors (unauthorized - token invalid or expired)
    if (error.response?.status === 401) {
      log("❌ 401 Unauthorized - Token invalid or expired");

      // Clear all auth data
      localStorage.removeItem("belyv_user");
      localStorage.removeItem("access");
      localStorage.setItem("isAuthenticated", JSON.stringify(false));

      // Set unauthorized flag to trigger unauthorized page
      localStorage.setItem("unauthorized", JSON.stringify(true));

      // Trigger a custom event that App.tsx can listen to
      window.dispatchEvent(new Event("unauthorized"));
    }

    return Promise.reject(error);
  }
);

// ============================================
// 5. EXPORTS
// ============================================

// Export the configured api instance for making authenticated requests
export default api;
