import { api, getActiveRoleCode } from './AuthenticationService/AuthenticationService';
import { DashboardLayoutConfig } from '../components/dashboard/registry/dashboardConfig';

export interface UIConfigResponse {
  config: DashboardLayoutConfig;      // The actual layout JSON (tabs, widgets)
  version: number;
  source: 'role_default' | 'user_preference'; // To show "Reset to Default" button if needed
}

export const UiConfigService = {
  /**
   * Fetch UI Configuration from Backend
   * GET /api/ui/config/?module=dashboard
   */
  getDashboardConfig: async (module: string = 'dashboard'): Promise<UIConfigResponse> => {
    try {
      const roleCode = getActiveRoleCode();
      const response = await api.get(`ui/config/`, {
        params: { module },
        headers: roleCode ? { "X-Active-Role": roleCode } : {}
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch UI config", error);
      throw error;
    }
  },

  /**
   * Save User Customization
   * POST /api/ui/config/
   */
  saveDashboardConfig: async (config: DashboardLayoutConfig, module: string = 'dashboard') => {
    try {
      const roleCode = getActiveRoleCode();
      const response = await api.post(`ui/config/`, {
        module,
        config // Send the modified JSON back
      }, {
        headers: roleCode ? { "X-Active-Role": roleCode } : {}
      });
      return response.data;
    } catch (error) {
      console.error("Failed to save UI config", error);
      throw error;
    }
  }
};
