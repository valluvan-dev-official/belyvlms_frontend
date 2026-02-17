import { Award, TrendingUp, Target, Trophy, Star, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function StudentProgressSection() {
  return (
    <div className="space-y-6">
      {/* Progress Stats */}
      <ProgressStats />

      {/* Row 1: Performance Trend (2/3) + Achievements (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceTrendChart />
        </div>
        <div className="lg:col-span-1">
          <AchievementsCard />
        </div>
      </div>

      {/* Row 2: Course Progress (1/2) + Skill Progress (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CourseProgressCard />
        <SkillProgressChart />
      </div>
    </div>
  );
}

function ProgressStats() {
  const stats = [
    {
      label: 'Overall Progress',
      value: '68%',
      change: '+12%',
      icon: TrendingUp,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Assignments Score',
      value: '88%',
      change: '+5%',
      icon: Award,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      label: 'Course Rank',
      value: '#8',
      change: '+5',
      icon: Trophy,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Achievements',
      value: '12',
      change: '+3',
      icon: Star,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-4 overflow-hidden group hover:shadow-lg transition-all"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`}></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {stat.change}
                </span>
              </div>

              <div className="text-3xl font-bold mb-1.5 text-[#1A1D1F]">
                {stat.value}
              </div>

              <div className="text-sm font-semibold text-[#1A1D1F]">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PerformanceTrendChart() {
  const data = [
    { month: 'Aug', score: 75, attendance: 92 },
    { month: 'Sep', score: 78, attendance: 94 },
    { month: 'Oct', score: 82, attendance: 93 },
    { month: 'Nov', score: 85, attendance: 95 },
    { month: 'Dec', score: 87, attendance: 96 },
    { month: 'Jan', score: 88, attendance: 95 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Performance Trend</h3>
          <p className="text-xs text-[#6E7191]">Last 6 months progress</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4ECDC4]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#44A08D]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Attendance</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="month" 
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
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#4ECDC4" 
              strokeWidth={3}
              name="Score %"
              dot={{ fill: '#4ECDC4', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="#44A08D" 
              strokeWidth={3}
              name="Attendance %"
              strokeDasharray="5 5"
              dot={{ fill: '#44A08D', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AchievementsCard() {
  const achievements = [
    { icon: Trophy, title: 'Top Performer', description: 'Rank #8 in class', color: 'gold' },
    { icon: Star, title: 'Perfect Attendance', description: '30 days streak', color: 'blue' },
    { icon: Award, title: 'Quick Learner', description: 'Completed 1 course', color: 'emerald' },
    { icon: Target, title: 'Assignment Master', description: '90% avg score', color: 'purple' }
  ];

  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    gold: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-200' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-200' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Achievements</h3>
        <p className="text-xs text-[#6E7191]">12 badges earned</p>
      </div>

      <div className="space-y-2.5 overflow-y-auto flex-1 pr-2">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const colors = colorClasses[achievement.color];
          return (
            <div
              key={index}
              className={`${colors.bg} ${colors.border} border rounded-xl p-3`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#1A1D1F] mb-0.5">{achievement.title}</div>
                  <div className="text-xs text-[#6E7191]">{achievement.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourseProgressCard() {
  const courses = [
    { name: 'Python Programming', progress: 75, color: 'blue' },
    { name: 'React Advanced', progress: 60, color: 'cyan' },
    { name: 'HTML & CSS', progress: 100, color: 'emerald' }
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      cyan: 'from-cyan-500 to-cyan-600',
      emerald: 'from-emerald-500 to-emerald-600'
    };
    return colors[color];
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Course Progress</h3>
        <p className="text-xs text-[#6E7191]">Individual course completion</p>
      </div>

      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#6E7191]" />
                <span className="text-sm font-semibold text-[#1A1D1F]">{course.name}</span>
              </div>
              <span className="text-sm font-bold text-[#1A1D1F]">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`bg-gradient-to-r ${getColorClass(course.color)} h-2.5 rounded-full transition-all`}
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillProgressChart() {
  const data = [
    { skill: 'Python', level: 75 },
    { skill: 'React', level: 60 },
    { skill: 'HTML/CSS', level: 100 },
    { skill: 'Git', level: 65 },
    { skill: 'Database', level: 45 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Skill Levels</h3>
        <p className="text-xs text-[#6E7191]">Your expertise across technologies</p>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#9CA3AF" 
              style={{ fontSize: '11px', fontWeight: '500' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              type="category"
              dataKey="skill" 
              stroke="#9CA3AF" 
              style={{ fontSize: '11px', fontWeight: '600' }}
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
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar 
              dataKey="level" 
              fill="url(#skillGradient)" 
              radius={[0, 8, 8, 0]}
              name="Skill Level %"
            />
            <defs>
              <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4ECDC4" />
                <stop offset="100%" stopColor="#44A08D" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
