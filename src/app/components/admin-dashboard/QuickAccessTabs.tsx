import { useState } from 'react';
import { Users, GraduationCap, BookOpen, UserCheck, BarChart3, Settings } from 'lucide-react';

interface QuickAccessTabsProps {
  activeSection: 'overview' | 'students' | 'trainers' | 'courses' | 'onboarding' | 'analytics';
  onSectionChange: (section: 'overview' | 'students' | 'trainers' | 'courses' | 'onboarding' | 'analytics') => void;
}

export function QuickAccessTabs({ activeSection, onSectionChange }: QuickAccessTabsProps) {
  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'trainers' as const, label: 'Trainers', icon: GraduationCap },
    { id: 'courses' as const, label: 'Courses', icon: BookOpen },
    { id: 'onboarding' as const, label: 'Onboarding', icon: UserCheck }
  ];

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
