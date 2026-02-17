import { 
  Users, GraduationCap, BookOpen, UserCheck, BarChart3, 
  Calendar, TrendingUp, Layers, LayoutDashboard, Clock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { PermissionGuard } from '../../PermissionGuard';
import { TabConfig } from '../registry/dashboardConfig';

interface QuickAccessTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ICON_MAP: Record<string, any> = {
  'Users': Users,
  'GraduationCap': GraduationCap,
  'BookOpen': BookOpen,
  'UserCheck': UserCheck,
  'BarChart3': BarChart3,
  'Calendar': Calendar,
  'TrendingUp': TrendingUp,
  'Layers': Layers,
  'LayoutDashboard': LayoutDashboard,
  'Clock': Clock
};

export function QuickAccessTabs({ tabs, activeTab, onTabChange }: QuickAccessTabsProps) {
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = ICON_MAP[tab.icon] || BarChart3;
          const isActive = activeTab === tab.id;
          
          return (
            <PermissionGuard key={tab.id} permissions={tab.permissions}>
              <button
                onClick={() => {
                  onTabChange(tab.id);
                  if (activeRole?.code?.toLowerCase() === 'btr' || activeRole?.code?.toLowerCase() === 'student') {
                    if (tab.id === 'overview') navigate('/student');
                    else if (tab.id === 'courses') navigate('/student/my-courses');
                    else if (tab.id === 'schedule') navigate('/student/schedule');
                    else if (tab.id === 'progress') navigate('/student/progress');
                  }
                }}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white shadow-md' 
                    : 'text-[#6E7191] hover:bg-gray-100'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6E7191]'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            </PermissionGuard>
          );
        })}
      </div>
    </div>
  );
}
