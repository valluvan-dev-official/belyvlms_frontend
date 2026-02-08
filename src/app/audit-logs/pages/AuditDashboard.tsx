import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  Shield, 
  XCircle,
  Eye,
  TrendingUp,
  ChevronRight,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { 
  auditSummary, 
  timelineActivity, 
  severityDistribution,
  moduleActivity,
  suspiciousActivities 
} from '../api';

export function AuditDashboard() {
  const navigate = useNavigate();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#FF6B9D';
      case 'HIGH': return '#FFA500';
      case 'MEDIUM': return '#4ECDC4';
      case 'LOW': return '#6E7191';
      default: return '#6E7191';
    }
  };

  const unresolvedSuspicious = suspiciousActivities.filter(s => !s.resolved);

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#F5F5F7] px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1D1F] mb-2">Security Intelligence Dashboard</h1>
              <p className="text-[#6E7191]">
                Real-time audit monitoring, forensic investigation, and compliance tracking
              </p>
            </div>
            <button
              onClick={() => navigate('/audit/investigation')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1D1F] text-white rounded-xl hover:bg-[#2A2D2F] transition-colors"
            >
              <Eye size={18} />
              Open Investigation Grid
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#6E7191]">
            <Clock size={16} />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center">
                <Activity className="text-[#44A08D]" size={24} />
              </div>
              <span className="text-xs text-[#6E7191] bg-[#F7F7F8] px-2 py-1 rounded">Today</span>
            </div>
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {auditSummary.totalEventsToday.toLocaleString()}
            </div>
            <div className="text-sm text-[#6E7191]">Total System Events</div>
            <div className="mt-3 text-xs text-[#6E7191]">
              Week: {auditSummary.totalEventsWeek.toLocaleString()} | Month: {auditSummary.totalEventsMonth.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B9D]/10 flex items-center justify-center">
                <AlertTriangle className="text-[#FF6B9D]" size={24} />
              </div>
              <span className="text-xs text-white bg-[#FF6B9D] px-2 py-1 rounded font-medium">Critical</span>
            </div>
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {auditSummary.criticalEvents}
            </div>
            <div className="text-sm text-[#6E7191]">Critical Security Events</div>
            <button 
              onClick={() => navigate('/audit/investigation?severity=CRITICAL')}
              className="mt-3 text-xs text-[#FF6B9D] hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#44A08D]/10 flex items-center justify-center">
                <Shield className="text-[#44A08D]" size={24} />
              </div>
              <span className="text-xs text-[#6E7191] bg-[#F7F7F8] px-2 py-1 rounded">RBAC</span>
            </div>
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {auditSummary.permissionChanges}
            </div>
            <div className="text-sm text-[#6E7191]">Permission Changes</div>
            <button 
              onClick={() => navigate('/audit/rbac-trace')}
              className="mt-3 text-xs text-[#44A08D] hover:underline flex items-center gap-1"
            >
              View RBAC Trace <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFA500]/10 flex items-center justify-center">
                <XCircle className="text-[#FFA500]" size={24} />
              </div>
              <span className="text-xs text-[#6E7191] bg-[#F7F7F8] px-2 py-1 rounded">Auth</span>
            </div>
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {auditSummary.failedLogins}
            </div>
            <div className="text-sm text-[#6E7191]">Failed Login Attempts</div>
            <button 
              onClick={() => navigate('/audit/investigation?action=LOGIN&status=FAILURE')}
              className="mt-3 text-xs text-[#FFA500] hover:underline flex items-center gap-1"
            >
              Investigate <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Suspicious Activity Alert */}
        {unresolvedSuspicious.length > 0 && (
          <div className="bg-gradient-to-r from-[#FF6B9D]/10 to-[#FF4757]/10 border border-[#FF6B9D]/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B9D] flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1A1D1F] mb-2">
                  {unresolvedSuspicious.length} Suspicious {unresolvedSuspicious.length === 1 ? 'Activity' : 'Activities'} Detected
                </h3>
                <p className="text-sm text-[#6E7191] mb-4">
                  Unusual patterns detected that require immediate attention
                </p>
                <div className="space-y-2">
                  {unresolvedSuspicious.slice(0, 2).map(activity => (
                    <div key={activity.id} className="bg-white rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${
                          activity.severity === 'CRITICAL' ? 'bg-[#FF6B9D]' : 'bg-[#FFA500]'
                        }`}></span>
                        <div>
                          <div className="font-medium text-[#1A1D1F] text-sm">{activity.description}</div>
                          <div className="text-xs text-[#6E7191]">
                            {activity.actorUserName} • {activity.eventCount} events
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/audit/suspicious')}
                        className="text-xs text-[#FF6B9D] hover:underline"
                      >
                        Investigate
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/audit/suspicious')}
                  className="mt-4 text-sm text-[#FF6B9D] hover:underline flex items-center gap-1"
                >
                  View All Suspicious Activities <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Timeline Chart */}
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-[#1A1D1F] mb-1">24-Hour Activity Timeline</h3>
              <p className="text-sm text-[#6E7191]">Event distribution by severity over time</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#6E7191"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6E7191"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #F5F5F7',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="critical" stroke="#FF6B9D" strokeWidth={2} name="Critical" />
                <Line type="monotone" dataKey="high" stroke="#FFA500" strokeWidth={2} name="High" />
                <Line type="monotone" dataKey="medium" stroke="#4ECDC4" strokeWidth={2} name="Medium" />
                <Line type="monotone" dataKey="low" stroke="#6E7191" strokeWidth={2} name="Low" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Severity Distribution */}
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-[#1A1D1F] mb-1">Severity Distribution</h3>
              <p className="text-sm text-[#6E7191]">Event classification breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.severity}: ${entry.percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #F5F5F7',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Activity Heatmap */}
        <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-[#1A1D1F] mb-1">Module Activity Heatmap</h3>
            <p className="text-sm text-[#6E7191]">Event volume by functional module</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
              <XAxis 
                dataKey="module" 
                stroke="#6E7191"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6E7191"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #F5F5F7',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#4ECDC4" name="Total Events" />
              <Bar dataKey="criticalCount" fill="#FF6B9D" name="Critical Events" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/audit/investigation')}
            className="bg-white rounded-2xl border border-[#F5F5F7] p-6 hover:shadow-lg hover:shadow-black/5 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center mb-4">
              <Eye className="text-[#44A08D]" size={24} />
            </div>
            <h3 className="font-semibold text-[#1A1D1F] mb-2">Enterprise Investigation Grid</h3>
            <p className="text-sm text-[#6E7191] mb-4">
              Advanced forensic exploration with multi-dimensional filtering
            </p>
            <div className="flex items-center gap-2 text-sm text-[#44A08D] group-hover:gap-3 transition-all">
              Open Investigation Tool <ChevronRight size={16} />
            </div>
          </button>

          <button
            onClick={() => navigate('/audit/rbac-trace')}
            className="bg-white rounded-2xl border border-[#F5F5F7] p-6 hover:shadow-lg hover:shadow-black/5 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#44A08D]/10 flex items-center justify-center mb-4">
              <Shield className="text-[#44A08D]" size={24} />
            </div>
            <h3 className="font-semibold text-[#1A1D1F] mb-2">RBAC Traceability Explorer</h3>
            <p className="text-sm text-[#6E7191] mb-4">
              Track permission changes and role modifications
            </p>
            <div className="flex items-center gap-2 text-sm text-[#44A08D] group-hover:gap-3 transition-all">
              View RBAC History <ChevronRight size={16} />
            </div>
          </button>

          <button
            onClick={() => navigate('/audit/suspicious')}
            className="bg-white rounded-2xl border border-[#F5F5F7] p-6 hover:shadow-lg hover:shadow-black/5 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF6B9D]/10 flex items-center justify-center mb-4">
              <AlertTriangle className="text-[#FF6B9D]" size={24} />
            </div>
            <h3 className="font-semibold text-[#1A1D1F] mb-2">Suspicious Activity Detection</h3>
            <p className="text-sm text-[#6E7191] mb-4">
              AI-powered anomaly detection and security alerts
            </p>
            <div className="flex items-center gap-2 text-sm text-[#FF6B9D] group-hover:gap-3 transition-all">
              Review Alerts <ChevronRight size={16} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
