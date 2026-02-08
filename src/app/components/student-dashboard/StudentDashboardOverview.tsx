import { BookOpen, Calendar, Award, TrendingUp, Clock, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function StudentDashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Hero Stats Section */}
      <StudentHeroStats />

      {/* Row 1: Learning Progress (2/3) + Key Metrics (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LearningProgressChart />
        </div>
        <div className="lg:col-span-1">
          <StudentKeyMetrics />
        </div>
      </div>

      {/* Row 2: Upcoming Classes (1/3) + Performance Radar (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UpcomingClassesCard />
        </div>
        <div className="lg:col-span-2">
          <PerformanceRadarChart />
        </div>
      </div>
    </div>
  );
}

// Student Hero Stats - Clean layout with primary metrics
function StudentHeroStats() {
  const stats = [
    {
      label: 'Enrolled Courses',
      value: '3',
      subtext: '2 In Progress • 1 Completed',
      change: '+1',
      changeType: 'positive' as const,
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Overall Progress',
      value: '68%',
      subtext: 'Across All Courses',
      change: '+12%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      label: 'Attendance Rate',
      value: '95%',
      subtext: 'Last 30 Days',
      change: '+3%',
      changeType: 'positive' as const,
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Fee Status',
      value: '₹15K',
      subtext: '₹45K Paid • ₹15K Pending',
      change: null,
      changeType: 'warning' as const,
      icon: DollarSign,
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      label: 'Course Rank',
      value: '#8',
      subtext: 'Out of 142 Students',
      change: '+5',
      changeType: 'positive' as const,
      icon: Award,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isWarning = stat.changeType === 'warning';
        return (
          <div
            key={stat.label}
            className={`relative bg-white rounded-2xl border shadow-sm p-4 overflow-hidden group hover:shadow-lg transition-all ${
              isWarning ? 'border-orange-300' : 'border-gray-200'
            }`}
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`}></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                    isWarning 
                      ? 'bg-orange-50 border border-orange-200' 
                      : 'bg-emerald-50'
                  }`}>
                    <span className={`text-xs font-bold ${
                      isWarning ? 'text-orange-600' : 'text-emerald-600'
                    }`}>{stat.change}</span>
                  </div>
                )}
                {isWarning && (
                  <div className="flex items-center gap-1 bg-orange-100 px-2.5 py-1 rounded-full animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-xs font-bold text-orange-700">Due</span>
                  </div>
                )}
              </div>

              <div className={`text-3xl font-bold mb-1.5 ${
                isWarning ? 'text-orange-600' : 'text-[#1A1D1F]'
              }`}>
                {stat.value}
              </div>

              <div className={`text-sm font-semibold mb-1.5 ${
                isWarning ? 'text-orange-900' : 'text-[#1A1D1F]'
              }`}>
                {stat.label}
              </div>

              <div className={`text-xs leading-relaxed ${
                isWarning ? 'text-orange-700' : 'text-[#6E7191]'
              }`}>
                {stat.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Student Key Metrics - Right sidebar component
function StudentKeyMetrics() {
  const insights = [
    {
      icon: Clock,
      label: 'Study Time Today',
      value: '4.5 hrs',
      detail: 'Goal: 6 hrs',
      change: '+1.5 hrs',
      color: 'purple'
    },
    {
      icon: Award,
      label: 'Assignments Completed',
      value: '18/20',
      detail: '2 Pending',
      change: '+3',
      color: 'emerald'
    },
    {
      icon: Calendar,
      label: 'Next Class',
      value: '10:00 AM',
      detail: 'Python Basics',
      change: 'Today',
      color: 'cyan'
    },
    {
      icon: TrendingUp,
      label: 'Score Average',
      value: '88%',
      detail: 'Last 5 Tests',
      change: '+5%',
      color: 'indigo'
    },
    {
      icon: CheckCircle2,
      label: 'Certificates Earned',
      value: '1',
      detail: 'HTML & CSS Basics',
      change: '+1',
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
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Quick Stats</h3>
        <p className="text-xs text-[#6E7191]">Your learning snapshot</p>
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

// Learning Progress Chart
function LearningProgressChart() {
  const data = [
    { week: 'Week 1', progress: 20, target: 25 },
    { week: 'Week 2', progress: 35, target: 40 },
    { week: 'Week 3', progress: 48, target: 55 },
    { week: 'Week 4', progress: 58, target: 70 },
    { week: 'Week 5', progress: 68, target: 85 },
    { week: 'Week 6', progress: 68, target: 100 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Learning Progress</h3>
          <p className="text-xs text-[#6E7191]">Your progress vs target</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4ECDC4]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Your Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#44A08D]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Target</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#44A08D" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#44A08D" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="week" 
              stroke="#9CA3AF" 
              style={{ fontSize: '11px', fontWeight: '500' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#9CA3AF" 
              style={{ fontSize: '11px', fontWeight: '500' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="progress" 
              stroke="#4ECDC4" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorProgress)"
              name="Progress %"
            />
            <Area 
              type="monotone" 
              dataKey="target" 
              stroke="#44A08D" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTarget)"
              name="Target %"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Performance Radar Chart
function PerformanceRadarChart() {
  const data = [
    { subject: 'Assignments', score: 88, fullMark: 100 },
    { subject: 'Tests', score: 85, fullMark: 100 },
    { subject: 'Attendance', score: 95, fullMark: 100 },
    { subject: 'Participation', score: 82, fullMark: 100 },
    { subject: 'Projects', score: 90, fullMark: 100 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Performance Overview</h3>
        <p className="text-xs text-[#6E7191]">Your strengths across different areas</p>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis 
              dataKey="subject" 
              style={{ fontSize: '11px', fontWeight: '600', fill: '#6E7191' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              style={{ fontSize: '10px', fill: '#9CA3AF' }}
            />
            <Radar 
              name="Your Score" 
              dataKey="score" 
              stroke="#4ECDC4" 
              fill="#4ECDC4" 
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Upcoming Classes Card
function UpcomingClassesCard() {
  const classes = [
    { time: '10:00 AM', course: 'Python Basics', topic: 'Session 15', type: 'Live' },
    { time: '02:00 PM', course: 'React Advanced', topic: 'Hooks Deep Dive', type: 'Live' },
    { time: '04:30 PM', course: 'Data Science', topic: 'ML Introduction', type: 'Live' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Today's Classes</h3>
        <p className="text-xs text-[#6E7191]">3 classes scheduled</p>
      </div>

      <div className="space-y-2.5 overflow-y-auto flex-1 pr-2">
        {classes.map((cls, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-3 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-blue-900">{cls.time}</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {cls.type}
              </span>
            </div>
            <div className="text-xs font-semibold text-blue-800 mb-1">{cls.course}</div>
            <div className="text-xs text-blue-700 mb-2">{cls.topic}</div>
            <button className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all">
              Join Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
