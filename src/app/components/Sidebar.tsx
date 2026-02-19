import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  ClipboardList,
  ChartBar,
  FolderClosed,
  Inbox,
  BookOpen,
  GraduationCap,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  Shield,
  LogOut,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listOnboardRequests } from '../onboardRequests/api';
import { PERMISSIONS } from '../config/permissions';

interface SidebarProps {
  activeItem?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavItemClick?: () => void;
}

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  path?: string;
  subItems?: SubNavItem[];
  permission?: string;
}

interface SubNavItem {
  id: string;
  label: string;
  path: string;
  permission?: string;
}

export function Sidebar({ activeItem = 'overview', isCollapsed = false, onToggleCollapse, onNavItemClick }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['management']);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRole, permissions, logout, hasPermission } = useAuth();
  const [onboardPendingCount, setOnboardPendingCount] = useState<number>(0);

  useEffect(() => {
    if (!activeRole?.code) return;
    (async () => {
      try {
        const [submitted, underReview] = await Promise.all([
          listOnboardRequests({ status: 'SUBMITTED' }),
          listOnboardRequests({ status: 'UNDER_REVIEW' }),
        ]);
        const next = (submitted?.count || 0) + (underReview?.count || 0);
        setOnboardPendingCount(next);
      } catch {
        setOnboardPendingCount(0);
      }
    })();
  }, [activeRole?.code]);

  const navItems: NavItem[] = [
    { id: 'overview', icon: <LayoutGrid size={20} />, label: 'Dashboard', path: '/dashboard' }, // Removed permission check
    { id: 'assignment', icon: <ClipboardList size={20} />, label: 'Assignment' }, // Removed permission check
    { id: 'reports', icon: <ChartBar size={20} />, label: 'Reports', badge: 1, permission: PERMISSIONS.DASHBOARD_WIDGET_STATS_VIEW },
    {
      id: 'course-management',
      icon: <BookOpen size={20} />,
      label: 'Course Management',
      subItems: [
        { id: 'courses-all', label: 'All Courses', path: '/courses' },
        { id: 'courses-categories', label: 'Categories', path: '/courses/categories' },
      ]
    },
    {
      id: 'batch-management',
      icon: <GraduationCap size={20} />,
      label: 'Batch Management',
      subItems: [
        { id: 'batches-manage', label: 'Manage Batches', path: '/batches/manage' },
        { id: 'batches-monitoring', label: 'Batch Dashboard', path: '/batches/monitoring' },
      ]
    },
    {
      id: 'management',
      icon: <Users size={20} />,
      label: 'Management',
      badge: onboardPendingCount || undefined,
      subItems: [
        { id: 'users', label: 'Users', path: '/management/users', permission: PERMISSIONS.USER_VIEW },
        { id: 'onboard-requests', label: 'Onboard Requests', path: '/management/onboard-requests', permission: PERMISSIONS.USER_VIEW },
        { id: 'students', label: 'Students', path: '/management/students', permission: PERMISSIONS.STUDENT_MANAGEMENT_VIEW },
        { id: 'trainers', label: 'Trainers', path: '/management/trainers', permission: PERMISSIONS.TRAINER_VIEW },
        // Removed legacy Batches here to avoid duplication (moved to Batch Management section)
      ]
    },
    { id: 'file-storage', icon: <FolderClosed size={20} />, label: 'File Storage' }, // Removed permission check
    { id: 'inbox', icon: <Inbox size={20} />, label: 'Inbox', badge: 1 }, // Removed permission check
    {
      id: 'settings',
      icon: <Settings size={20} />,
      label: 'Settings',
      // Removed generic permission check. Visibility will be derived from subItems.
      subItems: [
        {
          id: 'access-control',
          label: 'Access Control',
          path: '/management/access-control',
          // Allow if user has ANY access control permission
          permission: undefined
        },
        { id: 'audit-logs', label: 'Audit Logs', path: '/management/audit-logs', permission: PERMISSIONS.AUDIT_LOG_VIEW },
        { id: 'system-log', label: 'System Log', path: '/audit', permission: PERMISSIONS.AUDIT_LOG_VIEW },
        { id: 'profile-configs', label: 'Profile Configs', path: '/management/profile-configs', permission: PERMISSIONS.ACCESS_CONTROL_VIEW },
        { id: 'profile-fields', label: 'Profile Fields', path: '/management/profile-fields', permission: PERMISSIONS.ACCESS_CONTROL_VIEW },
      ]
    },
  ];

  // Filter items based on permissions
  const visibleNavItems = navItems.filter(item => {
    // Check main item permission
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }

    // Check sub items
    if (item.subItems) {
      // Filter sub-items based on permissions
      const visibleSubItems = item.subItems.filter(subItem => {
        // Special logic for Access Control: Show if user has ANY relevant permission
        if (subItem.id === 'access-control') {
          return hasPermission(PERMISSIONS.ACCESS_CONTROL_MATRIX_VIEW) ||
            hasPermission(PERMISSIONS.ACCESS_CONTROL_MATRIX_EDIT) ||
            hasPermission(PERMISSIONS.ROLE_VIEW) ||
            hasPermission(PERMISSIONS.PERMISSION_LIBRARY_VIEW);
        }
        return !subItem.permission || hasPermission(subItem.permission);
      });

      // If item has subItems but all are hidden, hide the main item
      if (visibleSubItems.length === 0) {
        return false;
      }

      // Update the item with filtered subItems
      item.subItems = visibleSubItems;
    }

    return true;
  });

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
      if (onNavItemClick) {
        onNavItemClick();
      }
    }
  };

  const handleSubNavClick = (path: string) => {
    navigate(path);
    if (onNavItemClick) {
      onNavItemClick();
    }
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

  return (
    <aside
      className={`bg-white h-screen flex flex-col p-6 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
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

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {visibleNavItems.map((item) => (
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

      {/* Footer Actions */}
      <div className="mt-auto flex flex-col gap-1 pt-4">
        {/* Collapse Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[#6E7191] hover:bg-[#F7F7F8]
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <span>
              {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            </span>
            {!isCollapsed && <span className="font-medium">Collapse</span>}
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[#6E7191] hover:bg-[#F7F7F8]
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <span>
            <LogOut size={20} />
          </span>
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
