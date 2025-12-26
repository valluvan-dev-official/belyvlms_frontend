import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  ClipboardList, 
  ChartBar, 
  FolderClosed, 
  Inbox, 
  Settings,
  Users,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
  isCollapsed?: boolean;
}

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  path?: string;
  subItems?: SubNavItem[];
}

interface SubNavItem {
  id: string;
  label: string;
  path: string;
}

export function Sidebar({ activeItem = 'overview', isCollapsed = false }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['management']);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { id: 'overview', icon: <LayoutGrid size={20} />, label: 'Overview', path: '/dashboard' },
    { id: 'assignment', icon: <ClipboardList size={20} />, label: 'Assignment' },
    { id: 'reports', icon: <ChartBar size={20} />, label: 'Reports', badge: 1 },
    { 
      id: 'management', 
      icon: <Users size={20} />, 
      label: 'Management',
      subItems: [
        { id: 'users', label: 'Users', path: '/management/users' },
        { id: 'students', label: 'Students', path: '/management/students' },
        { id: 'trainers', label: 'Trainers', path: '/management/trainers' },
      ]
    },
    { id: 'file-storage', icon: <FolderClosed size={20} />, label: 'File Storage' },
    { id: 'inbox', icon: <Inbox size={20} />, label: 'Inbox', badge: 1 },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavClick = (item: NavItem) => {
    if (item.subItems) {
      toggleExpanded(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleSubNavClick = (path: string) => {
    navigate(path);
  };

  const isActive = (itemId: string, path?: string) => {
    if (path) {
      return location.pathname === path;
    }
    return activeItem === itemId;
  };

  const isSubItemActive = (path: string) => {
    return location.pathname === path;
  };

  const isAdminDashboard = location.pathname.includes('/admin');
  const dashboardType = isAdminDashboard ? 'Admin Dashboard' : 'Student Dashboard';

  return (
    <aside 
      className={`bg-white h-screen flex flex-col p-6 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ borderRight: '1px solid #F5F5F7' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center">
          <div className="w-5 h-5 bg-white rounded opacity-90" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}></div>
        </div>
        {!isCollapsed && (
          <span className="font-bold text-[#1A1D1F] text-lg">BeLyv LMS</span>
        )}
      </div>

      {/* Dashboard Switcher Dropdown */}
      {!isCollapsed && (
        <div className="relative mb-6">
          <button
            onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F7F7F8] border border-[#E0E0E2] rounded-xl hover:border-[#4ECDC4] transition-colors"
          >
            <span className="text-sm font-medium text-[#1A1D1F] truncate">
              {dashboardType}
            </span>
            <ChevronDown size={16} className="text-[#6E7191]" />
          </button>
          
          {dashboardDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setDashboardDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#E0E0E2] rounded-xl shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setDashboardDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                    !isAdminDashboard
                      ? 'bg-[#F7F7F8] text-[#1A1D1F] font-medium'
                      : 'text-[#6E7191] hover:bg-[#F7F7F8]'
                  }`}
                >
                  Student Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/admin/dashboard');
                    setDashboardDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                    isAdminDashboard
                      ? 'bg-[#F7F7F8] text-[#1A1D1F] font-medium'
                      : 'text-[#6E7191] hover:bg-[#F7F7F8]'
                  }`}
                >
                  Admin Dashboard
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleNavClick(item)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative
                ${isActive(item.id, item.path) && !item.subItems
                  ? 'bg-[#1A1D1F] text-white' 
                  : 'text-[#6E7191] hover:bg-[#F7F7F8]'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <span className={isActive(item.id, item.path) && !item.subItems ? 'text-white' : 'text-[#6E7191]'}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#FF6B9D] text-white text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {item.subItems && (
                    <span className="text-[#6E7191]">
                      {expandedItems.includes(item.id) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FF6B9D]"></span>
              )}
            </button>

            {/* Sub Items */}
            {item.subItems && expandedItems.includes(item.id) && !isCollapsed && (
              <div className="ml-4 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => handleSubNavClick(subItem.path)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm
                      ${isSubItemActive(subItem.path)
                        ? 'bg-[#F7F7F8] text-[#1A1D1F] font-medium' 
                        : 'text-[#6E7191] hover:bg-[#F7F7F8]'
                      }
                    `}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6E7191]"></span>
                    <span className="flex-1 text-left">{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
