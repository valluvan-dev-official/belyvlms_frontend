import { BookOpen, TrendingUp, Users, Award, Target, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function CourseInsights() {
  // Enrollment data for line chart
  const enrollmentData = [
    { month: 'Aug', students: 85 },
    { month: 'Sep', students: 95 },
    { month: 'Oct', students: 110 },
    { month: 'Nov', students: 125 },
    { month: 'Dec', students: 140 },
    { month: 'Jan', students: 160 }
  ];

  // Course popularity data
  const popularityData = [
    { course: 'Full Stack', students: 180 },
    { course: 'Data Science', students: 145 },
    { course: 'UI/UX', students: 120 },
    { course: 'DevOps', students: 95 },
    { course: 'Mobile Dev', students: 80 }
  ];

  return (
    <div className="space-y-6">
      {/* Enrollment Trend + Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Enrollment Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#4ECDC4]/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#4ECDC4]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1D1F]">Course Enrollment Trend</h3>
              </div>
              <p className="text-sm text-[#6E7191]">Monthly enrollment growth</p>
            </div>
            <button className="text-sm text-[#4ECDC4] font-semibold hover:text-[#44A08D] transition-colors">
              View All →
            </button>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                style={{ fontSize: '12px', fontWeight: '500' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                style={{ fontSize: '12px', fontWeight: '500' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#4ECDC4" 
                strokeWidth={3}
                dot={{ fill: '#4ECDC4', r: 5 }}
                name="Enrollments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Metrics */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#4ECDC4]/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#4ECDC4]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1D1F]">Quick Metrics</h3>
            </div>
            <p className="text-sm text-[#6E7191]">Key statistics</p>
          </div>

          <div className="space-y-4">
            {/* Total Enrollment */}
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-indigo-700">Total Enrollment</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-indigo-900 mb-1">620</div>
              <div className="text-xs text-indigo-600">Across all courses</div>
            </div>

            {/* Completion Rate */}
            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-emerald-700">Completion Rate</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-900 mb-1">87%</div>
              <div className="text-xs text-emerald-600">This semester</div>
            </div>

            {/* Active Batches */}
            <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-orange-700">Active Batches</span>
                <Target className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-900 mb-1">18</div>
              <div className="text-xs text-orange-600">Currently running</div>
            </div>

            {/* New This Month */}
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-700">New This Month</span>
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">160</div>
              <div className="text-xs text-blue-600">Fresh enrollments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Courses Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#4ECDC4]/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#4ECDC4]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1D1F]">Popular Courses</h3>
            </div>
            <p className="text-sm text-[#6E7191]">Top 5 courses by enrollment</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={popularityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              type="number"
              stroke="#9CA3AF" 
              style={{ fontSize: '12px', fontWeight: '500' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              type="category"
              dataKey="course"
              stroke="#9CA3AF" 
              style={{ fontSize: '12px', fontWeight: '500' }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB', 
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar dataKey="students" fill="#44A08D" name="Students" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}