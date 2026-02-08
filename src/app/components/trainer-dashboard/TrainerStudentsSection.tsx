import { Users, TrendingUp, Award, Search, Filter } from 'lucide-react';
import { useState } from 'react';

export function TrainerStudentsSection() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Student Stats */}
      <StudentStats />

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6E7191]" />
            <input
              type="text"
              placeholder="Search students by name or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-[#1A1D1F] hover:bg-gray-50 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTable searchTerm={searchTerm} />
    </div>
  );
}

function StudentStats() {
  const stats = [
    {
      label: 'Total Students',
      value: '142',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      change: '+8'
    },
    {
      label: 'Avg Attendance',
      value: '92%',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600',
      change: '+5%'
    },
    {
      label: 'Top Performers',
      value: '38',
      icon: Award,
      gradient: 'from-purple-500 to-purple-600',
      change: '+12'
    },
    {
      label: 'Need Attention',
      value: '8',
      icon: Users,
      gradient: 'from-orange-500 to-orange-600',
      change: '-2'
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

const students = [
  { id: 1, name: 'Rajesh Kumar', batch: 'Python Basics', attendance: 98, performance: 95, status: 'Excellent' },
  { id: 2, name: 'Priya Sharma', batch: 'React Advanced', attendance: 95, performance: 92, status: 'Excellent' },
  { id: 3, name: 'Amit Patel', batch: 'Data Science', attendance: 92, performance: 88, status: 'Good' },
  { id: 4, name: 'Sneha Reddy', batch: 'Python Basics', attendance: 90, performance: 85, status: 'Good' },
  { id: 5, name: 'Vikram Singh', batch: 'Web Development', attendance: 88, performance: 82, status: 'Average' },
  { id: 6, name: 'Divya Menon', batch: 'ML Fundamentals', attendance: 85, performance: 80, status: 'Average' },
  { id: 7, name: 'Rahul Verma', batch: 'Backend APIs', attendance: 78, performance: 75, status: 'Needs Attention' },
  { id: 8, name: 'Ananya Iyer', batch: 'React Advanced', attendance: 72, performance: 70, status: 'Needs Attention' }
];

function StudentsTable({ searchTerm }: { searchTerm: string }) {
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Good':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Average':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Needs Attention':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">All Students</h3>
        <p className="text-xs text-[#6E7191]">{filteredStudents.length} students across all batches</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1A1D1F] uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1A1D1F] uppercase tracking-wider">
                Batch
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1A1D1F] uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1A1D1F] uppercase tracking-wider">
                Performance
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1A1D1F] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1A1D1F] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white font-bold text-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1A1D1F]">{student.name}</div>
                      <div className="text-xs text-[#6E7191]">ID: STU-{student.id.toString().padStart(3, '0')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-[#6E7191]">{student.batch}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                      <div
                        className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] h-2 rounded-full"
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-[#1A1D1F]">{student.attendance}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${student.performance}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-[#1A1D1F]">{student.performance}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button className="px-3 py-1.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all">
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-sm text-[#6E7191]">No students found matching your search.</p>
        </div>
      )}
    </div>
  );
}
