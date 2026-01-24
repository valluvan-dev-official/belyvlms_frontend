import { Users, CheckCircle, Clock, PlayCircle, PauseCircle, XCircle, Briefcase, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function StudentOverview() {
  const navigate = useNavigate();

  const total = 856;
  
  // Primary stats - Important metrics
  const primaryStats = [
    { label: 'In Progress', value: 650, icon: PlayCircle, color: 'blue', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', textColor: 'text-blue-900' },
    { label: 'Completed', value: 45, icon: CheckCircle, color: 'emerald', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', textColor: 'text-emerald-900' },
    { label: 'Yet to Start', value: 120, icon: Clock, color: 'cyan', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', textColor: 'text-cyan-900' },
  ];

  // Secondary stats - Less important
  const secondaryStats = [
    { label: 'Not Confirmed', value: 12, icon: XCircle, color: 'red', bgColor: 'bg-red-50', iconColor: 'text-red-600', textColor: 'text-red-900' },
    { label: 'Hold', value: 15, icon: PauseCircle, color: 'amber', bgColor: 'bg-amber-50', iconColor: 'text-amber-600', textColor: 'text-amber-900' },
    { label: 'Placed', value: 9, icon: Briefcase, color: 'purple', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', textColor: 'text-purple-900' },
    { label: 'Refund', value: 5, icon: DollarSign, color: 'pink', bgColor: 'bg-pink-50', iconColor: 'text-pink-600', textColor: 'text-pink-900' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A1D1F]">Student Overview</h3>
              <p className="text-sm text-[#6E7191]">Complete student statistics</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/management/users?role=student')}
          className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg font-semibold hover:bg-[#44A08D] transition-all text-sm"
        >
          View All
        </button>
      </div>

      {/* Primary Stats - 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {primaryStats.map((stat) => {
          const Icon = stat.icon;
          const percentage = ((stat.value / total) * 100).toFixed(1);
          
          return (
            <button
              key={stat.label}
              onClick={() => navigate(`/management/users?role=student&status=${stat.label.toLowerCase().replace(' ', '-')}`)}
              className={`${stat.bgColor} rounded-xl p-5 border-2 border-${stat.color}-200 hover:shadow-lg transition-all text-left group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className={`text-xs font-bold ${stat.textColor} opacity-60 bg-white px-2 py-1 rounded`}>
                  {percentage}%
                </span>
              </div>

              <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </div>

              <div className={`text-sm font-semibold ${stat.textColor}`}>
                {stat.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary Stats - 4 Column Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryStats.map((stat) => {
          const Icon = stat.icon;
          const percentage = ((stat.value / total) * 100).toFixed(1);
          
          return (
            <button
              key={stat.label}
              onClick={() => navigate(`/management/users?role=student&status=${stat.label.toLowerCase().replace(' ', '-')}`)}
              className={`${stat.bgColor} rounded-xl p-4 border border-${stat.color}-200 hover:shadow-md transition-all text-left group`}
            >
              <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>

              <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </div>

              <div className={`text-xs font-semibold ${stat.textColor} mb-1`}>
                {stat.label}
              </div>
              
              <span className={`text-xs font-bold ${stat.textColor} opacity-50`}>
                {percentage}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}