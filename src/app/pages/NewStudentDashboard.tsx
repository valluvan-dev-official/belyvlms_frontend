import { useState } from 'react';
import { MotivationalQuote } from '../components/admin-dashboard/MotivationalQuote';
import { QuickAccessTabs } from '../components/admin-dashboard/QuickAccessTabs';
import { StudentDashboardOverview } from '../components/student-dashboard/StudentDashboardOverview';
import { useNavigate } from 'react-router-dom';

export function NewStudentDashboard() {
  const [activeSection, setActiveSection] = useState<'overview' | 'courses' | 'schedule' | 'progress'>('overview');
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Motivational Quote - Always visible */}
      <MotivationalQuote />

      {/* Quick Access Tabs */}
      <QuickAccessTabs 
        activeSection={activeSection} 
        onSectionChange={(section: any) => setActiveSection(section)}
        role="student"
      />

      {/* Dynamic Content Based on Active Section */}
      {activeSection === 'overview' && <StudentDashboardOverview />}
      {activeSection === 'courses' && navigate('/student/my-courses')}
      {activeSection === 'schedule' && navigate('/student/schedule')}
      {activeSection === 'progress' && navigate('/student/progress')}

      {/* Quick Actions Bar - Always visible at bottom */}
      <StudentQuickActionBar />
    </div>
  );
}

// Quick Action Bar Component for Students
function StudentQuickActionBar() {
  return (
    <div className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="text-white">
          <h3 className="text-lg sm:text-xl font-bold mb-1">Ready to Continue Learning?</h3>
          <p className="text-xs sm:text-sm opacity-90">
            Access your courses, view schedule, or track your progress
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <button className="px-4 sm:px-5 py-2.5 bg-white text-[#1A1D1F] rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shadow-md text-center">
            Continue Learning
          </button>
          <button className="px-4 sm:px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors border border-white/30 text-center">
            My Schedule
          </button>
          <button className="px-4 sm:px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors border border-white/30 text-center">
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
}
