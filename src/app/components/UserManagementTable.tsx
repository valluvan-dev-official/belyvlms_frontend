import { EllipsisVertical, Mail, Phone } from 'lucide-react';

interface User {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  enrolledCourses: number;
  completedCourses: number;
  status: 'active' | 'inactive';
  lastActive: string;
}

const userData: User[] = [
  {
    id: 1,
    name: 'Charlie Rawal',
    avatar: '👨‍💼',
    email: 'charlie.rawal@example.com',
    phone: '+1 234 567 8901',
    enrolledCourses: 8,
    completedCourses: 5,
    status: 'active',
    lastActive: '2 hours ago'
  },
  {
    id: 2,
    name: 'Ariana Agarwal',
    avatar: '👩‍💼',
    email: 'ariana.ag@example.com',
    phone: '+1 234 567 8902',
    enrolledCourses: 12,
    completedCourses: 10,
    status: 'active',
    lastActive: '5 hours ago'
  },
  {
    id: 3,
    name: 'John Smith',
    avatar: '👨‍🎓',
    email: 'john.smith@example.com',
    phone: '+1 234 567 8903',
    enrolledCourses: 5,
    completedCourses: 3,
    status: 'active',
    lastActive: '1 day ago'
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    avatar: '👩‍🎓',
    email: 'sarah.j@example.com',
    phone: '+1 234 567 8904',
    enrolledCourses: 6,
    completedCourses: 2,
    status: 'inactive',
    lastActive: '3 days ago'
  }
];

export function UserManagementTable() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#1A1D1F]">User Management</h3>
        <button className="px-4 py-2 bg-[#1A1D1F] text-white rounded-xl text-sm hover:bg-[#2A2D2F] transition-colors">
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F5F5F7]">
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">User</th>
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Contact</th>
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Courses</th>
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Status</th>
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Last Active</th>
              <th className="text-left pb-4 text-xs font-medium text-[#6E7191] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <tr key={user.id} className={index !== userData.length - 1 ? 'border-b border-[#F5F5F7]' : ''}>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E0E0E2] to-[#F5F5F7] flex items-center justify-center">
                      <span className="text-xl">{user.avatar}</span>
                    </div>
                    <div>
                      <p className="text-[#1A1D1F] font-medium">{user.name}</p>
                      <p className="text-xs text-[#6E7191]">ID: #{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[#6E7191]" />
                      <span className="text-sm text-[#6E7191]">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#6E7191]" />
                      <span className="text-sm text-[#6E7191]">{user.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#1A1D1F]">
                      <span className="font-medium">{user.completedCourses}</span>/{user.enrolledCourses}
                    </span>
                    <div className="w-24 h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4ECDC4] rounded-full"
                        style={{ width: `${(user.completedCourses / user.enrolledCourses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-[#E6F5E6] text-[#44A08D]'
                        : 'bg-[#F5F5F7] text-[#6E7191]'
                    }`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 text-sm text-[#6E7191]">{user.lastActive}</td>
                <td className="py-4">
                  <button className="p-2 hover:bg-[#F7F7F8] rounded-lg transition-colors">
                    <EllipsisVertical size={18} className="text-[#6E7191]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}