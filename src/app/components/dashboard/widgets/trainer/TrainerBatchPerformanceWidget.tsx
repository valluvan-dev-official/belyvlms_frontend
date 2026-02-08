import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrainerBatchPerformanceWidgetProps {
  isLoading?: boolean;
}

export default function TrainerBatchPerformanceWidget({ isLoading = false }: TrainerBatchPerformanceWidgetProps) {
  if (isLoading) {
    return <div className="h-[320px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  const data = [
    { name: 'Python Basics', attendance: 95, completion: 88 },
    { name: 'React Advanced', attendance: 92, completion: 85 },
    { name: 'Data Science', attendance: 88, completion: 82 },
    { name: 'Web Dev', attendance: 90, completion: 86 },
    { name: 'ML Fundamentals', attendance: 85, completion: 80 },
    { name: 'Backend APIs', attendance: 93, completion: 89 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Batch Performance</h3>
          <p className="text-xs text-[#6E7191]">Attendance vs Completion rate</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Attendance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#6366F1]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Completion</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="name" 
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
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar dataKey="attendance" fill="#10B981" name="Attendance %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="completion" fill="#6366F1" name="Completion %" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
