import { api } from "../AuthenticationService/AuthenticationService";

export interface AuditLog {
  id: number;
  timestamp: string;
  actor_user_id: number | null;
  actor_role: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  old_value: any;
  new_value: any;
  source: string;
  ip_address?: string;
  user_agent?: string;
  correlation_id?: string;
}

export interface AuditLogListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AuditLog[];
}

export interface AuditLogFilters {
  page?: number;
  page_size?: number;
  search?: string;
  actor_id?: string;
  action_type?: string;
  entity_type?: string;
  start_date?: string;
  end_date?: string;
}

const ENDPOINT = "audit/logs/";

/**
 * Fetch Audit Logs (Read-Only)
 * GET /api/audit/logs/
 */
export const getAuditLogs = async (filters: AuditLogFilters = {}): Promise<AuditLogListResponse> => {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<AuditLogListResponse>(`${ENDPOINT}?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
       console.warn("Access denied to fetch audit logs (403). Returning empty list.");
       return { count: 0, next: null, previous: null, results: [] };
    }
    console.error("Failed to fetch audit logs", error);
    throw error;
  }
};

/**
 * Export Audit Logs (Read-Only)
 * GET /api/audit/logs/export/
 */
export const exportAuditLogs = async (filters: AuditLogFilters = {}): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`${ENDPOINT}export/?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Failed to export audit logs", error);
    throw error;
  }
};
