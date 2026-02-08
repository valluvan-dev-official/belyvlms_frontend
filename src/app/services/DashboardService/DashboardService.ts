import { api, getActiveRoleCode } from '../AuthenticationService/AuthenticationService';

// ==========================================
// 1. Types & Interfaces
// ==========================================

export interface HeroStat {
  key: string;
  label: string;
  value: string | number;
  subtext: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon?: string; // Icon name to map in frontend
}

export interface GrowthData {
  xAxis: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  detail: string;
  change: string;
  color_theme: 'purple' | 'orange' | 'cyan' | 'indigo' | 'pink';
}

export interface DistributionData {
  categories: string[];
  active_data: number[];
  inactive_data: number[];
}

export interface ScheduleEvent {
  id: number | string;
  title: string;
  time: string;
  type: 'class' | 'meeting' | 'other';
  attendees_count?: number;
  image?: string;
}

export interface ScheduleResponse {
  date: string;
  events: ScheduleEvent[];
}

// ==========================================
// 2. Dashboard Service
// ==========================================

const DASHBOARD_BASE = 'dashboard';

export const DashboardService = {
  /**
   * Get Hero Stats (Top Cards)
   */
  getStats: async (): Promise<HeroStat[]> => {
    try {
      const roleCode = getActiveRoleCode();
      const response = await api.get(`${DASHBOARD_BASE}/stats/`, {
        headers: roleCode ? { "X-Active-Role": roleCode } : {}
      });
      // Handle both array and object wrapper responses
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.stats)) return data.stats;
      if (data && Array.isArray(data.data)) return data.data;
      return [];
    } catch (error) {
      console.error("Failed to fetch stats", error);
      // Return empty array instead of throwing to prevent UI crash
      return [];
    }
  },

  /**
   * Get Growth Trend Data (Line Chart)
   */
  getGrowthTrend: async (period: '6m' | '1y' | '30d' | 'all' = '6m'): Promise<GrowthData> => {
    try {
      const roleCode = getActiveRoleCode();
      const response = await api.get(`${DASHBOARD_BASE}/growth-trend/`, { 
        params: { period },
        headers: roleCode ? { "X-Active-Role": roleCode } : {}
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch growth trend", error);
      // Fallback to provided mock data so the chart is not empty
      return {
        xAxis: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
        series: [
          { name: "Total Students", data: [1, 0, 1, 0, 3, 0] },
          { name: "Total Trainers", data: [0, 0, 0, 0, 0, 0] }
        ]
      };
    }
  },

  /**
   * Get Key Metrics (Sidebar)
   */
  getKeyMetrics: async (): Promise<MetricItem[]> => {
    try {
      const roleCode = getActiveRoleCode();
      const response = await api.get(`${DASHBOARD_BASE}/key-metrics/`, {
        headers: roleCode ? { "X-Active-Role": roleCode } : {}
      });
      const data = response.data;
      return Array.isArray(data) ? data : (data.metrics || []);
    } catch (error) {
      console.error("Failed to fetch key metrics", error);
      return [];
    }
  },

  /**
   * Get User Distribution (Bar Chart)
   */
  getUserDistribution: async (): Promise<DistributionData> => {
    try {
      const roleCode = getActiveRoleCode();
      const response = await api.get(`${DASHBOARD_BASE}/user-distribution/`, {
        headers: roleCode ? { "X-Active-Role": roleCode } : {}
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user distribution", error);
      return { categories: [], active_data: [], inactive_data: [] };
    }
  },

  /**
   * Get Today's Schedule
   */
  getTodaySchedule: async (): Promise<ScheduleResponse> => {
    try {
      const roleCode = getActiveRoleCode();
      const response = await api.get(`${DASHBOARD_BASE}/schedule/today/`, {
        headers: roleCode ? { "X-Active-Role": roleCode } : {}
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch schedule", error);
      return { date: new Date().toISOString(), events: [] };
    }
  }
};
