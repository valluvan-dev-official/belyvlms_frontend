import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  UserPlus,
  UserMinus,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Clock,
  User
} from 'lucide-react';
import { rbacTraceEvents } from '../api';
import { RBACTraceEvent } from '../types';

export function RBACTraceabilityPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<RBACTraceEvent | null>(null);

  // Get unique roles
  const roles = Array.from(new Set(rbacTraceEvents.map(e => e.targetRole)));

  // Filter events by selected role
  const filteredEvents = selectedRole
    ? rbacTraceEvents.filter(e => e.targetRole === selectedRole)
    : rbacTraceEvents;

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'ROLE_CREATED': return Plus;
      case 'ROLE_MODIFIED': return Edit;
      case 'ROLE_DELETED': return Trash2;
      case 'PERMISSION_ADDED': return Shield;
      case 'PERMISSION_REMOVED': return Shield;
      case 'USER_ASSIGNED': return UserPlus;
      case 'USER_UNASSIGNED': return UserMinus;
      default: return Shield;
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'ROLE_CREATED': return 'text-[#44A08D] bg-[#44A08D]/10';
      case 'ROLE_MODIFIED': return 'text-[#4ECDC4] bg-[#4ECDC4]/10';
      case 'ROLE_DELETED': return 'text-[#FF6B9D] bg-[#FF6B9D]/10';
      case 'PERMISSION_ADDED': return 'text-[#44A08D] bg-[#44A08D]/10';
      case 'PERMISSION_REMOVED': return 'text-[#FFA500] bg-[#FFA500]/10';
      case 'USER_ASSIGNED': return 'text-[#4ECDC4] bg-[#4ECDC4]/10';
      case 'USER_UNASSIGNED': return 'text-[#6E7191] bg-[#6E7191]/10';
      default: return 'text-[#6E7191] bg-[#6E7191]/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#F5F5F7] px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/audit')}
            className="flex items-center gap-2 text-[#6E7191] hover:text-[#1A1D1F] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#1A1D1F] mb-2">RBAC Traceability Explorer</h1>
            <p className="text-[#6E7191]">
              Complete history of role modifications and permission changes
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {rbacTraceEvents.length}
            </div>
            <div className="text-sm text-[#6E7191]">Total RBAC Events</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {rbacTraceEvents.filter(e => e.changeType.includes('ROLE')).length}
            </div>
            <div className="text-sm text-[#6E7191]">Role Changes</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {rbacTraceEvents.filter(e => e.changeType.includes('PERMISSION')).length}
            </div>
            <div className="text-sm text-[#6E7191]">Permission Changes</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {rbacTraceEvents.filter(e => e.changeType.includes('USER')).length}
            </div>
            <div className="text-sm text-[#6E7191]">User Assignments</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Role Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#F5F5F7] p-4 sticky top-6">
              <h3 className="font-semibold text-[#1A1D1F] mb-4">Filter by Role</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedRole(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedRole === null
                      ? 'bg-[#4ECDC4]/10 text-[#44A08D] font-medium'
                      : 'text-[#6E7191] hover:bg-[#F7F7F8]'
                  }`}
                >
                  All Roles
                </button>
                {roles.map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedRole === role
                        ? 'bg-[#4ECDC4]/10 text-[#44A08D] font-medium'
                        : 'text-[#6E7191] hover:bg-[#F7F7F8]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#F5F5F7] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F5F5F7]">
                <h2 className="font-semibold text-[#1A1D1F]">
                  {selectedRole ? `${selectedRole} Timeline` : 'All RBAC Changes'}
                </h2>
                <p className="text-sm text-[#6E7191] mt-1">
                  Showing {filteredEvents.length} events
                </p>
              </div>

              <div className="p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#E4E4E7]"></div>

                  {/* Events */}
                  <div className="space-y-6">
                    {filteredEvents.map((event, index) => {
                      const Icon = getChangeTypeIcon(event.changeType);
                      const colorClass = getChangeTypeColor(event.changeType);

                      return (
                        <div key={event.id} className="relative pl-16">
                          {/* Timeline node */}
                          <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                            <Icon size={20} />
                          </div>

                          {/* Event card */}
                          <div 
                            className="bg-[#F7F7F8] rounded-xl p-4 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${colorClass}`}>
                                    {event.changeType.replace(/_/g, ' ')}
                                  </span>
                                  <span className="text-xs bg-white px-2 py-1 rounded text-[#6E7191]">
                                    {event.targetRole}
                                  </span>
                                </div>
                                <p className="text-sm text-[#1A1D1F] font-medium mb-1">
                                  {event.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-[#6E7191]">
                                  <span className="flex items-center gap-1">
                                    <User size={12} />
                                    {event.actorUserName}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(event.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="text-[#6E7191] flex-shrink-0 mt-1" size={20} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {filteredEvents.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-[#F7F7F8] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="text-[#6E7191]" size={32} />
                    </div>
                    <h3 className="text-[#1A1D1F] font-semibold mb-2">No events found</h3>
                    <p className="text-[#6E7191]">No RBAC changes for the selected filter</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#F5F5F7] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1A1D1F]">RBAC Change Details</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-lg hover:bg-[#F7F7F8] flex items-center justify-center text-[#6E7191] transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-[#1A1D1F] mb-2">Event Information</h3>
                <div className="bg-[#F7F7F8] rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6E7191]">Event ID:</span>
                    <span className="text-[#1A1D1F] font-mono">{selectedEvent.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7191]">Change Type:</span>
                    <span className="text-[#1A1D1F] font-medium">
                      {selectedEvent.changeType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7191]">Target Role:</span>
                    <span className="text-[#1A1D1F] font-medium">{selectedEvent.targetRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7191]">Actor:</span>
                    <span className="text-[#1A1D1F]">{selectedEvent.actorUserName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7191]">Timestamp:</span>
                    <span className="text-[#1A1D1F]">{new Date(selectedEvent.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#1A1D1F] mb-2">Description</h3>
                <p className="text-sm text-[#6E7191] bg-[#F7F7F8] rounded-xl p-4">
                  {selectedEvent.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1A1D1F] mb-2">Change Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedEvent.changeDetails.before !== null && (
                    <div>
                      <div className="text-xs font-medium text-[#6E7191] mb-2">Before</div>
                      <div className="bg-[#FF6B9D]/5 border border-[#FF6B9D]/20 rounded-lg p-3">
                        <pre className="text-xs font-mono text-[#1A1D1F] whitespace-pre-wrap">
                          {JSON.stringify(selectedEvent.changeDetails.before, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  {selectedEvent.changeDetails.after !== null && (
                    <div>
                      <div className="text-xs font-medium text-[#6E7191] mb-2">After</div>
                      <div className="bg-[#44A08D]/5 border border-[#44A08D]/20 rounded-lg p-3">
                        <pre className="text-xs font-mono text-[#1A1D1F] whitespace-pre-wrap">
                          {JSON.stringify(selectedEvent.changeDetails.after, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
