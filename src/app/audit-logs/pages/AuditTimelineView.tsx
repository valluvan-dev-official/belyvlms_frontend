import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Link as LinkIcon, User, Clock } from 'lucide-react';
import { auditEvents } from '../api';
import { AuditEvent } from '../types';

export function AuditTimelineView() {
  const navigate = useNavigate();
  const [selectedCorrelationId, setSelectedCorrelationId] = useState<string | null>(null);

  // Group events by correlation ID
  const groupedByCorrelation = useMemo(() => {
    const groups: Record<string, AuditEvent[]> = {};
    auditEvents.forEach(event => {
      if (!groups[event.correlationId]) {
        groups[event.correlationId] = [];
      }
      groups[event.correlationId].push(event);
    });
    
    // Sort events within each group by timestamp
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
    
    return groups;
  }, []);

  // Get multi-event sessions
  const multiEventSessions = Object.entries(groupedByCorrelation)
    .filter(([_, events]) => events.length > 1)
    .sort(([_, eventsA], [__, eventsB]) => 
      new Date(eventsB[0].timestamp).getTime() - new Date(eventsA[0].timestamp).getTime()
    );

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#F5F5F7] px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/audit/investigation')}
            className="flex items-center gap-2 text-[#6E7191] hover:text-[#1A1D1F] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Investigation Grid
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#1A1D1F] mb-2">Timeline Investigation Mode</h1>
            <p className="text-[#6E7191]">
              Session-grouped events and multi-step workflow replay
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {Object.keys(groupedByCorrelation).length}
            </div>
            <div className="text-sm text-[#6E7191]">Total Sessions</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {multiEventSessions.length}
            </div>
            <div className="text-sm text-[#6E7191]">Multi-Event Sessions</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {auditEvents.length}
            </div>
            <div className="text-sm text-[#6E7191]">Total Events</div>
          </div>
        </div>

        {/* Timeline Sessions */}
        <div className="bg-white rounded-2xl border border-[#F5F5F7] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F5F5F7]">
            <h2 className="font-semibold text-[#1A1D1F]">Session Timeline</h2>
            <p className="text-sm text-[#6E7191] mt-1">
              Click on any session to view detailed event sequence
            </p>
          </div>

          <div className="divide-y divide-[#F5F5F7]">
            {multiEventSessions.map(([correlationId, events]) => {
              const isExpanded = selectedCorrelationId === correlationId;
              const firstEvent = events[0];
              const hasCritical = events.some(e => e.severity === 'CRITICAL');
              const hasFailure = events.some(e => e.status === 'FAILURE');

              return (
                <div key={correlationId} className="hover:bg-[#F7F7F8] transition-colors">
                  <button
                    onClick={() => setSelectedCorrelationId(isExpanded ? null : correlationId)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center flex-shrink-0">
                        <LinkIcon className="text-[#44A08D]" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-[#6E7191]">{correlationId}</span>
                          <span className="text-xs bg-[#F7F7F8] px-2 py-1 rounded text-[#6E7191]">
                            {events.length} events
                          </span>
                          {hasCritical && (
                            <span className="text-xs bg-[#FF6B9D]/10 text-[#FF6B9D] px-2 py-1 rounded border border-[#FF6B9D]/20">
                              Critical
                            </span>
                          )}
                          {hasFailure && (
                            <span className="text-xs bg-[#FFA500]/10 text-[#FFA500] px-2 py-1 rounded border border-[#FFA500]/20">
                              Has Failures
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#1A1D1F]">
                          <span className="flex items-center gap-2">
                            <User size={14} className="text-[#6E7191]" />
                            {firstEvent.actorUserName}
                          </span>
                          <span className="text-[#6E7191]">•</span>
                          <span className="flex items-center gap-2">
                            <Clock size={14} className="text-[#6E7191]" />
                            {new Date(firstEvent.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`text-[#6E7191] transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                      size={20} 
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 bg-[#FAFAFA]">
                      <div className="ml-16 space-y-4">
                        {events.map((event, index) => (
                          <div key={event.id} className="relative">
                            {/* Timeline connector */}
                            {index < events.length - 1 && (
                              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-[#E4E4E7]"></div>
                            )}
                            
                            <div className="bg-white rounded-xl border border-[#F5F5F7] p-4 relative">
                              {/* Step indicator */}
                              <div className="absolute -left-12 top-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white font-bold shadow-lg">
                                {index + 1}
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <div className="text-xs text-[#6E7191] mb-1">Timestamp</div>
                                  <div className="text-sm text-[#1A1D1F]">
                                    {new Date(event.timestamp).toLocaleTimeString()}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-[#6E7191] mb-1">Action</div>
                                  <div className="text-sm font-medium text-[#1A1D1F]">
                                    {event.actionType}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-[#6E7191] mb-1">Module</div>
                                  <div className="text-sm text-[#1A1D1F]">
                                    {event.module.replace(/_/g, ' ')}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-t border-[#F5F5F7]">
                                <div className="text-sm text-[#6E7191]">{event.actionDescription}</div>
                                <div className="text-xs text-[#6E7191] mt-2">
                                  Target: <span className="text-[#1A1D1F]">{event.targetEntity}</span>
                                </div>
                              </div>

                              <div className="mt-3 flex items-center gap-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                                  event.severity === 'CRITICAL' ? 'bg-[#FF6B9D]/10 text-[#FF6B9D] border-[#FF6B9D]/20' :
                                  event.severity === 'HIGH' ? 'bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/20' :
                                  event.severity === 'MEDIUM' ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20' :
                                  'bg-[#6E7191]/10 text-[#6E7191] border-[#6E7191]/20'
                                }`}>
                                  {event.severity}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  event.status === 'SUCCESS' 
                                    ? 'bg-[#44A08D]/10 text-[#44A08D]'
                                    : 'bg-[#FF6B9D]/10 text-[#FF6B9D]'
                                }`}>
                                  {event.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
