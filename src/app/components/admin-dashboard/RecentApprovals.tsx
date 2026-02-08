import { CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Approval {
  id: string;
  name: string;
  role: string;
  timestamp: Date;
  approvedBy: string;
}

export function RecentApprovals() {
  // Mock data - Replace with actual API
  const recentApprovals: Approval[] = [
    {
      id: '1',
      name: 'Jonathan King',
      role: 'Full Stack Developer',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      approvedBy: 'Admin Sharma'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Data Science',
      timestamp: new Date(Date.now() - 22 * 60 * 1000),
      approvedBy: 'Admin Sharma'
    },
    {
      id: '3',
      name: 'Peter Brooks',
      role: 'UI/UX Design',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      approvedBy: 'Anjali Reddy'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      role: 'Digital Marketing',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      approvedBy: 'Admin Sharma'
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1A1D1F] flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            Recent Approvals
          </h3>
          <p className="text-xs sm:text-sm text-[#6E7191] mt-1">Latest onboarded users</p>
        </div>
        <span className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
          {recentApprovals.length} TODAY
        </span>
      </div>

      {/* Approvals List */}
      <div className="space-y-2 sm:space-y-3">
        {recentApprovals.map((approval) => (
          <div
            key={approval.id}
            className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
          >
            {/* Avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 shadow-sm">
              {getInitials(approval.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold text-[#1A1D1F] truncate">
                {approval.name}
              </h4>
              <p className="text-xs text-[#6E7191] truncate">
                {approval.role}
              </p>
            </div>

            {/* Time */}
            <div className="text-right flex-shrink-0 hidden sm:block">
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mb-1">
                <CheckCircle className="w-3 h-3" />
                Approved
              </div>
              <div className="flex items-center gap-1 text-xs text-[#6E7191]">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(approval.timestamp, { addSuffix: true })}
              </div>
            </div>
            
            {/* Mobile Time */}
            <div className="text-right flex-shrink-0 sm:hidden">
              <div className="text-xs text-emerald-600 font-medium">
                ✓
              </div>
              <div className="text-xs text-[#6E7191]">
                {formatDistanceToNow(approval.timestamp, { addSuffix: true }).replace(' ago', '')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state (if needed) */}
      {recentApprovals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-[#6E7191]">No recent approvals</p>
        </div>
      )}
    </div>
  );
}