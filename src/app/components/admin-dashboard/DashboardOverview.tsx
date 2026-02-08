import { useState, useEffect } from 'react';
import DashboardShell from '../dashboard/layout/DashboardShell';
import { useAuth } from '../../context/AuthContext';
import { adminDashboardConfig } from '../dashboard/registry/dashboardConfig';

export function DashboardOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const { activeRole } = useAuth();

  useEffect(() => {
    // Data is static/mock for now, so we can show it immediately
    // or use a very short delay if we want a micro-interaction, but immediate is better for UX
    setIsLoading(false);
  }, []);

  // Get widgets for the admin overview layout
  const widgets = adminDashboardConfig.layouts['admin-overview'] || [];

  return (
    <DashboardShell widgets={widgets} isLoading={isLoading} />
  );
}
