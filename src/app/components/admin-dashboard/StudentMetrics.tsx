import { TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function StudentMetrics() {
  const metrics = [
    {
      icon: AlertCircle,
      value: '45',
      label: 'Pending Actions',
      sublabel: 'Requires attention',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900'
    },
    {
      icon: TrendingUp,
      value: '28',
      label: 'Enrolled Today',
      sublabel: 'New students',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    {
      icon: CheckCircle,
      value: '650',
      label: 'Active Students',
      sublabel: 'Currently learning',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-900'
    },
    {
      icon: TrendingUp,
      value: '92%',
      label: 'Retention Rate',
      sublabel: 'This semester',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className={`${metric.bgColor} rounded-2xl p-6 border border-gray-200`}
          >
            <div className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${metric.iconColor}`} />
            </div>
            <div className={`text-3xl font-bold ${metric.textColor} mb-2`}>
              {metric.value}
            </div>
            <div className={`text-sm font-semibold ${metric.textColor} mb-1`}>
              {metric.label}
            </div>
            <div className={`text-xs ${metric.textColor} opacity-60`}>
              {metric.sublabel}
            </div>
          </div>
        );
      })}
    </div>
  );
}
