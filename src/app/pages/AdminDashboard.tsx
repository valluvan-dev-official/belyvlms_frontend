import { useState } from 'react';
import { MotivationalQuote } from '../components/admin-dashboard/MotivationalQuote';
import { QuickStatsOverview } from '../components/admin-dashboard/QuickStatsOverview';
import { DashboardOverview } from '../components/admin-dashboard/DashboardOverview';
import { OnboardingPipeline } from '../components/admin-dashboard/OnboardingPipeline';
import { RecentApprovals } from '../components/admin-dashboard/RecentApprovals';
import { AlertsPanel } from '../components/admin-dashboard/AlertsPanel';
import { StudentOverview } from '../components/admin-dashboard/StudentOverview';
import { TrainerOverview } from '../components/admin-dashboard/TrainerOverview';
import { CourseOverview } from '../components/admin-dashboard/CourseOverview';
import { StudentMetrics } from '../components/admin-dashboard/StudentMetrics';
import { TrainerMetrics } from '../components/admin-dashboard/TrainerMetrics';
import { CourseMetrics } from '../components/admin-dashboard/CourseMetrics';
import { StudentInsights } from '../components/admin-dashboard/StudentInsights';
import { TrainerInsights } from '../components/admin-dashboard/TrainerInsights';
import { CourseInsights } from '../components/admin-dashboard/CourseInsights';
import { QuickAccessTabs } from '../components/admin-dashboard/QuickAccessTabs';

import { Activity, Layout, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<'overview' | 'students' | 'trainers' | 'courses' | 'onboarding' | 'analytics'>('overview');

  return (
    <div className="space-y-6">
      {/* Motivational Quote - Always visible */}
      <MotivationalQuote />

      {/* Quick Access Tabs */}
      <QuickAccessTabs activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Dynamic Content Based on Active Section */}
      {activeSection === 'overview' && <OverviewSection />}
      {activeSection === 'students' && <StudentsSection />}
      {activeSection === 'trainers' && <TrainersSection />}
      {activeSection === 'courses' && <CoursesSection />}
      {activeSection === 'onboarding' && <OnboardingSection />}
    </div>
  );
}

// Overview Section - Comprehensive view of everything
function OverviewSection() {
  return (
    <>
      <DashboardOverview />
    </>
  );
}

// Students Focused Section
function StudentsSection() {
  return (
    <>
      <StudentOverview />
      <StudentInsights />
    </>
  );
}

// Trainers Focused Section
function TrainersSection() {
  return (
    <>
      <TrainerOverview />
      <TrainerInsights />
    </>
  );
}

// Courses Focused Section
function CoursesSection() {
  return (
    <>
      <CourseOverview />
      <CourseInsights />
    </>
  );
}

// Onboarding Focused Section
function OnboardingSection() {
  return (
    <>
      {/* Quick Stats Overview */}
      <QuickStatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OnboardingPipeline />
        </div>
        <div className="lg:col-span-1">
          <RecentApprovals />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
        <div className="lg:col-span-2">
          <SystemInsights />
        </div>
      </div>
    </>
  );
}

// System Insights Component
function SystemInsights() {
  const insights = [
    {
      icon: TrendingUp,
      label: 'Approval Rate',
      value: '85%',
      change: '+5%',
      changeType: 'positive' as const,
      description: 'vs last week',
      color: 'emerald'
    },
    {
      icon: Activity,
      label: 'Avg Processing Time',
      value: '2.5 hrs',
      change: '-30min',
      changeType: 'positive' as const,
      description: 'vs last week',
      color: 'blue'
    },
    {
      icon: Layout,
      label: 'Active Batches',
      value: '8',
      change: '+2',
      changeType: 'positive' as const,
      description: 'this month',
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-[#1A1D1F]">System Insights</h3>
        <p className="text-xs sm:text-sm text-[#6E7191] mt-1">Performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
            emerald: {
              bg: 'bg-emerald-50',
              icon: 'text-emerald-600',
              text: 'text-emerald-900'
            },
            blue: {
              bg: 'bg-blue-50',
              icon: 'text-blue-600',
              text: 'text-blue-900'
            },
            purple: {
              bg: 'bg-purple-50',
              icon: 'text-purple-600',
              text: 'text-purple-900'
            }
          };
          const colors = colorClasses[insight.color];

          return (
            <div
              key={insight.label}
              className={`${colors.bg} rounded-xl p-4 sm:p-5 border border-${insight.color}-200`}
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-sm`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon}`} />
              </div>

              <div className={`text-2xl sm:text-3xl font-bold ${colors.text} mb-1`}>
                {insight.value}
              </div>

              <div className={`text-xs sm:text-sm font-semibold ${colors.text} mb-2`}>
                {insight.label}
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 ${insight.changeType === 'positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} text-xs font-bold rounded`}>
                  {insight.change}
                </span>
                <span className={`text-xs ${colors.text} opacity-75`}>
                  {insight.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===============================================================


// import { AdminStatsCards } from '../components/AdminStatsCards';
// import { OnboardingPipeline } from '../components/OnboardingPipeline';
// import { RecentApprovals } from '../components/RecentApprovals';
// import { CourseAnalytics } from '../components/CourseAnalytics';
// import { RecentActivity } from '../components/RecentActivity';
// import { UserManagementTable } from '../components/UserManagementTable';
// import { HoursSpentChart } from '../components/HoursSpentChart';
// import { PerformanceChart } from '../components/PerformanceChart';
// import { SystemOverview } from '../components/SystemOverview';
// import { UserActivityChart } from '../components/UserActivityChart';

// export function AdminDashboard() {
//   return (
//     <>
//       {/* Admin Stats Cards */}
//       <AdminStatsCards />

//       {/* Apache ECharts Verification Chart */}
//       <div className="mb-8">
//         <UserActivityChart />
//       </div>

//       {/* Onboarding Overview Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
//         <div className="xl:col-span-2 h-full">
//           <OnboardingPipeline />
//         </div>
//         <div className="xl:col-span-1 h-full">
//           <RecentApprovals />
//         </div>
//       </div>

//       {/* Course Analytics and Recent Activity */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
//         <CourseAnalytics />
//         <RecentActivity />
//       </div>

//       {/* User Management Table */}
//       <div className="mb-8">
//         <UserManagementTable />
//       </div>

//       {/* Admin Charts Section */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
//         <HoursSpentChart />
//         <PerformanceChart />
//       </div>

//       {/* System Overview */}
//       <div className="mb-8">
//         <SystemOverview />
//       </div>
//     </>
//   );
// }


// =====================================================================================================================================

