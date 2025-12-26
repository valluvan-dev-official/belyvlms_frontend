import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  MoreVertical,
  Mail,
  Phone,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  courses: number;
  joinDate: string;
  avatar?: string;
}

import { getAllUsers, UserListItem } from '../services/ProfileService/ProfileService';

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data: UserListItem[] = await getAllUsers();
        const mapped: User[] = data.map(u => ({
          id: String(u.id),
          name: u.name || (u.email ? u.email.split('@')[0] : 'User'),
          email: u.email,
          role: u.role_name || 'Student',
          status: u.is_active ? 'active' : 'inactive',
          courses: 0,
          joinDate: u.last_login ? new Date(u.last_login).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          avatar: u.profile_picture || undefined,
        }));
        setUsers(mapped);
      } catch (e) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);
  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#D4F4DD] text-[#2B9A66]';
      case 'inactive':
        return 'bg-[#FFE5E5] text-[#E63946]';
      case 'pending':
        return 'bg-[#FFF3CD] text-[#F59E0B]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-[#E6E6FA] text-[#6366F1]';
      case 'Instructor':
        return 'bg-[#FFF5E6] text-[#F59E0B]';
      case 'Student':
        return 'bg-[#E6F5F5] text-[#4ECDC4]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const clearFilters = () => {
    setSelectedRole('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1D1F] mb-1">User Management</h2>
          <p className="text-sm text-[#6E7191]">Manage and monitor all users in the system</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E0E2] rounded-xl hover:border-[#4ECDC4] transition-colors">
            <Download size={18} className="text-[#6E7191]" />
            <span className="text-sm font-medium text-[#1A1D1F]">Export</span>
          </button>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl hover:shadow-lg transition-all"
          >
            <UserPlus size={18} />
            <span className="text-sm font-medium">Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2]">
          <p className="text-sm text-[#6E7191] mb-2">Total Users</p>
          <p className="text-3xl font-semibold text-[#1A1D1F]">{users.length}</p>
          <p className="text-xs text-[#4ECDC4] mt-2">↑ 12% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2]">
          <p className="text-sm text-[#6E7191] mb-2">Active Users</p>
          <p className="text-3xl font-semibold text-[#1A1D1F]">
            {users.filter(u => u.status === 'active').length}
          </p>
          <p className="text-xs text-[#4ECDC4] mt-2">↑ 8% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2]">
          <p className="text-sm text-[#6E7191] mb-2">Instructors</p>
          <p className="text-3xl font-semibold text-[#1A1D1F]">
            {users.filter(u => u.role === 'Instructor').length}
          </p>
          <p className="text-xs text-[#6E7191] mt-2">Active instructors</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2]">
          <p className="text-sm text-[#6E7191] mb-2">Pending</p>
          <p className="text-3xl font-semibold text-[#1A1D1F]">
            {users.filter(u => u.status === 'pending').length}
          </p>
          <p className="text-xs text-[#FF6B9D] mt-2">Awaiting approval</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0E0E2] mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E7191]" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
            <option value="Admin">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          {/* Filter Button */}
          <button 
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F7F7F8] rounded-xl hover:bg-[#4ECDC4] hover:text-white transition-all"
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filters</span>
          </button>

          {/* Clear Filters */}
          {(searchQuery || selectedRole !== 'all' || selectedStatus !== 'all') && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-[#FF6B9D] hover:bg-[#FFF5F7] rounded-xl transition-all"
            >
              <X size={18} />
              <span className="text-sm font-medium">Clear</span>
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedRole !== 'all' || selectedStatus !== 'all') && (
          <div className="mt-4 pt-4 border-t border-[#E0E0E2] flex items-center gap-2">
            <span className="text-sm text-[#6E7191]">Active filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-[#F7F7F8] text-[#1A1D1F] text-xs rounded-lg">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedRole !== 'all' && (
              <span className="px-3 py-1 bg-[#F7F7F8] text-[#1A1D1F] text-xs rounded-lg">
                Role: {selectedRole}
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-3 py-1 bg-[#F7F7F8] text-[#1A1D1F] text-xs rounded-lg">
                Status: {selectedStatus}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E0E0E2] overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F7F8]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6E7191] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E2]">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1D1F]">{user.name}</p>
                        <p className="text-sm text-[#6E7191]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#1A1D1F]">{user.courses}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#6E7191]">
                      {new Date(user.joinDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors" title="Send Email">
                        <Mail size={16} className="text-[#6E7191]" />
                      </button>
                      <button className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors" title="Edit">
                        <Edit size={16} className="text-[#6E7191]" />
                      </button>
                      <button className="p-2 hover:bg-[#FFF5F7] rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} className="text-[#FF6B9D]" />
                      </button>
                      <button className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors">
                        <MoreVertical size={16} className="text-[#6E7191]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentUsers.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F7F7F8] flex items-center justify-center">
              <Search size={24} className="text-[#6E7191]" />
            </div>
            <p className="text-[#1A1D1F] font-medium mb-1">No users found</p>
            <p className="text-sm text-[#6E7191]">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6E7191]">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#E0E0E2] hover:bg-[#F7F7F8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} className="text-[#6E7191]" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-[#1A1D1F] text-white'
                    : 'border border-[#E0E0E2] text-[#6E7191] hover:bg-[#F7F7F8]'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#E0E0E2] hover:bg-[#F7F7F8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} className="text-[#6E7191]" />
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1A1D1F]">Add New User</h3>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors"
              >
                <X size={20} className="text-[#6E7191]" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1D1F] mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1D1F] mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1D1F] mb-2">Role</label>
                <select className="w-full px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all">
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1D1F] mb-2">Status</label>
                <select className="w-full px-4 py-2.5 bg-[#F7F7F8] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4] focus:bg-white transition-all">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-4 py-2.5 border border-[#E0E0E2] text-[#6E7191] rounded-xl hover:bg-[#F7F7F8] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
