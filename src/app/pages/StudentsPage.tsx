import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Users,
  CheckCircle,
  Clock,
  PlayCircle,
  XCircle,
  RotateCcw,
  PauseCircle,
  Briefcase,
  PieChart as PieChartIcon,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { getStudents, getStudentStats, Student, StudentFilters, StudentStats } from '../services/StudentService/StudentService';
import { toast } from 'sonner';

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0); // Filtered total for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<StudentStats | null>(null);
  
  const [filters, setFilters] = useState<StudentFilters>({
    page: 1,
    search: '',
    course_status: '',
    location: '',
    mode_of_class: '',
  });

  // Fetch static stats (once)
  useEffect(() => {
    const loadStats = async () => {
      const data = await getStudentStats();
      setStats(data);
    };
    loadStats();
  }, []);

  // Fetch students (filtered)
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents({ ...filters, page: currentPage });
      setStudents(data.results);
      setTotalCount(data.count);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, filters.search, filters.course_status, filters.location, filters.mode_of_class]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof StudentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / 10);

  const COLORS = ['#4ECDC4', '#FFB057', '#FF6B6B'];
  const pieData = stats ? [
    { name: '> 80%', value: stats.percentageBreakdown.above80 },
    { name: '50% - 80%', value: stats.percentageBreakdown.below80 },
    { name: '< 50%', value: stats.percentageBreakdown.below50 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1D1F]">Students Management</h1>
          <p className="text-[#6E7191] text-sm mt-1">Manage and monitor all student records</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E0E2] rounded-xl text-[#1A1D1F] font-medium hover:bg-[#F7F7F8] transition-colors">
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Students & Status Grid - Merged */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-[#F5F5F7] shadow-sm flex flex-col md:flex-row gap-8">
          {/* Total Students Section */}
          <div className="flex flex-col justify-center min-w-[200px] border-b md:border-b-0 md:border-r border-[#F5F5F7] pb-6 md:pb-0 md:pr-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E6F5F5] flex items-center justify-center text-[#4ECDC4]">
                <Users size={32} />
              </div>
              <div>
                <p className="text-[#6E7191] text-sm font-medium">Total Students</p>
                <h3 className="text-4xl font-bold text-[#1A1D1F] mt-1">{stats?.total || 0}</h3>
              </div>
            </div>
          </div>

          {/* Status Grid Section */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
             {/* Completed */}
             <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1 bg-green-50 text-green-600 rounded-md">
                   <CheckCircle size={14} />
                 </div>
                 <span className="text-[#6E7191] text-xs font-medium">Completed</span>
               </div>
               <span className="text-xl font-bold text-[#1A1D1F] pl-1">{stats?.completed || 0}</span>
             </div>
 
             {/* In Progress */}
             <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1 bg-yellow-50 text-yellow-600 rounded-md">
                   <PlayCircle size={14} />
                 </div>
                 <span className="text-[#6E7191] text-xs font-medium">In Progress</span>
               </div>
               <span className="text-xl font-bold text-[#1A1D1F] pl-1">{stats?.inProgress || 0}</span>
             </div>
 
             {/* Yet to Start */}
             <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
                   <Clock size={14} />
                 </div>
                 <span className="text-[#6E7191] text-xs font-medium">Yet to Start</span>
               </div>
               <span className="text-xl font-bold text-[#1A1D1F] pl-1">{stats?.yetToStart || 0}</span>
             </div>
 
             {/* Refund */}
             <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1 bg-orange-50 text-orange-600 rounded-md">
                   <RotateCcw size={14} />
                 </div>
                 <span className="text-[#6E7191] text-xs font-medium">Refund</span>
               </div>
               <span className="text-xl font-bold text-[#1A1D1F] pl-1">{stats?.refund || 0}</span>
             </div>
 
             {/* Discontinued */}
             <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1 bg-red-50 text-red-600 rounded-md">
                   <XCircle size={14} />
                 </div>
                 <span className="text-[#6E7191] text-xs font-medium">Discontinued</span>
               </div>
               <span className="text-xl font-bold text-[#1A1D1F] pl-1">{stats?.discontinued || 0}</span>
             </div>
 
              {/* Hold */}
              <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1 bg-gray-100 text-gray-600 rounded-md">
                   <PauseCircle size={14} />
                 </div>
                 <span className="text-[#6E7191] text-xs font-medium">Hold</span>
               </div>
               <span className="text-xl font-bold text-[#1A1D1F] pl-1">{stats?.hold || 0}</span>
             </div>
 
              {/* Placed */}
              <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1 bg-purple-50 text-purple-600 rounded-md">
                   <Briefcase size={14} />
                 </div>
                 <span className="text-[#6E7191] text-xs font-medium">Placed</span>
               </div>
               <span className="text-xl font-bold text-[#1A1D1F] pl-1">{stats?.placed || 0}</span>
             </div>
          </div>
        </div>

        {/* Progress Circular Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#F5F5F7] shadow-sm flex flex-col items-center justify-center h-full min-h-[160px]">
           <p className="text-[#6E7191] text-xs font-medium w-full text-left mb-2">Course Progress</p>
           <div className="w-full flex-1 flex items-center justify-center text-xs">
             <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#F5F5F7] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E7191]" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={filters.search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
          <select
            value={filters.course_status}
            onChange={(e) => handleFilterChange('course_status', e.target.value)}
            className="px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all cursor-pointer min-w-[140px]"
          >
            <option value="">Status: All</option>
            <option value="YTS">Yet to Start</option>
            <option value="IP">In Progress</option>
            <option value="C">Completed</option>
            <option value="R">Refund</option>
            <option value="D">Discontinued</option>
            <option value="H">Hold</option>
            <option value="P">Placed</option>
          </select>
          <select
            value={filters.mode_of_class}
            onChange={(e) => handleFilterChange('mode_of_class', e.target.value)}
            className="px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all cursor-pointer min-w-[140px]"
          >
            <option value="">Mode: All</option>
            <option value="ON">Online</option>
            <option value="OFF">Offline</option>
          </select>
           <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all cursor-pointer min-w-[140px]"
          >
            <option value="">Location: All</option>
            {/* Populate dynamically if possible, hardcoded common ones for now */}
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#F5F5F7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F7F8]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Mode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#6E7191]">
                    Loading students...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#6E7191]">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E6F5F5] flex items-center justify-center text-[#4ECDC4] font-bold text-sm">
                          {student.first_name?.[0]}{student.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A1D1F]">{student.first_name} {student.last_name}</p>
                          <p className="text-xs text-[#6E7191]">{student.student_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                         <span className="text-sm text-[#1A1D1F]">{student.email}</span>
                         <span className="text-xs text-[#6E7191]">{student.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#1A1D1F]">{student.course_name || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.mode_of_class === 'ON' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {student.mode_of_class === 'ON' ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.course_status === 'C' ? 'bg-green-100 text-green-800' :
                        student.course_status === 'IP' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {student.course_status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-[#6E7191] hover:text-[#1A1D1F]">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#F5F5F7]">
          <p className="text-sm text-[#6E7191]">
            Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(currentPage * 10, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-[#E0E0E2] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F7F7F8]"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * 10 >= totalCount}
              className="p-2 border border-[#E0E0E2] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F7F7F8]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
