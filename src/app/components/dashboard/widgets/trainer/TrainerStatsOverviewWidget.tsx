import { Users, Calendar, Clock, BookOpen, Activity } from 'lucide-react';

interface TrainerStatsOverviewWidgetProps {
  isLoading?: boolean;
}

export default function TrainerStatsOverviewWidget({ isLoading = false }: TrainerStatsOverviewWidgetProps) {
  if (isLoading) {
    return <div className="h-[120px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  const stats = [
    {
      label: 'My Active Batches',
      value: '6',
      subtext: '4 Regular • 2 Intensive',
      change: '+1',
      changeType: 'positive' as const,
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Total Students',
      value: '142',
      subtext: 'Across All Batches',
      change: '+8',
      changeType: 'positive' as const,
      icon: Users,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      label: 'Classes Today',
      value: '4',
      subtext: 'Next at 10:00 AM',
      change: null,
      changeType: 'info' as const,
      icon: Clock,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Hours This Week',
      value: '24',
      subtext: '6 hrs/day Average',
      change: '+3 hrs',
      changeType: 'positive' as const,
      icon: Activity,
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      label: 'Courses Teaching',
      value: '3',
      subtext: 'Python • React • Data Science',
      change: null,
      changeType: 'info' as const,
      icon: BookOpen,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-4 overflow-hidden group hover:shadow-lg transition-all"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`}></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {stat.change && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50">
                    <span className="text-xs font-bold text-emerald-600">{stat.change}</span>
                  </div>
                )}
              </div>

              <div className="text-3xl font-bold mb-1.5 text-[#1A1D1F]">
                {stat.value}
              </div>

              <div className="text-sm font-semibold mb-1.5 text-[#1A1D1F]">
                {stat.label}
              </div>

              <div className="text-xs leading-relaxed text-[#6E7191]">
                {stat.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
