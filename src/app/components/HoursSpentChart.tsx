import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { month: 'Jan', study: 40, exams: 0 },
  { month: 'Feb', study: 30, exams: 10 },
  { month: 'Mar', study: 60, exams: 20 },
  { month: 'Apr', study: 40, exams: 0 },
  { month: 'May', study: 30, exams: 10 },
];

export function HoursSpentChart() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#1A1D1F]">Hours Spent</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#FF9066]"></div>
            <span className="text-sm text-[#6E7191]">Study</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#E8E8EA]"></div>
            <span className="text-sm text-[#6E7191]">Exams</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={0} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F5F5F7" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6E7191', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6E7191', fontSize: 12 }}
            ticks={[0, 20, 40, 60, 80]}
            tickFormatter={(value) => `${value} hr`}
          />
          <Bar 
            dataKey="study" 
            fill="#FF9066" 
            radius={[8, 8, 0, 0]}
            maxBarSize={40}
          />
          <Bar 
            dataKey="exams" 
            fill="#2E2F45" 
            radius={[8, 8, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}