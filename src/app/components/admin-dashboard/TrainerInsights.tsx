import { GraduationCap, TrendingUp, Award, Users, Star, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function TrainerInsights() {
  // Performance data for donut chart
  const performanceData = [
    { name: 'Excellent', value: 15, color: '#10B981' },
    { name: 'Good', value: 7, color: '#3B82F6' },
    { name: 'Average', value: 2, color: '#F59E0B' }
  ];

  // Trainer workload data
  const workloadData = [
    { name: 'Mon', hours: 6 },
    { name: 'Tue', hours: 8 },
    { name: 'Wed', hours: 7 },
    { name: 'Thu', hours: 9 },
    { name: 'Fri', hours: 8 },
    { name: 'Sat', hours: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Chart + Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trainer Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#4ECDC4]/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-[#4ECDC4]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1D1F]">Trainer Performance</h3>
              </div>
              <p className="text-sm text-[#6E7191]">Performance ratings distribution</p>
            </div>
            <button className="text-sm text-[#4ECDC4] font-semibold hover:text-[#44A08D] transition-colors">
              View All →
            </button>
          </div>

          {/* Donut Chart */}
          <div className="flex justify-center mb-6">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
            {performanceData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm font-medium text-[#1A1D1F]">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-3 bg-[#4ECDC4] text-white rounded-xl font-semibold hover:bg-[#44A08D] transition-colors flex items-center justify-center gap-2">
            <Award className="w-5 h-5" />
            Review Trainer Feedback
          </button>
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
            {/* Active Trainers */}
            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-purple-700">Active Trainers</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-900 mb-1">18</div>
              <div className="text-xs text-purple-600">Currently teaching</div>
            </div>

            {/* Avg Rating */}
            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-emerald-700">Avg Rating</span>
                <Star className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-900 mb-1">4.8</div>
              <div className="text-xs text-emerald-600">Out of 5.0</div>
            </div>

            {/* Classes Today */}
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-700">Classes Today</span>
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">24</div>
              <div className="text-xs text-blue-600">Across all batches</div>
            </div>

            {/* Certified */}
            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-amber-700">Certified</span>
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-900 mb-1">22</div>
              <div className="text-xs text-amber-600">92% of total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Workload Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#4ECDC4]/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#4ECDC4]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1D1F]">Weekly Workload</h3>
            </div>
            <p className="text-sm text-[#6E7191]">Average teaching hours per day</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="name" 
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
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar dataKey="hours" fill="#44A08D" name="Teaching Hours" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}