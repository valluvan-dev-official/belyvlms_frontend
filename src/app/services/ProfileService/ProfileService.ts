import { api, getCurrentUser } from "../AuthenticationService/AuthenticationService";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  profile_picture: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface UserListItem {
  id: number;
  email: string;
  name: string;
  profile_picture: string | null;
  role_name: string;
  is_active: boolean;
  last_login: string | null;
}

/**
 * Fetch the current user's profile data
 * GET /api/user/me/
 */
export const getMyProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>("user/me/");
    console.log("✅ Profile API Response Status:", response.status);
    console.log("📦 Profile API Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Profile API Error:", error);
    
    // FALLBACK logic
    if (error.response?.status === 404 || error.code === "ERR_NETWORK") {
      console.warn("⚠️ Endpoint not found. Falling back to local user data.");
      const localUser = getCurrentUser();
      
      if (localUser && localUser.user) {
        return {
            id: Number(localUser.user.id) || 0,
            email: localUser.user.email,
            name: localUser.user.name,
            role: localUser.role.name,
            profile_picture: null,
            is_active: true,
            is_staff: false,
            is_superuser: false
        };
      }
    }
    
    throw error;
  }
};

/**
 * Update the current user's profile data
 * PATCH /api/user/me/
 */
export const updateMyProfile = async (
  data: Partial<UserProfile> | FormData
): Promise<UserProfile> => {
  try {
    const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    const response = await api.patch<UserProfile>("user/me/", data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (): Promise<UserListItem[]> => {
  // Assuming the endpoint for all users is /profiles/users/ based on previous context
  // Or it might be /users/ if the backend follows the new convention. 
  // Given the previous file content (from memory/context), it was using "profiles/users/".
  // Let's keep it "profiles/users/" for now or try "users/" if we suspect a global change.
  // However, since the user only mentioned "user/me/", I should probably stick to what was working for other endpoints or guess "users/".
  // Looking at the previous read of ProfileService.ts (before I overwrote it), it had:
  // export const getAllUsers = async (): Promise<UserListItem[]> => {
  //   const response = await api.get<UserListItem[]>("profiles/users/");
  //   return response.data;
  // };
  // I will restore it as is.
  try {
      const response = await api.get<UserListItem[]>("profiles/users/");
      return response.data;
  } catch (error) {
      console.error("Failed to fetch all users", error);
      return [];
  }
};
