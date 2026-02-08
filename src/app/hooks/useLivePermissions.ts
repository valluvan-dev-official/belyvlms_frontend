import { useState, useEffect, useRef } from 'react';
import { checkPermissions } from '../services/AuthenticationService/AuthenticationService';

/**
 * Hook to perform live permission checks against the backend.
 * 
 * Usage:
 * const { permissions, loading } = useLivePermissions(['CREATE_BATCH', 'DELETE_USER']);
 * 
 * if (loading) return <Skeleton />;
 * if (permissions.CREATE_BATCH) { ... }
 */
export const useLivePermissions = (requiredPermissions: string[]) => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  // Use a ref to store the stringified permissions to prevent unnecessary re-renders
  // if the array reference changes but contents are the same.
  const permissionsKey = JSON.stringify(requiredPermissions.sort());

  useEffect(() => {
    let isMounted = true;

    const fetchPermissions = async () => {
      setLoading(true);
      try {
        if (requiredPermissions.length === 0) {
          setPermissions({});
          setLoading(false);
          return;
        }

        const result = await checkPermissions(requiredPermissions);
        
        if (isMounted) {
          setPermissions(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Live permission check failed", err);
          setError(err);
          // Fail closed (deny all) on error
          const fallback = requiredPermissions.reduce((acc, p) => ({ ...acc, [p]: false }), {});
          setPermissions(fallback);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPermissions();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsKey]);

  return { permissions, loading, error };
};

export default useLivePermissions;
