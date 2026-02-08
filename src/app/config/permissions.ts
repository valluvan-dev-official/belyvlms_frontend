export const PERMISSIONS = {
  // A. Dashboard Module
  DASHBOARD_VIEW_GLOBAL: 'DASHBOARD_VIEW_GLOBAL',
  DASHBOARD_WIDGET_GROWTH_VIEW: 'DASHBOARD_WIDGET_GROWTH_VIEW',
  DASHBOARD_WIDGET_STATS_VIEW: 'DASHBOARD_WIDGET_STATS_VIEW',
  DASHBOARD_WIDGET_ACTIVITY_VIEW: 'DASHBOARD_WIDGET_ACTIVITY_VIEW',

  // B. User Management Module
  USER_VIEW: 'USER_MANAGEMENT_VIEW',
  USER_MANAGEMENT_CREATE: 'USER_MANAGEMENT_CREATE',
  USER_MANAGEMENT_EDIT: 'USER_MANAGEMENT_EDIT',
  USER_MANAGEMENT_DELETE: 'USER_MANAGEMENT_DELETE',
  USER_MANAGEMENT_EXPORT: 'USER_MANAGEMENT_EXPORT',
  USER_MANAGEMENT_ASSIGN_ROLE: 'USER_MANAGEMENT_ASSIGN_ROLE',

  // C. Student Management Module
  STUDENT_MANAGEMENT_VIEW: 'STUDENT_MANAGEMENT_VIEW',
  STUDENT_MANAGEMENT_PROFILE_VIEW: 'STUDENT_MANAGEMENT_PROFILE_VIEW',
  STUDENT_MANAGEMENT_STATS_VIEW: 'STUDENT_MANAGEMENT_STATS_VIEW',
  STUDENT_MANAGEMENT_EXPORT: 'STUDENT_MANAGEMENT_EXPORT',

  // D. Trainer Management Module
  TRAINER_VIEW: 'TRAINER_MANAGEMENT_VIEW',
  TRAINER_MANAGEMENT_APPROVE: 'TRAINER_MANAGEMENT_APPROVE',
  TRAINER_MANAGEMENT_REJECT: 'TRAINER_MANAGEMENT_REJECT',

  // E. Access Control (RBAC) Module
  ACCESS_CONTROL_VIEW: 'ACCESS_CONTROL_VIEW',
  ACCESS_CONTROL_MATRIX_VIEW: 'ACCESS_CONTROL_MATRIX_VIEW',
  ACCESS_CONTROL_MATRIX_EDIT: 'ACCESS_CONTROL_MATRIX_EDIT',
  
  // Role Management
  ROLE_VIEW: 'ROLE_VIEW',
  ROLE_CREATE: 'ROLE_CREATE',
  ROLE_UPDATE: 'ROLE_UPDATE',
  ROLE_DELETE: 'ROLE_DELETE',
  
  // F. Permission Library (New Enterprise Model)
  PERMISSION_LIBRARY_VIEW: 'PERMISSION_LIBRARY_VIEW',
  PERMISSION_LIBRARY_CREATE: 'PERMISSION_LIBRARY_CREATE',
  PERMISSION_LIBRARY_UPDATE: 'PERMISSION_LIBRARY_UPDATE',
  PERMISSION_LIBRARY_DELETE: 'PERMISSION_LIBRARY_DELETE',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export const ACCESS_CONTROL_MATRIX_CONFIG = [
  {
    module: 'Dashboard',
    permissions: [
      {
        code: PERMISSIONS.DASHBOARD_VIEW_GLOBAL,
        label: 'View Dashboard',
        description: 'Global access to the Dashboard page.'
      },
      {
        code: PERMISSIONS.DASHBOARD_WIDGET_GROWTH_VIEW,
        label: 'View Growth Widget',
        description: 'Can see the Growth Trend chart.'
      },
      {
        code: PERMISSIONS.DASHBOARD_WIDGET_STATS_VIEW,
        label: 'View Stats Widget',
        description: 'Can see the Quick Stats overview cards.'
      },
      {
        code: PERMISSIONS.DASHBOARD_WIDGET_ACTIVITY_VIEW,
        label: 'View Activity Widget',
        description: 'Can see the Recent Activity feed.'
      }
    ]
  },
  {
    module: 'User Management',
    permissions: [
      {
        code: PERMISSIONS.USER_VIEW,
        label: 'View Users',
        description: 'Can view the User Management list.'
      },
      {
        code: PERMISSIONS.USER_MANAGEMENT_CREATE,
        label: 'Create User',
        description: 'Can add new users to the system.'
      },
      {
        code: PERMISSIONS.USER_MANAGEMENT_EDIT,
        label: 'Edit User',
        description: 'Can edit existing user details.'
      },
      {
        code: PERMISSIONS.USER_MANAGEMENT_DELETE,
        label: 'Delete User',
        description: 'Can delete users (Destructive).'
      },
      {
        code: PERMISSIONS.USER_MANAGEMENT_EXPORT,
        label: 'Export Users',
        description: 'Can export user data to CSV/Excel.'
      },
      {
        code: PERMISSIONS.USER_MANAGEMENT_ASSIGN_ROLE,
        label: 'Assign Role',
        description: 'Can change user roles.'
      }
    ]
  },
  {
    module: 'Student Management',
    permissions: [
      {
        code: PERMISSIONS.STUDENT_MANAGEMENT_VIEW,
        label: 'View Students',
        description: 'Can view the Student Management list.'
      },
      {
        code: PERMISSIONS.STUDENT_MANAGEMENT_PROFILE_VIEW,
        label: 'View Profile',
        description: 'Can view detailed student profiles.'
      },
      {
        code: PERMISSIONS.STUDENT_MANAGEMENT_STATS_VIEW,
        label: 'View Stats',
        description: 'Can view student performance statistics.'
      },
      {
        code: PERMISSIONS.STUDENT_MANAGEMENT_EXPORT,
        label: 'Export Students',
        description: 'Can export student data.'
      }
    ]
  },
  {
    module: 'Trainer Management',
    permissions: [
      {
        code: PERMISSIONS.TRAINER_VIEW,
        label: 'View Trainers',
        description: 'Can view the Trainer Management list.'
      },
      {
        code: PERMISSIONS.TRAINER_MANAGEMENT_APPROVE,
        label: 'Approve Trainer',
        description: 'Can approve pending trainer applications.'
      },
      {
        code: PERMISSIONS.TRAINER_MANAGEMENT_REJECT,
        label: 'Reject Trainer',
        description: 'Can reject trainer applications.'
      }
    ]
  },
  {
    module: 'Access Control',
    permissions: [
      {
        code: PERMISSIONS.ACCESS_CONTROL_VIEW,
        label: 'Access Control Gateway',
        description: 'Grants entry to the Access Control section.'
      },
      {
        code: PERMISSIONS.ACCESS_CONTROL_MATRIX_VIEW,
        label: 'View Matrix',
        description: 'Can see the Permission Matrix. Checkboxes rendered as READ-ONLY.'
      },
      {
        code: PERMISSIONS.ACCESS_CONTROL_MATRIX_EDIT,
        label: 'Edit Matrix',
        description: 'Can toggle checkboxes and save matrix changes.'
      }
    ]
  },
  {
    module: 'Role Management',
    permissions: [
      {
        code: PERMISSIONS.ROLE_VIEW,
        label: 'View Roles',
        description: 'Role Management screen visible. Role list fetched (read-only).'
      },
      {
        code: PERMISSIONS.ROLE_CREATE,
        label: 'Create Role',
        description: 'Create Role button enabled.'
      },
      {
        code: PERMISSIONS.ROLE_UPDATE,
        label: 'Update Role',
        description: 'Edit Role action enabled.'
      },
      {
        code: PERMISSIONS.ROLE_DELETE,
        label: 'Delete Role',
        description: 'Delete Role action enabled.'
      }
    ]
  },
  {
    module: 'Permission Library',
    permissions: [
      {
        code: PERMISSIONS.PERMISSION_LIBRARY_VIEW,
        label: 'View Library',
        description: 'Allows viewing the Permission Library and reading all permission definitions.'
      },
      {
        code: PERMISSIONS.PERMISSION_LIBRARY_CREATE,
        label: 'Create Permission',
        description: 'Allows creating new permission definitions.'
      },
      {
        code: PERMISSIONS.PERMISSION_LIBRARY_UPDATE,
        label: 'Update Permission',
        description: 'Allows editing existing permission definitions.'
      },
      {
        code: PERMISSIONS.PERMISSION_LIBRARY_DELETE,
        label: 'Delete Permission',
        description: 'Allows deleting permission definitions (Destructive).'
      }
    ]
  },
  {
    module: 'Audit Logs',
    permissions: [
      {
        code: PERMISSIONS.AUDIT_LOG_VIEW,
        label: 'View Audit Logs',
        description: 'Can view the system audit logs (Read-Only).'
      },
      {
        code: PERMISSIONS.AUDIT_LOG_EXPORT,
        label: 'Export Audit Logs',
        description: 'Can export audit logs to CSV/Excel.'
      }
    ]
  }
];

// Mapping for backward compatibility (Optional, if backend sends old codes)
// We map OLD_BACKEND_CODE -> NEW_STRICT_CODE
export const PERMISSION_MAPPING: Record<string, string> = {
  // Dashboard
  'VIEW_DASHBOARD': PERMISSIONS.DASHBOARD_VIEW_GLOBAL,
  'VIEW_GROWTH_WIDGET': PERMISSIONS.DASHBOARD_WIDGET_GROWTH_VIEW,
  
  // User Management
  'VIEW_USERS': PERMISSIONS.USER_VIEW,
  'CREATE_USER': PERMISSIONS.USER_MANAGEMENT_CREATE,
  'EDIT_USER': PERMISSIONS.USER_MANAGEMENT_EDIT,
  'DELETE_USER': PERMISSIONS.USER_MANAGEMENT_DELETE,
  
  // Access Control
  'VIEW_ACCESS_CONTROL': PERMISSIONS.ACCESS_CONTROL_VIEW,
  'VIEW_MATRIX': PERMISSIONS.ACCESS_CONTROL_MATRIX_VIEW,
  'EDIT_MATRIX': PERMISSIONS.ACCESS_CONTROL_MATRIX_EDIT,
  'VIEW_ROLE_MANAGEMENT': PERMISSIONS.ROLE_VIEW,
  'VIEW_PERMISSION_LIBRARY': PERMISSIONS.PERMISSION_LIBRARY_VIEW,
};
