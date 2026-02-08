import React from 'react';
import { useAuth } from '../context/AuthContext';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  permissions,
  children, 
  fallback = null 
}) => {
  const { hasPermission } = useAuth();

  const isAllowed = () => {
    if (permission) {
      return hasPermission(permission);
    }
    if (permissions && permissions.length > 0) {
      return permissions.every(p => hasPermission(p));
    }
    return true; // No permission restrictions
  };

  if (!isAllowed()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
