import { api } from '../AuthenticationService/AuthenticationService';

export interface Role {
  id: number | string;
  name: string;
  code: string;
  color?: string;
  is_active?: boolean;
  userCount?: number;
}

export interface RoleImpact {
  users_affected: number;
  permissions_affected: number;
}

export const listRoles = async (): Promise<Role[]> => {
  const res = await api.get('rbac/roles/');
  return res.data.results || res.data;
};

export const getRoleImpact = async (roleId: number | string): Promise<RoleImpact> => {
  const res = await api.get(`rbac/roles/${roleId}/impact/`);
  return res.data;
};

export const deactivateRole = async (
  roleId: number | string,
  payload: { strategy: 'fallback' | 'reassign'; target_role_id?: number | string; reason: string }
): Promise<void> => {
  await api.post(`rbac/roles/${roleId}/deactivate/`, payload);
};

export const assignRole = async (payload: { user: number | string; role: number | string }): Promise<void> => {
  await api.post('rbac/assign-role/', payload);
};

