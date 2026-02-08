import { useState, useEffect } from 'react';
import { UiConfigService } from '../services/UiConfigService';
import { DashboardLayoutConfig, getDashboardConfig as getLocalConfig } from '../components/dashboard/registry/dashboardConfig';
import { getActiveRoleCode } from '../services/AuthenticationService/AuthenticationService';

export const useDashboardLayout = () => {
  const [layoutConfig, setLayoutConfig] = useState<DashboardLayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCustomized, setIsCustomized] = useState(false); // To track if user has custom layout
  const activeRole = getActiveRoleCode();

  const getRoleKey = () => {
    const code = activeRole?.toLowerCase() || '';
    if (code === 'sam' || code.includes('super')) return 'admin';
    if (code === 'trn' || code === 'instructor') return 'trainer';
    if (code === 'adm' || code === 'admin') return 'admin';
    if (code === 'btr' || code === 'student') return 'student';
    return 'student';
  };

  const roleKey = getRoleKey();

  // 1. Load Layout on Role Change
  useEffect(() => {
    loadConfig();
  }, [activeRole]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      // 1. Try to get config from API (Backend-Driven)
      const data = await UiConfigService.getDashboardConfig('dashboard');
      
      // Validation: Ensure the config has the required 'tabs' array
      if (data && data.config && Array.isArray(data.config.tabs)) {
        const localConfig = getLocalConfig(roleKey);
        const remoteConfig = data.config;
        
        // Merge strategy: Prioritize LOCAL tabs/layouts for safety, but allow remote to override specific settings if needed
        // For now, as per UnifiedDashboard.tsx logic, we merge safe defaults
        const mergedConfig: DashboardLayoutConfig = {
          ...localConfig,
          ...remoteConfig,
          // We prioritize local tabs/layouts structure to ensure component IDs match
          // But if remote has valid structure, we should trust it eventually.
          // For now, we keep the safe merge logic from UnifiedDashboard.tsx
          tabs: localConfig.tabs, 
          layouts: localConfig.layouts,
          headerWidgets: remoteConfig.headerWidgets ?? localConfig.headerWidgets,
          footerWidgets: remoteConfig.footerWidgets ?? localConfig.footerWidgets
        };

        setLayoutConfig(mergedConfig);
        setIsCustomized(data.source === 'user_preference');
        console.log(`Loaded Layout from: ${data.source}`);
      } else {
        throw new Error('Invalid or empty config format from API');
      }
    } catch (error) {
      console.warn('⚠️ Failed to load UI Config from API, falling back to local defaults.', error);
      // Fallback logic
      const fallbackConfig = getLocalConfig(roleKey);
      setLayoutConfig(fallbackConfig);
      setIsCustomized(false);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Layout Change (e.g., after Drag & Drop)
  const onLayoutChange = async (newLayout: DashboardLayoutConfig) => {
    // Optimistic Update: UI-a udane update pannu
    setLayoutConfig(newLayout);

    // Backend Sync (Debounce panrathu nallathu)
    try {
      await UiConfigService.saveDashboardConfig(newLayout);
      setIsCustomized(true);
      console.log("Layout saved to backend!");
    } catch (error) {
      console.error("Save failed", error);
      // Revert changes if needed (optional)
    }
  };

  return { layoutConfig, loading, isCustomized, onLayoutChange, refreshLayout: loadConfig };
};
