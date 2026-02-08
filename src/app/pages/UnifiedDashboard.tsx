import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayoutConfig } from '../components/dashboard/registry/dashboardConfig';
import { QuickAccessTabs } from '../components/dashboard/shared/QuickAccessTabs';
import DashboardShell from '../components/dashboard/layout/DashboardShell';
import { useDashboardLayout } from '../hooks/useDashboardLayout';

export function UnifiedDashboard() {
  const { activeRole, hasPermission } = useAuth();
  
  // Use the custom hook for layout management
  const { layoutConfig: config, loading: isLoading } = useDashboardLayout();
  const [activeTabId, setActiveTabId] = useState<string>('');

  // Filter tabs based on permissions
  const visibleTabs = useMemo(() => {
    return config?.tabs?.filter(tab => {
      if (!tab.permissions || tab.permissions.length === 0) return true;
      return tab.permissions.every(p => hasPermission(p));
    }) || [];
  }, [config, hasPermission]);

  // Set active tab when config loads
  useEffect(() => {
    if (visibleTabs.length > 0) {
      // Preserve active tab if valid, otherwise reset to first
      setActiveTabId(prev => {
        const exists = visibleTabs.find(t => t.id === prev);
        return exists ? prev : visibleTabs[0].id;
      });
    }
  }, [visibleTabs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#4ECDC4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!config) return null;

  // Get current layout based on active tab
  const activeTab = visibleTabs.find(t => t.id === activeTabId) || visibleTabs[0];
  const widgets =
    activeTab && config.layouts
      ? config.layouts[activeTab.layoutId] || []
      : [];

  return (
    <div className="space-y-6">
      {/* Header Widgets (Always Visible) */}
      {config.headerWidgets && config.headerWidgets.length > 0 && (
        <DashboardShell widgets={config.headerWidgets} />
      )}

      {/* Dynamic Tabs based on Role Configuration */}
      <QuickAccessTabs 
        tabs={visibleTabs} 
        activeTab={activeTabId} 
        onTabChange={setActiveTabId} 
      />

      {/* Generic Dashboard Shell that renders widgets based on config */}
      <DashboardShell widgets={widgets} />

      {/* Footer Widgets (Always Visible) */}
      {config.footerWidgets && config.footerWidgets.length > 0 && (
        <DashboardShell widgets={config.footerWidgets} />
      )}
    </div>
  );
}
