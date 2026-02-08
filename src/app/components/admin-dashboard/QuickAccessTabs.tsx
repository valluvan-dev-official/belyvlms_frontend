import { useState } from 'react';
import { Users, GraduationCap, BookOpen, UserCheck, BarChart3, Settings, Calendar, TrendingUp, Layers } from 'lucide-react';

interface QuickAccessTabsProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
  role?: 'admin' | 'trainer' | 'student';
}

export function QuickAccessTabs({ activeSection, onSectionChange, role = 'admin' }: QuickAccessTabsProps) {
  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'trainers', label: 'Trainers', icon: GraduationCap },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'onboarding', label: 'Onboarding', icon: UserCheck }
  ];

  const trainerTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'batches', label: 'My Batches', icon: Layers },
    { id: 'students', label: 'Students', icon: Users }
  ];

  const studentTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp }
  ];

  const getTabs = () => {
    switch (role) {
      case 'trainer': return trainerTabs;
      case 'student': return studentTabs;
      default: return adminTabs;
    }
  };

  const tabs = getTabs();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onSectionChange(tab.id)}
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
          );
        })}
      </div>
    </div>
  );
}
