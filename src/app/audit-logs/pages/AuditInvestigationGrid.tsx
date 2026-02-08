import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Monitor,
  Calendar,
  User,
  Shield,
  Activity,
  Link as LinkIcon
} from 'lucide-react';
import { auditEvents } from '../api';
import { AuditEvent, SeverityLevel, ActionType, ModuleType } from '../types';

export function AuditInvestigationGrid() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel[]>([]);
  const [moduleFilter, setModuleFilter] = useState<ModuleType[]>([]);
  const [actionFilter, setActionFilter] = useState<ActionType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Apply filters
  const filteredEvents = useMemo(() => {
    return auditEvents.filter(event => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          event.actorUserName.toLowerCase().includes(query) ||
          event.actorEmail.toLowerCase().includes(query) ||
          event.targetEntity.toLowerCase().includes(query) ||
          event.actionDescription.toLowerCase().includes(query) ||
          event.ipAddress.includes(query) ||
          event.correlationId.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Severity filter
      if (severityFilter.length > 0 && !severityFilter.includes(event.severity)) {
        return false;
      }

      // Module filter
      if (moduleFilter.length > 0 && !moduleFilter.includes(event.module)) {
        return false;
      }

      // Action filter
      if (actionFilter.length > 0 && !actionFilter.includes(event.actionType)) {
        return false;
      }

      // Status filter
      if (statusFilter.length > 0 && !statusFilter.includes(event.status)) {
        return false;
      }

      return true;
    });
  }, [auditEvents, searchQuery, severityFilter, moduleFilter, actionFilter, statusFilter]);

  const getSeverityBadgeColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-[#FF6B9D]/10 text-[#FF6B9D] border-[#FF6B9D]/20';
      case 'HIGH': return 'bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/20';
      case 'MEDIUM': return 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20';
      case 'LOW': return 'bg-[#6E7191]/10 text-[#6E7191] border-[#6E7191]/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      utc: new Date(timestamp).toISOString()
    };
  };

  const activeFilterCount = 
    severityFilter.length + 
    moduleFilter.length + 
    actionFilter.length + 
    statusFilter.length;

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#F5F5F7] px-8 py-6 flex-shrink-0">
        <div className="max-w-[1920px] mx-auto">
          <button
            onClick={() => navigate('/audit')}
            className="flex items-center gap-2 text-[#6E7191] hover:text-[#1A1D1F] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1D1F] mb-2">Enterprise Audit Investigation Grid</h1>
              <p className="text-[#6E7191]">
                Forensic exploration and compliance audit readiness
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/audit/timeline')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#F5F5F7] text-[#1A1D1F] rounded-xl hover:bg-[#F7F7F8] transition-colors"
              >
                <Activity size={18} />
                Timeline View
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1D1F] text-white rounded-xl hover:bg-[#2A2D2F] transition-colors"
              >
                <Download size={18} />
                Export Audit Logs
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6E7191]" size={20} />
              <input
                type="text"
                placeholder="Search by user, entity, IP, correlation ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F7F7F8] border border-[#F5F5F7] rounded-xl text-[#1A1D1F] placeholder-[#6E7191] focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/20 focus:border-[#4ECDC4]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'bg-[#4ECDC4]/10 border-[#4ECDC4] text-[#44A08D]'
                  : 'bg-white border-[#F5F5F7] text-[#6E7191] hover:bg-[#F7F7F8]'
              }`}
            >
              <Filter size={20} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#44A08D] text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 bg-[#F7F7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Severity Filter */}
              <div>
                <label className="text-xs font-medium text-[#6E7191] mb-2 block">Severity</label>
                <div className="space-y-2">
                  {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as SeverityLevel[]).map(sev => (
                    <label key={sev} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={severityFilter.includes(sev)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSeverityFilter([...severityFilter, sev]);
                          } else {
                            setSeverityFilter(severityFilter.filter(s => s !== sev));
                          }
                        }}
                        className="w-4 h-4 rounded border-[#E4E4E7] text-[#44A08D]"
                      />
                      <span className="text-[#1A1D1F]">{sev}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Module Filter */}
              <div>
                <label className="text-xs font-medium text-[#6E7191] mb-2 block">Module</label>
                <div className="space-y-2">
                  {(['AUTHENTICATION', 'RBAC', 'USER_MANAGEMENT', 'COURSE_MANAGEMENT'] as ModuleType[]).map(mod => (
                    <label key={mod} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={moduleFilter.includes(mod)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setModuleFilter([...moduleFilter, mod]);
                          } else {
                            setModuleFilter(moduleFilter.filter(m => m !== mod));
                          }
                        }}
                        className="w-4 h-4 rounded border-[#E4E4E7] text-[#44A08D]"
                      />
                      <span className="text-[#1A1D1F] text-xs">{mod.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Filter */}
              <div>
                <label className="text-xs font-medium text-[#6E7191] mb-2 block">Action Type</label>
                <div className="space-y-2">
                  {(['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'RBAC_CHANGE'] as ActionType[]).map(act => (
                    <label key={act} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={actionFilter.includes(act)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setActionFilter([...actionFilter, act]);
                          } else {
                            setActionFilter(actionFilter.filter(a => a !== act));
                          }
                        }}
                        className="w-4 h-4 rounded border-[#E4E4E7] text-[#44A08D]"
                      />
                      <span className="text-[#1A1D1F]">{act.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs font-medium text-[#6E7191] mb-2 block">Status</label>
                <div className="space-y-2">
                  {['SUCCESS', 'FAILURE'].map(stat => (
                    <label key={stat} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={statusFilter.includes(stat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStatusFilter([...statusFilter, stat]);
                          } else {
                            setStatusFilter(statusFilter.filter(s => s !== stat));
                          }
                        }}
                        className="w-4 h-4 rounded border-[#E4E4E7] text-[#44A08D]"
                      />
                      <span className="text-[#1A1D1F]">{stat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="md:col-span-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSeverityFilter([]);
                      setModuleFilter([]);
                      setActionFilter([]);
                      setStatusFilter([]);
                    }}
                    className="text-sm text-[#6E7191] hover:text-[#1A1D1F] flex items-center gap-2"
                  >
                    <X size={16} />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="bg-white border-b border-[#F5F5F7] px-8 py-3 flex-shrink-0">
        <div className="max-w-[1920px] mx-auto text-sm text-[#6E7191]">
          Showing <span className="font-medium text-[#1A1D1F]">{filteredEvents.length}</span> of {auditEvents.length} events
        </div>
      </div>

      {/* Grid Table */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1920px] mx-auto px-8 py-6">
          <div className="bg-white rounded-2xl border border-[#F5F5F7] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F7F7F8] sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      Actor User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      Actor Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      Target Entity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      Action Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      Module
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      Severity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#1A1D1F] border-b border-[#F5F5F7]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, index) => {
                    const timestamp = formatTimestamp(event.timestamp);
                    return (
                      <tr 
                        key={event.id}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'} hover:bg-[#F7F7F8] cursor-pointer transition-colors`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          <div className="text-sm text-[#1A1D1F]">{timestamp.date}</div>
                          <div className="text-xs text-[#6E7191]">{timestamp.time}</div>
                        </td>
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          <div className="text-sm text-[#1A1D1F] font-medium">{event.actorUserName}</div>
                          <div className="text-xs text-[#6E7191]">{event.actorEmail}</div>
                        </td>
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          <span className="text-xs bg-[#F7F7F8] px-2 py-1 rounded text-[#6E7191]">
                            {event.actorRole}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          <div className="text-sm text-[#1A1D1F]">{event.targetEntity}</div>
                        </td>
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          <span className="text-xs font-medium text-[#1A1D1F]">
                            {event.actionType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          <span className="text-xs text-[#6E7191]">
                            {event.module.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${getSeverityBadgeColor(event.severity)}`}>
                            {event.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          <div className="text-xs font-mono text-[#6E7191]">{event.ipAddress}</div>
                        </td>
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          {event.status === 'SUCCESS' ? (
                            <CheckCircle2 className="text-[#44A08D]" size={18} />
                          ) : (
                            <XCircle className="text-[#FF6B9D]" size={18} />
                          )}
                        </td>
                        <td className="px-4 py-3 border-b border-[#F5F5F7]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                            className="flex items-center gap-1 text-xs text-[#44A08D] hover:underline"
                          >
                            <Eye size={14} />
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredEvents.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-[#F7F7F8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-[#6E7191]" size={24} />
                  </div>
                  <h3 className="text-[#1A1D1F] font-semibold mb-2">No events found</h3>
                  <p className="text-[#6E7191]">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Event Investigation Drawer */}
      {selectedEvent && (
        <ForensicEventDrawer 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}

// Forensic Event Investigation Drawer Component
function ForensicEventDrawer({ event, onClose }: { event: AuditEvent; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'metadata' | 'changes' | 'rbac'>('metadata');
  
  const timestamp = {
    local: new Date(event.timestamp).toLocaleString(),
    utc: event.timestampUTC
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A1D1F] to-[#2A2D2F] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-semibold text-lg">Forensic Event Investigation</h2>
            <p className="text-white/70 text-sm">Event ID: {event.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-[#F5F5F7] px-6 flex gap-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'metadata'
                ? 'border-[#4ECDC4] text-[#1A1D1F]'
                : 'border-transparent text-[#6E7191] hover:text-[#1A1D1F]'
            }`}
          >
            Event Metadata
          </button>
          {event.changeData && (
            <button
              onClick={() => setActiveTab('changes')}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'changes'
                  ? 'border-[#4ECDC4] text-[#1A1D1F]'
                  : 'border-transparent text-[#6E7191] hover:text-[#1A1D1F]'
              }`}
            >
              Change Diff
            </button>
          )}
          {event.module === 'RBAC' && (
            <button
              onClick={() => setActiveTab('rbac')}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'rbac'
                  ? 'border-[#4ECDC4] text-[#1A1D1F]'
                  : 'border-transparent text-[#6E7191] hover:text-[#1A1D1F]'
              }`}
            >
              RBAC Context
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F7F7F8]">
          {activeTab === 'metadata' && (
            <div className="space-y-4">
              {/* Event Identity */}
              <div className="bg-white rounded-xl border border-[#F5F5F7] p-4">
                <h3 className="font-semibold text-[#1A1D1F] mb-4 flex items-center gap-2">
                  <Activity size={18} />
                  Event Identity
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">Event Unique ID</div>
                    <div className="text-sm font-mono text-[#1A1D1F] bg-[#F7F7F8] px-3 py-2 rounded">{event.id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">Correlation ID</div>
                    <div className="text-sm font-mono text-[#1A1D1F] bg-[#F7F7F8] px-3 py-2 rounded flex items-center gap-2">
                      <LinkIcon size={14} className="text-[#6E7191]" />
                      {event.correlationId}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-[#6E7191] mb-1">Local Time</div>
                      <div className="text-sm text-[#1A1D1F]">{timestamp.local}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6E7191] mb-1">UTC Time</div>
                      <div className="text-sm font-mono text-[#1A1D1F]">{timestamp.utc}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actor Details */}
              <div className="bg-white rounded-xl border border-[#F5F5F7] p-4">
                <h3 className="font-semibold text-[#1A1D1F] mb-4 flex items-center gap-2">
                  <User size={18} />
                  Actor Identity
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">User Name</div>
                    <div className="text-sm font-medium text-[#1A1D1F]">{event.actorUserName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">Email Address</div>
                    <div className="text-sm text-[#1A1D1F]">{event.actorEmail}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">Actor Role</div>
                    <span className="text-xs bg-[#4ECDC4]/10 text-[#44A08D] px-3 py-1.5 rounded-lg border border-[#4ECDC4]/20">
                      {event.actorRole}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">Session ID</div>
                    <div className="text-sm font-mono text-[#1A1D1F]">{event.sessionId}</div>
                  </div>
                </div>
              </div>

              {/* Technical Context */}
              <div className="bg-white rounded-xl border border-[#F5F5F7] p-4">
                <h3 className="font-semibold text-[#1A1D1F] mb-4 flex items-center gap-2">
                  <Monitor size={18} />
                  Technical Context
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">Source Channel</div>
                    <span className="text-xs bg-[#F7F7F8] text-[#1A1D1F] px-3 py-1.5 rounded font-medium">
                      {event.sourceChannel}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">IP Address</div>
                    <div className="text-sm font-mono text-[#1A1D1F]">{event.ipAddress}</div>
                  </div>
                  {event.geoLocation && (
                    <div>
                      <div className="text-xs text-[#6E7191] mb-1">Geo Location</div>
                      <div className="text-sm text-[#1A1D1F] flex items-center gap-2">
                        <MapPin size={14} className="text-[#6E7191]" />
                        {event.geoLocation.city}, {event.geoLocation.country}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-[#6E7191] mb-1">Device</div>
                      <div className="text-sm text-[#1A1D1F]">{event.device}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6E7191] mb-1">Browser</div>
                      <div className="text-sm text-[#1A1D1F]">{event.browser}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">User Agent</div>
                    <div className="text-xs font-mono text-[#6E7191] bg-[#F7F7F8] px-3 py-2 rounded break-all">
                      {event.userAgent}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Summary */}
              <div className="bg-white rounded-xl border border-[#F5F5F7] p-4">
                <h3 className="font-semibold text-[#1A1D1F] mb-4 flex items-center gap-2">
                  <Shield size={18} />
                  Action Summary
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">Description</div>
                    <div className="text-sm text-[#1A1D1F]">{event.actionDescription}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-[#6E7191] mb-1">Action Type</div>
                      <div className="text-sm font-medium text-[#1A1D1F]">{event.actionType}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6E7191] mb-1">Module</div>
                      <div className="text-sm text-[#1A1D1F]">{event.module}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6E7191] mb-1">Severity</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                        event.severity === 'CRITICAL' ? 'bg-[#FF6B9D]/10 text-[#FF6B9D] border-[#FF6B9D]/20' :
                        event.severity === 'HIGH' ? 'bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/20' :
                        event.severity === 'MEDIUM' ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20' :
                        'bg-[#6E7191]/10 text-[#6E7191] border-[#6E7191]/20'
                      }`}>
                        {event.severity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6E7191] mb-1">Status</div>
                    <div className="flex items-center gap-2">
                      {event.status === 'SUCCESS' ? (
                        <>
                          <CheckCircle2 className="text-[#44A08D]" size={16} />
                          <span className="text-sm text-[#44A08D] font-medium">Success</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-[#FF6B9D]" size={16} />
                          <span className="text-sm text-[#FF6B9D] font-medium">Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                  {event.errorMessage && (
                    <div>
                      <div className="text-xs text-[#6E7191] mb-1">Error Message</div>
                      <div className="text-sm text-[#FF6B9D] bg-[#FF6B9D]/10 px-3 py-2 rounded border border-[#FF6B9D]/20">
                        {event.errorMessage}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'changes' && event.changeData && (
            <div className="bg-white rounded-xl border border-[#F5F5F7] p-4">
              <h3 className="font-semibold text-[#1A1D1F] mb-4">Change Comparison</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-[#6E7191] mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF6B9D]"></div>
                    Old Value
                  </div>
                  <div className="bg-[#FF6B9D]/5 border border-[#FF6B9D]/20 rounded-lg p-3">
                    <pre className="text-xs font-mono text-[#1A1D1F] whitespace-pre-wrap break-all">
                      {JSON.stringify(event.changeData.oldValue, null, 2)}
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#6E7191] mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#44A08D]"></div>
                    New Value
                  </div>
                  <div className="bg-[#44A08D]/5 border border-[#44A08D]/20 rounded-lg p-3">
                    <pre className="text-xs font-mono text-[#1A1D1F] whitespace-pre-wrap break-all">
                      {JSON.stringify(event.changeData.newValue, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs font-medium text-[#6E7191] mb-2">Changed Fields</div>
                <div className="flex flex-wrap gap-2">
                  {event.changeData.changedFields.map(field => (
                    <span key={field} className="text-xs bg-[#4ECDC4]/10 text-[#44A08D] px-3 py-1 rounded border border-[#4ECDC4]/20">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rbac' && event.module === 'RBAC' && (
            <div className="bg-white rounded-xl border border-[#F5F5F7] p-4">
              <h3 className="font-semibold text-[#1A1D1F] mb-4 flex items-center gap-2">
                <Shield size={18} />
                RBAC Context
              </h3>
              <div className="space-y-4">
                <div className="bg-[#FFF9E6] border border-[#FFE99A] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-[#FFA500] flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="text-sm font-medium text-[#1A1D1F] mb-1">
                        Critical Permission Modification
                      </div>
                      <div className="text-xs text-[#6E7191]">
                        This action modified role permissions which affects {Math.floor(Math.random() * 50) + 10} users in the system.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-[#6E7191] mb-2">Permission Impact Analysis</div>
                  <div className="text-sm text-[#1A1D1F]">
                    Based on this RBAC change, the following users are affected and may have gained or lost access to specific system features.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
