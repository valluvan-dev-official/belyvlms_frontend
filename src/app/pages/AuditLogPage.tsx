import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  Shield,
  Activity,
  Calendar
} from 'lucide-react';
import { getAuditLogs, exportAuditLogs, AuditLog, AuditLogFilters } from '../services/AuditService/AuditService';
import { toast } from 'sonner';
import { PermissionGuard } from '../components/PermissionGuard';
import { PERMISSIONS } from '../config/permissions';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AuditLogPage() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // Guard: Redirect if no view permission
  useEffect(() => {
    if (!hasPermission(PERMISSIONS.AUDIT_LOG_VIEW)) {
      navigate('/dashboard');
    }
  }, [hasPermission, navigate]);

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter State
  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 1,
    search: '',
    action_type: '',
    entity_type: '',
    actor_id: '',
    start_date: '',
    end_date: ''
  });

  const fetchLogs = async () => {
    if (!hasPermission(PERMISSIONS.AUDIT_LOG_VIEW)) return;

    setLoading(true);
    try {
      const data = await getAuditLogs({ ...filters, page: currentPage });
      // Robustly handle different API response formats (paginated vs array)
      const results = Array.isArray(data) ? data : (data?.results || []);
      const count = (data as any)?.count || results.length;
      
      setLogs(results);
      setTotalCount(count);
    } catch (error) {
      toast.error("Failed to fetch audit logs");
      setLogs([]); // Ensure logs is never undefined on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, filters.search, filters.action_type, filters.entity_type, filters.start_date, filters.end_date]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      toast.loading("Exporting audit logs...");
      const blob = await exportAuditLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.dismiss();
      toast.success("Audit logs exported successfully");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to export audit logs");
    }
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString();
  };

  const getActionColor = (action: string | undefined | null) => {
    if (!action) return 'bg-gray-100 text-gray-700';
    
    // Normalize string to handle case variations
    const upperAction = action.toUpperCase();
    
    if (upperAction.includes('CREATE') || upperAction.includes('ADD')) return 'bg-green-100 text-green-700';
    if (upperAction.includes('UPDATE') || upperAction.includes('EDIT')) return 'bg-blue-100 text-blue-700';
    if (upperAction.includes('DELETE') || upperAction.includes('REMOVE') || upperAction.includes('REVOKE')) return 'bg-red-100 text-red-700';
    if (upperAction.includes('LOGIN') || upperAction.includes('SIGNIN')) return 'bg-purple-100 text-purple-700';
    if (upperAction.includes('LOGOUT') || upperAction.includes('SIGNOUT')) return 'bg-gray-100 text-gray-700';
    
    return 'bg-gray-100 text-gray-700';
  };

  const formatDetails = (log: AuditLog) => {
    if (log.old_value && log.new_value) {
      return `Changed from ${JSON.stringify(log.old_value)} to ${JSON.stringify(log.new_value)}`;
    }
    if (log.old_value) {
      return `Removed: ${JSON.stringify(log.old_value)}`;
    }
    if (log.new_value) {
      return `Added: ${JSON.stringify(log.new_value)}`;
    }
    return '-';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1D1F] flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#4ECDC4]" />
            Audit Logs
          </h1>
          <p className="text-[#6E7191] text-sm mt-1">
            System-wide activity tracking and security events (Read-Only).
          </p>
        </div>
        <div className="flex gap-3">
          <PermissionGuard permission={PERMISSIONS.AUDIT_LOG_EXPORT}>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E0E2] rounded-xl text-[#1A1D1F] font-medium hover:bg-[#F7F7F8] transition-colors"
            >
              <Download size={20} />
              <span>Export CSV</span>
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#F5F5F7] shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2 text-[#1A1D1F] font-semibold">
          <Filter size={18} />
          <span>Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9FA5]" size={18} />
            <input
              type="text"
              placeholder="Search details, IP..."
              value={filters.search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F4] rounded-xl border-none text-sm focus:ring-2 focus:ring-[#4ECDC4]/20 transition-all outline-none"
            />
          </div>
          
          <select
            value={filters.entity_type || ''}
            onChange={(e) => handleFilterChange('entity_type', e.target.value)}
            className="px-4 py-2.5 bg-[#F4F4F4] rounded-xl border-none text-sm focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none text-[#1A1D1F]"
          >
            <option value="">All Modules</option>
            <option value="Auth">Authentication</option>
            <option value="User">User Management</option>
            <option value="Student">Student Management</option>
            <option value="Trainer">Trainer Management</option>
            <option value="Access Control">Access Control</option>
            <option value="Permission">Permission</option>
          </select>

          <select
            value={filters.action_type || ''}
            onChange={(e) => handleFilterChange('action_type', e.target.value)}
            className="px-4 py-2.5 bg-[#F4F4F4] rounded-xl border-none text-sm focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none text-[#1A1D1F]"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="VIEW">View</option>
            <option value="PERMISSION_REVOKE">Permission Revoke</option>
            <option value="PERMISSION_GRANT">Permission Grant</option>
          </select>

          <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9FA5]" size={18} />
             <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F4] rounded-xl border-none text-sm focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none text-[#1A1D1F]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#F5F5F7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F4F4F4] border-b border-[#E0E0E2]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">User / Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Module</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6E7191]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin w-6 h-6 border-2 border-[#4ECDC4] border-t-transparent rounded-full"></div>
                      <span>Loading logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6E7191]">
                    <div className="flex flex-col items-center gap-3">
                      <FileText size={32} className="opacity-20" />
                      <span>No audit logs found matching your criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6E7191]">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                          {(log.actor_role || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                           {log.actor_user_id ? (
                               <span className="text-sm font-medium text-[#1A1D1F]">User ID: {log.actor_user_id}</span>
                           ) : (
                               <span className="text-sm font-medium text-[#1A1D1F]">{log.actor_role || 'Unknown'}</span>
                           )}
                           {log.actor_role && <span className="text-xs text-gray-400">{log.actor_role}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getActionColor(log.action_type)}`}>
                        {log.action_type || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1D1F]">
                      {log.entity_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6E7191] font-mono">
                      {log.ip_address || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A1D1F] max-w-xs truncate" title={JSON.stringify(log.old_value)}>
                      {formatDetails(log)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[#F5F5F7] flex items-center justify-between">
          <p className="text-sm text-[#6E7191]">
            Showing <span className="font-medium text-[#1A1D1F]">{logs.length > 0 ? (currentPage - 1) * 20 + 1 : 0}</span> to{' '}
            <span className="font-medium text-[#1A1D1F]">{Math.min(currentPage * 20, totalCount)}</span> of{' '}
            <span className="font-medium text-[#1A1D1F]">{totalCount}</span> results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#E0E0E2] text-[#6E7191] disabled:opacity-50 hover:bg-[#F7F7F8] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * 20 >= totalCount}
              className="p-2 rounded-lg border border-[#E0E0E2] text-[#6E7191] disabled:opacity-50 hover:bg-[#F7F7F8] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
