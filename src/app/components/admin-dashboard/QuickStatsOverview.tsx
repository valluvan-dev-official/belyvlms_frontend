import { AlertCircle, UserPlus, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickStatsOverview() {
  const navigate = useNavigate();

  const stats = [
    {
      id: 'pending',
      label: 'Pending Review',
      value: 12,
      subtext: 'Requires action',
      icon: AlertCircle,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900',
      action: () => navigate('/onboard-requests?tab=pending')
    },
    {
      id: 'today',
      label: 'New Today',
      value: 5,
      subtext: 'Applications',
      icon: UserPlus,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      action: () => navigate('/onboard-requests')
    },
    {
      id: 'total',
      label: 'Total Users',
      value: 150,
      subtext: 'All roles',
      icon: Users,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-900',
      action: () => navigate('/management/users')
    },
    {
      id: 'rate',
      label: 'Success Rate',
      value: '85%',
      subtext: 'Conversion',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900',
      action: () => {}
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <button
            key={stat.id}
            onClick={stat.action}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-3 text-left hover:shadow-md transition-all duration-200 group`}
          >
            {/* Icon */}
            <div className={`w-9 h-9 ${stat.iconBg} rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-4.5 h-4.5 ${stat.iconColor}`} />
            </div>

            {/* Value */}
            <div className={`text-2xl font-bold ${stat.textColor} mb-0.5`}>
              {stat.value}
            </div>

            {/* Label */}
            <div className={`text-xs font-semibold ${stat.textColor} mb-0.5`}>
              {stat.label}
            </div>
            
            {/* Subtext */}
            <div className={`text-xs ${stat.textColor} opacity-75`}>
              {stat.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
}