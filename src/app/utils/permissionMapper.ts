import { PERMISSIONS } from '../config/permissions';

/**
 * Maps legacy backend permission codes to the new standardized permission schema.
 * This ensures the frontend works with the new STRICT CONTRACT even if the backend 
 * hasn't been fully updated yet.
 */
export const normalizePermissions = (backendPermissions: string[]): string[] => {
  const normalized = new Set<string>();

  backendPermissions.forEach(perm => {
    // 1. Pass-through if it already matches the new schema
    if (Object.values(PERMISSIONS).includes(perm as any)) {
      normalized.add(perm);
      return;
    }

    // 2. Map Legacy Permissions
    switch (perm) {
      // Access Control
      case 'VIEW_ACCESS_CONTROL':
        normalized.add(PERMISSIONS.ACCESS_CONTROL_VIEW);
        break;
      case 'VIEW_MATRIX':
        normalized.add(PERMISSIONS.ACCESS_CONTROL_MATRIX_VIEW);
        break;
      case 'EDIT_MATRIX': // Assuming this might exist
      case 'MANAGE_MATRIX':
        normalized.add(PERMISSIONS.ACCESS_CONTROL_MATRIX_EDIT);
        break;
      case 'VIEW_ROLE_MANAGEMENT':
        normalized.add(PERMISSIONS.ACCESS_CONTROL_ROLE_VIEW);
        break;
      case 'CREATE_ROLE':
      case 'MANAGE_ROLES':
        normalized.add(PERMISSIONS.ACCESS_CONTROL_ROLE_CREATE);
        normalized.add(PERMISSIONS.ACCESS_CONTROL_ROLE_DELETE); // Bundle for now
        break;
      case 'VIEW_PERMISSION_LIBRARY':
        normalized.add(PERMISSIONS.ACCESS_CONTROL_PERMISSION_VIEW);
        break;

      // Dashboard
      case 'VIEW_DASHBOARD':
        normalized.add(PERMISSIONS.DASHBOARD_VIEW_GLOBAL);
        // Grant widget permissions by default for now if dashboard is viewable
        normalized.add(PERMISSIONS.DASHBOARD_WIDGET_GROWTH_VIEW);
        normalized.add(PERMISSIONS.DASHBOARD_WIDGET_STATS_VIEW);
        normalized.add(PERMISSIONS.DASHBOARD_WIDGET_ACTIVITY_VIEW);
        break;

      // User Management
      case 'VIEW_USERS':
      case 'MANAGE_USERS':
        normalized.add(PERMISSIONS.USER_VIEW);
        break;
      case 'CREATE_USER':
        normalized.add(PERMISSIONS.USER_MANAGEMENT_CREATE);
        break;
      case 'EDIT_USER':
        normalized.add(PERMISSIONS.USER_MANAGEMENT_EDIT);
        break;
      case 'DELETE_USER':
        normalized.add(PERMISSIONS.USER_MANAGEMENT_DELETE);
        break;
      
      // Student Management
      case 'VIEW_STUDENTS':
        normalized.add(PERMISSIONS.STUDENT_MANAGEMENT_VIEW);
        break;
      case 'VIEW_STUDENT_STATS':
        normalized.add(PERMISSIONS.STUDENT_MANAGEMENT_STATS_VIEW);
        break;

      // Trainer Management
      case 'VIEW_TRAINERS':
        normalized.add(PERMISSIONS.TRAINER_VIEW);
        break;

      // Audit Logs
      case 'VIEW_AUDIT_LOGS':
        normalized.add(PERMISSIONS.AUDIT_LOG_VIEW);
        break;
      case 'EXPORT_AUDIT_LOGS':
        normalized.add(PERMISSIONS.AUDIT_LOG_EXPORT);
        break;
    }
  });

  // 3. Fallback: If Super Admin (SAM) or Admin (ADM), grant everything (TEMPORARY until backend is ready)
  // NOTE: The prompt says "No role checks in UI". 
  // We handle this here in the mapper, so the UI only sees permissions.
  // Ideally, we shouldn't check roles here, but to prevent breakage during transition:
  // We'll leave this strictly permission-based as requested. 
  // If the backend sends 'SAM' role users empty permissions, they will see nothing.
  // Assumption: The backend sends full permissions for SAM/ADM.

  return Array.from(normalized);
};
