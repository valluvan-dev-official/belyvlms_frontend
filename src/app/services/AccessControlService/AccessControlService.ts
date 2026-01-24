import { api } from '../AuthenticationService/AuthenticationService';

export interface Permission {
  id: string; // This will map to 'code' from API
  module: string;
  name: string;
  description?: string;
  code?: string; // API returns 'code'
}

export interface Role {
  id: string;
  name: string;
  code: string;
  userCount?: number;
  color?: string;
}

export interface PermissionMatrix {
  [roleId: string]: {
    [permissionId: string]: boolean;
  };
}

// Extended palette of distinct colors for roles
const ROLE_COLORS = [
  '#4ECDC4', // Teal
  '#FF6B6B', // Red
  '#FFBE0B', // Yellow
  '#1A535C', // Dark Teal
  '#45B7D1', // Blue
  '#96CEB4', // Light Green
  '#FFEEAD', // Cream
  '#D4A5A5', // Pinkish
  '#9B59B6', // Purple
  '#3498DB', // Blue
  '#E67E22', // Orange
  '#2ECC71', // Green
  '#E74C3C', // Dark Red
  '#8E44AD', // Dark Purple
  '#16A085', // Dark Green
  '#F39C12', // Orange
  '#2C3E50', // Dark Blue
  '#7F8C8D', // Grey
];

const getRoleColor = (identifier: string): string => {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ROLE_COLORS.length;
  return ROLE_COLORS[index];
};

// Service to handle Access Control interactions with the Backend
const AccessControlService = {
  /**
   * Fetches all available roles from the backend.
   * Method: GET /rbac/roles/
   */
  getRoles: async (): Promise<Role[]> => {
    try {
      const response = await api.get('rbac/roles/');
      // Map API response to UI model if necessary
      // Assuming API returns array of roles directly or in a results field
      const rolesData = response.data.results || response.data;
      
      return rolesData.map((role: any) => {
        const roleId = role.id || role.code;
        const roleName = role.name || '';
        const roleCode = role.code || (roleName ? roleName.substring(0, 3).toUpperCase() : 'UNK');
        
        // Use backend color if provided, otherwise generate a consistent unique color based on ID/Code
        const color = role.color || getRoleColor(roleId ? String(roleId) : roleCode);
        
        return {
          id: roleId,
          name: roleName,
          code: roleCode,
          userCount: role.user_count || 0, // Fallback if not provided
          color: color
        };
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  /**
   * Fetches all defined permissions from the backend.
   * Method: GET /rbac/permissions/
   */
  getPermissions: async (): Promise<Permission[]> => {
    try {
      const response = await api.get('rbac/permissions/');
      const permissionsData = response.data.results || response.data;
      
      return permissionsData.map((perm: any) => ({
        id: perm.code, // UI uses 'id', API provides 'code' as unique identifier
        code: perm.code,
        module: perm.module || 'General',
        name: perm.name || perm.code,
        description: perm.description || ''
      }));
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },

  /**
   * Fetches permissions assigned to a specific role.
   * Method: GET /rbac/role-permissions/?role_id={id}
   */
  getRolePermissions: async (roleId: string): Promise<string[]> => {
    try {
      const response = await api.get(`rbac/role-permissions/?role_id=${roleId}`);
      // Assuming response returns a list of permission objects or codes
      // Adjust based on actual API response structure. Docs say: "Get list of permissions currently assigned to a role"
      // If it returns objects: [{code: "USER_VIEW", ...}], map to codes.
      const data = response.data.results || response.data;
      
      if (Array.isArray(data)) {
        return data.map((p: any) => {
          if (typeof p === 'string') return p;
          return p.permission_code || p.code || p.id;
        });
      }
      return [];
    } catch (error) {
      console.error(`Error fetching permissions for role ${roleId}:`, error);
      return [];
    }
  },

  /**
   * Assigns permissions to a role (Bulk Update).
   * Method: POST /rbac/roles/{id}/set_permissions/
   */
  assignPermissions: async (roleId: string, permissionCodes: string[]): Promise<any> => {
    try {
      const response = await api.post(`rbac/roles/${roleId}/set_permissions/`, {
        permissions: permissionCodes
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating permissions for role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new role.
   * Method: POST /rbac/roles/
   */
  createRole: async (roleData: { name: string; code: string; color?: string }): Promise<Role> => {
    try {
      const response = await api.post('rbac/roles/', roleData);
      const role = response.data;
      return {
        id: role.id || role.code,
        name: role.name,
        code: role.code,
        userCount: role.user_count || 0,
        color: role.color || roleData.color || '#4ECDC4'
      };
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  /**
   * Updates an existing role.
   * Method: PUT /rbac/roles/{id}/
   */
  updateRole: async (roleId: string, roleData: { name?: string; code?: string; color?: string }): Promise<Role> => {
    try {
      const response = await api.put(`rbac/roles/${roleId}/`, roleData);
      const role = response.data;
      return {
        id: role.id || role.code,
        name: role.name,
        code: role.code,
        userCount: role.user_count || 0,
        color: role.color || roleData.color || '#4ECDC4'
      };
    } catch (error) {
      console.error(`Error updating role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a role.
   * Method: DELETE /rbac/roles/{id}/
   */
  deleteRole: async (roleId: string): Promise<void> => {
    try {
      await api.delete(`rbac/roles/${roleId}/`);
    } catch (error) {
      console.error(`Error deleting role ${roleId}:`, error);
      throw error;
    }
  }
};

export default AccessControlService;
