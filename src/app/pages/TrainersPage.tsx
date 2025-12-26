import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Briefcase,
  Clock
} from 'lucide-react';
import { getTrainers, getTrainerStats, Trainer, TrainerFilters, TrainerStats } from '../services/TrainerService/TrainerService';
import { toast } from 'sonner';

export function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<TrainerStats | null>(null);
  const [filters, setFilters] = useState<TrainerFilters>({
    page: 1,
    search: '',
  });

  // Fetch stats (client-side calculation for now)
  useEffect(() => {
    const loadStats = async () => {
      const data = await getTrainerStats();
      setStats(data);
    };
    loadStats();
  }, []);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const data = await getTrainers({ ...filters, page: currentPage });
      setTrainers(data.results);
      setTotalCount(data.count);
    } catch (error) {
      toast.error("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [currentPage, filters.search, filters.employment_type, filters.is_active]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof TrainerFilters, value: string) => {
    let finalValue: any = value;
    if (value === '') finalValue = undefined;
    if (key === 'is_active') {
      if (value === 'true') finalValue = true;
      else if (value === 'false') finalValue = false;
      else finalValue = undefined;
    }
    
    setFilters(prev => ({ ...prev, [key]: finalValue }));
    setCurrentPage(1);
  };

  const getInitials = (name: string) => {
    if (!name) return 'TR';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1D1F]">Trainers Management</h1>
          <p className="text-[#6E7191] text-sm mt-1">Manage all trainers and instructors</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E0E2] rounded-xl text-[#1A1D1F] font-medium hover:bg-[#F7F7F8] transition-colors">
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Trainers */}
        <div className="bg-white p-6 rounded-2xl border border-[#F5F5F7] shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F5F5] flex items-center justify-center text-[#4ECDC4]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[#6E7191] text-sm font-medium">Total Trainers</p>
            </div>
          </div>
          <div className="mt-4">
             <h3 className="text-4xl font-bold text-[#1A1D1F]">{stats?.total || 0}</h3>
          </div>
        </div>

        {/* Employment Type Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-[#F5F5F7] shadow-sm min-h-[140px] flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-3">
             <div className="w-12 h-12 rounded-xl bg-[#FFF4E6] flex items-center justify-center text-[#FFB057]">
              <Briefcase size={24} />
            </div>
             <div>
              <p className="text-[#6E7191] text-sm font-medium">Type Breakdown</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm mt-auto">
            <div className="flex flex-col">
              <span className="text-[#6E7191]">Freelance</span>
              <span className="font-bold text-[#1A1D1F] text-lg">{stats?.freelance || 0}</span>
            </div>
             <div className="w-px h-8 bg-[#E0E0E2]"></div>
             <div className="flex flex-col text-right">
              <span className="text-[#6E7191]">Full Time</span>
              <span className="font-bold text-[#1A1D1F] text-lg">{stats?.fullTime || 0}</span>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
         <div className="bg-white p-6 rounded-2xl border border-[#F5F5F7] shadow-sm min-h-[140px] flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-3">
             <div className="w-12 h-12 rounded-xl bg-[#E6F5E6] flex items-center justify-center text-[#44A08D]">
              <Award size={24} />
            </div>
             <div>
              <p className="text-[#6E7191] text-sm font-medium">Status Breakdown</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm mt-auto">
            <div className="flex flex-col">
              <span className="text-[#6E7191]">Active</span>
              <span className="font-bold text-[#1A1D1F] text-lg">{stats?.active || 0}</span>
            </div>
             <div className="w-px h-8 bg-[#E0E0E2]"></div>
             <div className="flex flex-col text-right">
              <span className="text-[#6E7191]">Inactive</span>
              <span className="font-bold text-[#1A1D1F] text-lg">{stats?.inactive || 0}</span>
            </div>
          </div>
        </div>

        {/* Ongoing Batch */}
        <div className="bg-white p-6 rounded-2xl border border-[#F5F5F7] shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F0F5FF] flex items-center justify-center text-[#2F80ED]">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[#6E7191] text-sm font-medium">Ongoing Batch</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-bold text-[#1A1D1F]">{stats?.ongoingBatch || 0}</h3>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#F5F5F7] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E7191]" />
          <input
            type="text"
            placeholder="Search trainers..."
            value={filters.search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
          <select
            value={filters.employment_type || ''}
            onChange={(e) => handleFilterChange('employment_type', e.target.value)}
            className="px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all cursor-pointer min-w-[160px]"
          >
            <option value="">Type: All</option>
            <option value="FL">Freelance</option>
            <option value="FT">Full Time</option>
          </select>
          <select
            value={filters.is_active === undefined ? '' : filters.is_active.toString()}
            onChange={(e) => handleFilterChange('is_active', e.target.value)}
            className="px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all cursor-pointer min-w-[140px]"
          >
            <option value="">Status: All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#F5F5F7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F7F8]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Trainer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Expertise</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Exp & Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6E7191] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#6E7191]">
                    Loading trainers...
                  </td>
                </tr>
              ) : trainers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#6E7191]">
                    No trainers found.
                  </td>
                </tr>
              ) : (
                trainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-[#FAFAFA] transition-colors">
                    {/* Trainer Name & ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E6F5F5] flex items-center justify-center text-[#4ECDC4] font-bold text-sm">
                          {getInitials(trainer.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A1D1F]">{trainer.name}</p>
                          <p className="text-xs text-[#6E7191]">{trainer.trainer_id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                         <span className="text-sm text-[#1A1D1F]">{trainer.email}</span>
                         <span className="text-xs text-[#6E7191]">
                           {trainer.country_code} {trainer.phone_number}
                         </span>
                      </div>
                    </td>

                    {/* Expertise / Stack */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {trainer.stack_details && trainer.stack_details.length > 0 ? (
                          trainer.stack_details.slice(0, 2).map((stack) => (
                            <span 
                              key={stack.id} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              {stack.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#6E7191]">-</span>
                        )}
                        {trainer.stack_details && trainer.stack_details.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{trainer.stack_details.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-[#1A1D1F]">
                          {trainer.location === 'Others' ? trainer.other_location : trainer.location}
                        </span>
                      </div>
                    </td>

                    {/* Experience & Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                           <Clock size={14} className="text-[#6E7191]" />
                           <span className="text-sm text-[#1A1D1F]">{trainer.years_of_experience} Years</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <Briefcase size={14} className="text-[#6E7191]" />
                           <span className="text-xs text-[#6E7191]">
                             {trainer.employment_type === 'FT' ? 'Full Time' : 
                              trainer.employment_type === 'FL' ? 'Freelance' : 
                              trainer.employment_type}
                           </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trainer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {trainer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Action */}
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
