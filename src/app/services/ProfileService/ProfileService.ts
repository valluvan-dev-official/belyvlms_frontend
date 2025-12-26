import api, { getCurrentUser } from "../AuthenticationService/AuthenticationService";

export interface User {
  id: number;
  email: string;
  name: string;
  role_name: string;
  is_active: boolean;
  last_login: string;
}

export interface Profile {
  id: number;
  email: string;
  data: any; // Using any for flexible data structure in 'data' field
  created_at: string;
}

export interface UserProfileResponse {
  user: User;
  profile: Profile;
  role: string;
  model_path: string | null;
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
 * GET /api/profiles/me/
 */
export const getMyProfile = async (): Promise<UserProfileResponse> => {
  try {
    // Removed leading slash to avoid double slash with baseURL
    const response = await api.get<UserProfileResponse>("profiles/users/me/");
    console.log("✅ Profile API Response Status:", response.status);
    console.log("📦 Profile API Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Profile API Error:", error);
    
    // FALLBACK: If API fails (404/500), try to use local stored user data
    // This ensures the profile page still works with basic info from login
    if (error.response?.status === 404 || error.code === "ERR_NETWORK") {
      console.warn("⚠️ Endpoint not found. Falling back to local user data.");
      const localUser = getCurrentUser();
      
      if (localUser && localUser.user) {
        return {
          user: {
            id: Number(localUser.user.id) || 0,
            email: localUser.user.email,
            name: localUser.user.name,
            role_name: localUser.role.name,
            is_active: true,
            last_login: new Date().toISOString()
          },
          profile: {
            id: 0,
            email: localUser.user.email,
            data: {
              bio: "Profile data not available (API 404)",
              phone_number: "",
              address: ""
            },
            created_at: new Date().toISOString()
          },
          role: localUser.role.code,
          model_path: null
        };
      }
    }
    
    throw error;
  }
};

export const getAllUsers = async (): Promise<UserListItem[]> => {
  const response = await api.get<UserListItem[]>("profiles/users/");
  return response.data;
};
/**
 * Update the current user's profile data
 * PATCH /api/profiles/me/
 */
export const updateMyProfile = async (
  data: Partial<UserProfileResponse>
): Promise<UserProfileResponse> => {
  try {
    const response = await api.patch<UserProfileResponse>("/profiles/users/me/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
