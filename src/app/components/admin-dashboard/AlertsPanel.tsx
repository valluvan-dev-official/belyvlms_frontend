import { AlertCircle, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export function AlertsPanel() {
  const alerts = [
    {
      type: 'critical',
      icon: XCircle,
      title: 'SLA Breach Alert',
      description: '3 onboarding requests pending >24hrs',
      time: '5 mins ago',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'High Pending Load',
      description: '12 requests awaiting approval',
      time: '15 mins ago',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      type: 'success',
      icon: CheckCircle2,
      title: 'Batch Starting Soon',
      description: 'Full Stack Batch #12 starts tomorrow',
      time: '1 hour ago',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      type: 'info',
      icon: TrendingUp,
      title: 'Revenue Milestone',
      description: 'Monthly target 85% achieved',
      time: '2 hours ago',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      type: 'warning',
      icon: Clock,
      title: 'Trainer Availability',
      description: '2 trainers on leave next week',
      time: '3 hours ago',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      type: 'info',
      icon: CheckCircle2,
      title: 'System Update Complete',
      description: 'All services running smoothly',
      time: '4 hours ago',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-[480px] flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-[#1A1D1F]">Alerts & SLA</h3>
          <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            6
          </span>
        </div>
        <p className="text-sm text-[#6E7191]">Critical notifications</p>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div
              key={index}
              className={`${alert.bgColor} ${alert.borderColor} border rounded-xl p-4 transition-all hover:shadow-md cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className={`${alert.iconColor} flex-shrink-0 mt-0.5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#1A1D1F] text-sm mb-1">
                    {alert.title}
                  </div>
                  <div className="text-xs text-[#6E7191] mb-2">
                    {alert.description}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#6E7191]" />
                    <span className="text-xs text-[#6E7191]">{alert.time}</span>
                  </div>
                </div>
                {alert.type === 'critical' && (
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1 animate-pulse"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
