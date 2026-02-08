import React from 'react';
import { useLivePermissions } from '../hooks/useLivePermissions';

interface LivePermissionGuardProps {
  permissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode; // Content to show if permission denied
  loadingComponent?: React.ReactNode; // Custom loader, defaults to null (invisible loading) or spinner
  requireAll?: boolean; // If true, requires ALL permissions. If false, requires AT LEAST ONE. Default: true
}

/**
 * A wrapper component that performs a LIVE backend check for permissions.
 * Use this for critical actions (Delete, Sensitive View) where cache is not enough.
 * 
 * @example
 * <LivePermissionGuard permissions={['DELETE_USER']}>
 *   <button onClick={deleteUser}>Delete User</button>
 * </LivePermissionGuard>
 */
export const LivePermissionGuard: React.FC<LivePermissionGuardProps> = ({
  permissions: requiredPermissions,
  children,
  fallback = null,
  loadingComponent = null,
  requireAll = true
}) => {
  const { permissions, loading } = useLivePermissions(requiredPermissions);

  if (loading) {
    return <>{loadingComponent}</>;
  }

  // Determine if access is granted based on response
  const isGranted = requireAll
    ? requiredPermissions.every(code => permissions[code] === true)
    : requiredPermissions.some(code => permissions[code] === true);

  if (isGranted) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default LivePermissionGuard;
