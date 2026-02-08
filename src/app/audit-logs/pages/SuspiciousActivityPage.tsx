import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  User,
  TrendingUp
} from 'lucide-react';
import { suspiciousActivities, auditEvents } from '../api';
import { SuspiciousActivity } from '../types';

export function SuspiciousActivityPage() {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<SuspiciousActivity | null>(null);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  const filteredActivities = suspiciousActivities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'unresolved') return !activity.resolved;
    return activity.resolved;
  });

  const getActivityTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'PERMISSION_ESCALATION': return Shield;
      case 'RAPID_RBAC_CHANGE': return TrendingUp;
      case 'FAILED_LOGIN_BURST': return XCircle;
      case 'LOCATION_ANOMALY': return AlertTriangle;
      case 'BULK_MODIFICATION': return AlertTriangle;
      default: return AlertTriangle;
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1D1F] mb-2">Suspicious Activity Detection</h1>
              <p className="text-[#6E7191]">
                AI-powered anomaly detection and security alert monitoring
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {suspiciousActivities.length}
            </div>
            <div className="text-sm text-[#6E7191]">Total Alerts</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#FF6B9D] mb-1">
              {suspiciousActivities.filter(a => !a.resolved).length}
            </div>
            <div className="text-sm text-[#6E7191]">Unresolved</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#44A08D] mb-1">
              {suspiciousActivities.filter(a => a.resolved).length}
            </div>
            <div className="text-sm text-[#6E7191]">Resolved</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {suspiciousActivities.filter(a => a.severity === 'CRITICAL').length}
            </div>
            <div className="text-sm text-[#6E7191]">Critical Severity</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl border border-[#F5F5F7] mb-6">
          <div className="flex border-b border-[#F5F5F7]">
            <button
              onClick={() => setFilter('unresolved')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                filter === 'unresolved'
                  ? 'text-[#1A1D1F] border-b-2 border-[#FF6B9D]'
                  : 'text-[#6E7191] hover:text-[#1A1D1F]'
              }`}
            >
              Unresolved ({suspiciousActivities.filter(a => !a.resolved).length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                filter === 'resolved'
                  ? 'text-[#1A1D1F] border-b-2 border-[#44A08D]'
                  : 'text-[#6E7191] hover:text-[#1A1D1F]'
              }`}
            >
              Resolved ({suspiciousActivities.filter(a => a.resolved).length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'text-[#1A1D1F] border-b-2 border-[#4ECDC4]'
                  : 'text-[#6E7191] hover:text-[#1A1D1F]'
              }`}
            >
              All Alerts ({suspiciousActivities.length})
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {filteredActivities.map(activity => {
            const Icon = getActivityTypeIcon(activity.type);
            
            return (
              <div
                key={activity.id}
                className="bg-white rounded-2xl border border-[#F5F5F7] overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      activity.severity === 'CRITICAL' 
                        ? 'bg-[#FF6B9D]/10' 
                        : 'bg-[#FFA500]/10'
                    }`}>
                      <Icon 
                        className={activity.severity === 'CRITICAL' ? 'text-[#FF6B9D]' : 'text-[#FFA500]'} 
                        size={24} 
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-[#1A1D1F]">
                              {getActivityTypeLabel(activity.type)}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                              activity.severity === 'CRITICAL' 
                                ? 'bg-[#FF6B9D]/10 text-[#FF6B9D] border-[#FF6B9D]/20' 
                                : 'bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/20'
                            }`}>
                              {activity.severity}
                            </span>
                            {activity.resolved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-[#44A08D]/10 text-[#44A08D]">
                                <CheckCircle2 size={12} />
                                Resolved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-[#FF6B9D]/10 text-[#FF6B9D]">
                                <AlertTriangle size={12} />
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#6E7191] mb-3">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#6E7191]">
                            <span className="flex items-center gap-2">
                              <User size={14} />
                              {activity.actorUserName}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock size={14} />
                              {new Date(activity.detectedAt).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-2">
                              <AlertTriangle size={14} />
                              {activity.eventCount} related events
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedActivity(activity)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#44A08D] hover:bg-[#44A08D]/10 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                          Investigate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-12 text-center">
            <div className="w-16 h-16 bg-[#F7F7F8] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-[#44A08D]" size={32} />
            </div>
            <h3 className="text-[#1A1D1F] font-semibold mb-2">No suspicious activities</h3>
            <p className="text-[#6E7191]">All clear in this category</p>
          </div>
        )}
      </div>

      {/* Investigation Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#F5F5F7] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1A1D1F]">Activity Investigation</h2>
              <button
                onClick={() => setSelectedActivity(null)}
                className="w-8 h-8 rounded-lg hover:bg-[#F7F7F8] flex items-center justify-center text-[#6E7191] transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#1A1D1F] mb-2">Activity Details</h3>
                  <div className="bg-[#F7F7F8] rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#6E7191]">Type:</span>
                      <span className="text-[#1A1D1F] font-medium">{getActivityTypeLabel(selectedActivity.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E7191]">Severity:</span>
                      <span className={`font-medium ${
                        selectedActivity.severity === 'CRITICAL' ? 'text-[#FF6B9D]' : 'text-[#FFA500]'
                      }`}>{selectedActivity.severity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E7191]">Detected:</span>
                      <span className="text-[#1A1D1F]">{new Date(selectedActivity.detectedAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E7191]">Actor:</span>
                      <span className="text-[#1A1D1F] font-medium">{selectedActivity.actorUserName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1A1D1F] mb-2">Related Events ({selectedActivity.relatedEventIds.length})</h3>
                  <div className="space-y-2">
                    {selectedActivity.relatedEventIds.map(eventId => {
                      const event = auditEvents.find(e => e.id === eventId);
                      if (!event) return null;
                      
                      return (
                        <div key={eventId} className="bg-[#F7F7F8] rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#1A1D1F]">{event.actionDescription}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              event.severity === 'CRITICAL' 
                                ? 'bg-[#FF6B9D]/10 text-[#FF6B9D]' 
                                : 'bg-[#FFA500]/10 text-[#FFA500]'
                            }`}>
                              {event.severity}
                            </span>
                          </div>
                          <div className="text-xs text-[#6E7191]">
                            {new Date(event.timestamp).toLocaleString()} • {event.module}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {!selectedActivity.resolved && (
                    <button className="flex-1 px-4 py-2.5 bg-[#44A08D] text-white rounded-xl hover:bg-[#3D9080] transition-colors">
                      Mark as Resolved
                    </button>
                  )}
                  <button 
                    onClick={() => navigate('/audit/investigation')}
                    className="flex-1 px-4 py-2.5 bg-[#1A1D1F] text-white rounded-xl hover:bg-[#2A2D2F] transition-colors"
                  >
                    View in Investigation Grid
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
