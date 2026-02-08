import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrainerActivityWidgetProps {
  isLoading?: boolean;
}

export default function TrainerActivityWidget({ isLoading = false }: TrainerActivityWidgetProps) {
  if (isLoading) {
    return <div className="h-[320px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  const data = [
    { day: 'Mon', hours: 6, students: 32 },
    { day: 'Tue', hours: 5, students: 28 },
    { day: 'Wed', hours: 7, students: 38 },
    { day: 'Thu', hours: 6, students: 35 },
    { day: 'Fri', hours: 5, students: 30 },
    { day: 'Sat', hours: 4, students: 22 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Teaching Activity</h3>
          <p className="text-xs text-[#6E7191]">This week's performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4ECDC4]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#44A08D]"></div>
            <span className="text-xs font-semibold text-[#6E7191]">Students</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#44A08D" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#44A08D" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="day" 
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
              dataKey="hours" 
              stroke="#4ECDC4" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorHours)"
              name="Hours"
            />
            <Area 
              type="monotone" 
              dataKey="students" 
              stroke="#44A08D" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorStudents)"
              name="Students"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
