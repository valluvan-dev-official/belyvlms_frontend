import { BookOpen, CheckCircle, Users, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CourseOverview() {
  const navigate = useNavigate();

  const total = 35;
  
  // Primary stats
  const primaryStats = [
    { 
      label: 'Active Courses', 
      value: 28, 
      icon: CheckCircle, 
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-900'
    },
    { 
      label: 'Total Batches', 
      value: 42, 
      icon: Users, 
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    { 
      label: 'Ongoing Batches', 
      value: 18, 
      icon: TrendingUp, 
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900'
    }
  ];

  // Secondary stat
  const secondaryStat = { 
    label: 'Popular Courses', 
    value: 12, 
    icon: Star, 
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-900'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A1D1F]">Course & Batch Overview</h3>
              <p className="text-sm text-[#6E7191]">Program & batch statistics</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg font-semibold hover:bg-[#44A08D] transition-all text-sm"
        >
          Manage
        </button>
      </div>

      {/* Primary Stats - 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {primaryStats.map((stat) => {
          const Icon = stat.icon;
          const percentage = stat.label === 'Total Batches' ? null : ((stat.value / total) * 100).toFixed(1);
          
          return (
            <button
              key={stat.label}
              onClick={() => navigate(`/courses?status=${stat.label.toLowerCase().replace(' ', '-')}`)}
              className={`${stat.bgColor} rounded-xl p-5 border-2 border-${stat.color}-200 hover:shadow-lg transition-all text-left group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                {percentage && (
                  <span className={`text-xs font-bold ${stat.textColor} opacity-60 bg-white px-2 py-1 rounded`}>
                    {percentage}%
                  </span>
                )}
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

      {/* Secondary Stat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate(`/courses?filter=popular`)}
          className={`${secondaryStat.bgColor} rounded-xl p-5 border border-${secondaryStat.color}-200 hover:shadow-md transition-all text-left group`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
              <Star className={`w-6 h-6 ${secondaryStat.iconColor}`} />
            </div>
            <span className={`text-xs font-bold ${secondaryStat.textColor} opacity-60 bg-white px-2 py-1 rounded`}>
              {((secondaryStat.value / total) * 100).toFixed(1)}%
            </span>
          </div>

          <div className={`text-3xl font-bold ${secondaryStat.textColor} mb-1`}>
            {secondaryStat.value}
          </div>

          <div className={`text-sm font-semibold ${secondaryStat.textColor}`}>
            {secondaryStat.label}
          </div>
        </button>
      </div>
    </div>
  );
}