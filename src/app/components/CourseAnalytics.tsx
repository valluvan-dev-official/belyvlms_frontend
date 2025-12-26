import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const enrollmentData = [
  { month: 'Jan', enrollments: 45, completions: 32 },
  { month: 'Feb', enrollments: 52, completions: 38 },
  { month: 'Mar', enrollments: 48, completions: 41 },
  { month: 'Apr', enrollments: 61, completions: 45 },
  { month: 'May', enrollments: 55, completions: 48 },
  { month: 'Jun', enrollments: 67, completions: 52 }
];

export function CourseAnalytics() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="font-semibold text-[#1A1D1F] mb-6">Course Enrollment Analytics</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={enrollmentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
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
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #F5F5F7',
              borderRadius: '12px',
              padding: '12px'
            }}
            cursor={{ fill: '#F7F7F8' }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
            iconType="circle"
          />
          <Bar 
            dataKey="enrollments" 
            fill="#4ECDC4" 
            radius={[8, 8, 0, 0]}
            name="Enrollments"
          />
          <Bar 
            dataKey="completions" 
            fill="#44A08D" 
            radius={[8, 8, 0, 0]}
            name="Completions"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
