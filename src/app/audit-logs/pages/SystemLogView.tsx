import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Server, ChevronRight, Search, Calendar } from 'lucide-react';
import { auditEvents } from '../api';
import { AuditEvent } from '../types';

export function SystemLogView() {
  const navigate = useNavigate();

  const systemEvents: AuditEvent[] = useMemo(() => {
    return auditEvents.filter(e => {
      const isSystemActor = e.actorUserId === 'system' || (e.actorRole || '').toLowerCase() === 'system';
      const isSystemSource = e.sourceChannel === 'BACKGROUND_JOB' || e.sourceChannel === 'SYSTEM';
      const isSystemModule = e.module === 'SYSTEM';
      return isSystemActor || isSystemSource || isSystemModule;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <div className="bg-white border-b border-[#F5F5F7] px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/audit')}
                className="text-[#6E7191] hover:text-[#1A1D1F] transition-colors"
              >
                <Activity size={20} />
              </button>
              <ChevronRight size={16} className="text-[#9A9FA5]" />
              <span className="text-sm font-medium text-[#1A1D1F]">System Log</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/audit')}
                className="px-3 py-2 text-sm rounded-xl border border-[#F5F5F7] bg-white text-[#1A1D1F] hover:bg-[#F7F7F8]"
              >
                Overview
              </button>
              <button
                className="px-3 py-2 text-sm rounded-xl border border-[#44A08D] bg-[#44A08D] text-white"
              >
                System Log
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#F5F5F7] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#44A08D]/10 flex items-center justify-center">
                <Server className="text-[#44A08D]" size={24} />
              </div>
              <span className="text-xs text-[#6E7191] bg-[#F7F7F8] px-2 py-1 rounded">Today</span>
            </div>
            <div className="text-3xl font-bold text-[#1A1D1F] mb-1">
              {systemEvents.length}
            </div>
            <div className="text-sm text-[#6E7191]">System-generated events</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F5F5F7] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F5F5F7] flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#1A1D1F]">System Events</h2>
              <p className="text-sm text-[#6E7191]">Background jobs and automated actions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9FA5]" size={18} />
                <input
                  type="text"
                  placeholder="Search description, entity..."
                  className="pl-10 pr-3 py-2 w-64 text-sm bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#44A08D]"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9FA5]" size={18} />
                <input
                  type="date"
                  className="pl-10 pr-3 py-2 w-40 text-sm bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#44A08D]"
                />
              </div>
            </div>
          </div>

          <table className="min-w-full divide-y divide-[#F5F5F7]">
            <thead className="bg-[#F7F7F8]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6E7191] uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6E7191] uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6E7191] uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6E7191] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6E7191] uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F5F5F7]">
              {systemEvents.map(e => (
                <tr key={e.id} className="hover:bg-[#F7F7F8]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6E7191]">
                    {new Date(e.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs bg-[#4ECDC4]/10 text-[#44A08D] px-3 py-1 rounded border border-[#4ECDC4]/20">
                      {e.actionType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1D1F]">
                    {e.targetEntity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={e.status === 'SUCCESS' ? 'text-[#44A08D]' : 'text-[#FF6B9D]'}>{e.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6E7191] max-w-lg truncate" title={e.actionDescription}>
                    {e.actionDescription}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
