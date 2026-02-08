import { TrendingUp, Award, Clock, Users, BookOpen } from 'lucide-react';

interface TrainerKeyMetricsWidgetProps {
  isLoading?: boolean;
}

export default function TrainerKeyMetricsWidget({ isLoading = false }: TrainerKeyMetricsWidgetProps) {
  if (isLoading) {
    return <div className="h-[320px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  const insights = [
    {
      icon: TrendingUp,
      label: 'Student Attendance',
      value: '92%',
      detail: 'Last Week Average',
      change: '+5%',
      color: 'purple'
    },
    {
      icon: Award,
      label: 'Completion Rate',
      value: '85%',
      detail: 'Across All Batches',
      change: '+3%',
      color: 'emerald'
    },
    {
      icon: Clock,
      label: 'Upcoming Classes',
      value: '12',
      detail: 'This Week',
      change: '+2',
      color: 'cyan'
    },
    {
      icon: Users,
      label: 'New Students',
      value: '8',
      detail: 'Joined This Month',
      change: '+8',
      color: 'indigo'
    },
    {
      icon: BookOpen,
      label: 'Resources Shared',
      value: '45',
      detail: 'This Month',
      change: '+12',
      color: 'pink'
    }
  ];

  const colorClasses: Record<string, { bg: string; icon: string; text: string; border: string }> = {
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-900',
      border: 'border-purple-200'
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      text: 'text-emerald-900',
      border: 'border-emerald-200'
    },
    cyan: {
      bg: 'bg-cyan-50',
      icon: 'text-cyan-600',
      text: 'text-cyan-900',
      border: 'border-cyan-200'
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      text: 'text-indigo-900',
      border: 'border-indigo-200'
    },
    pink: {
      bg: 'bg-pink-50',
      icon: 'text-pink-600',
      text: 'text-pink-900',
      border: 'border-pink-200'
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Key Metrics</h3>
        <p className="text-xs text-[#6E7191]">Your teaching performance</p>
      </div>

      <div className="space-y-2.5 overflow-y-auto flex-1 pr-2">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const colors = colorClasses[insight.color];
          return (
            <div
              key={insight.label}
              className={`${colors.bg} ${colors.border} border rounded-xl p-3`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${colors.icon}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs font-semibold ${colors.text}`}>{insight.label}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {insight.change}
                    </span>
                  </div>
                  <div className={`text-xl font-bold ${colors.text} mb-0.5`}>{insight.value}</div>
                  <div className={`text-xs ${colors.text} opacity-75`}>{insight.detail}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
