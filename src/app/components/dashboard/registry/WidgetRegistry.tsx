import { lazy } from 'react';

// Lazy load widgets for performance
const StatsOverviewWidget = lazy(() => import('../widgets/admin/StatsOverviewWidget'));
const GrowthTrendWidget = lazy(() => import('../widgets/admin/GrowthTrendWidget'));
const KeyMetricsWidget = lazy(() => import('../widgets/admin/KeyMetricsWidget'));
const UserDistributionWidget = lazy(() => import('../widgets/admin/UserDistributionWidget'));
const TodayScheduleWidget = lazy(() => import('../widgets/admin/TodayScheduleWidget'));

// Admin Dashboard Components (treated as widgets)
const MotivationalQuote = lazy(() => import('../../admin-dashboard/MotivationalQuote').then(m => ({ default: m.MotivationalQuote })));
const AdminDashboardOverview = lazy(() => import('../../admin-dashboard/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const QuickStatsOverview = lazy(() => import('../../admin-dashboard/QuickStatsOverview').then(m => ({ default: m.QuickStatsOverview })));
const OnboardingPipeline = lazy(() => import('../../admin-dashboard/OnboardingPipeline').then(m => ({ default: m.OnboardingPipeline })));
const RecentApprovals = lazy(() => import('../../admin-dashboard/RecentApprovals').then(m => ({ default: m.RecentApprovals })));
const AlertsPanel = lazy(() => import('../../admin-dashboard/AlertsPanel').then(m => ({ default: m.AlertsPanel })));
const StudentOverview = lazy(() => import('../../admin-dashboard/StudentOverview').then(m => ({ default: m.StudentOverview })));
const StudentInsights = lazy(() => import('../../admin-dashboard/StudentInsights').then(m => ({ default: m.StudentInsights })));
const TrainerOverview = lazy(() => import('../../admin-dashboard/TrainerOverview').then(m => ({ default: m.TrainerOverview })));
const TrainerInsights = lazy(() => import('../../admin-dashboard/TrainerInsights').then(m => ({ default: m.TrainerInsights })));
const CourseOverview = lazy(() => import('../../admin-dashboard/CourseOverview').then(m => ({ default: m.CourseOverview })));
const CourseInsights = lazy(() => import('../../admin-dashboard/CourseInsights').then(m => ({ default: m.CourseInsights })));


// Student Widgets
const StudentCoursesWidget = lazy(() => import('../widgets/student/StudentCoursesWidget'));
const StudentHoursWidget = lazy(() => import('../widgets/student/StudentHoursWidget'));
const StudentPerformanceWidget = lazy(() => import('../widgets/student/StudentPerformanceWidget'));
const StudentLeaderboardWidget = lazy(() => import('../widgets/student/StudentLeaderboardWidget'));

// Trainer Widgets
const TrainerStatsOverviewWidget = lazy(() => import('../widgets/trainer/TrainerStatsOverviewWidget'));
const TrainerActivityWidget = lazy(() => import('../widgets/trainer/TrainerActivityWidget'));
const TrainerKeyMetricsWidget = lazy(() => import('../widgets/trainer/TrainerKeyMetricsWidget'));
const TrainerTodayScheduleWidget = lazy(() => import('../widgets/trainer/TrainerTodayScheduleWidget'));
const TrainerBatchPerformanceWidget = lazy(() => import('../widgets/trainer/TrainerBatchPerformanceWidget'));
const TrainerQuickActionBar = lazy(() => import('../../trainer-dashboard/TrainerQuickActionBar').then(m => ({ default: m.TrainerQuickActionBar })));

// Section Components (Macro Widgets)
export const StudentDashboardOverview = lazy(() => import('../../student-dashboard/StudentDashboardOverview').then(m => ({ default: m.StudentDashboardOverview })));
export const StudentCoursesSection = lazy(() => import('../../student-dashboard/StudentCoursesSection').then(m => ({ default: m.StudentCoursesSection })));
export const StudentScheduleSection = lazy(() => import('../../student-dashboard/StudentScheduleSection').then(m => ({ default: m.StudentScheduleSection })));
export const StudentProgressSection = lazy(() => import('../../student-dashboard/StudentProgressSection').then(m => ({ default: m.StudentProgressSection })));

export const TrainerDashboardOverview = lazy(() => import('../../trainer-dashboard/TrainerDashboardOverview').then(m => ({ default: m.TrainerDashboardOverview })));
export const TrainerScheduleSection = lazy(() => import('../../trainer-dashboard/TrainerScheduleSection').then(m => ({ default: m.TrainerScheduleSection })));
export const TrainerBatchesSection = lazy(() => import('../../trainer-dashboard/TrainerBatchesSection').then(m => ({ default: m.TrainerBatchesSection })));
export const TrainerStudentsSection = lazy(() => import('../../trainer-dashboard/TrainerStudentsSection').then(m => ({ default: m.TrainerStudentsSection })));


export const WIDGET_REGISTRY: Record<string, React.LazyExoticComponent<any>> = {
  // Admin
  StatsOverviewWidget,
  GrowthTrendWidget,
  KeyMetricsWidget,
  UserDistributionWidget,
  TodayScheduleWidget,
  
  // Admin Components
  MotivationalQuote,
  AdminDashboardOverview,
  QuickStatsOverview,
  OnboardingPipeline,
  RecentApprovals,
  AlertsPanel,
  StudentOverview,
  StudentInsights,
  TrainerOverview,
  TrainerInsights,
  CourseOverview,
  CourseInsights,

  // Student
  StudentCoursesWidget,
  StudentHoursWidget,
  StudentPerformanceWidget,
  StudentLeaderboardWidget,

  // Trainer
  TrainerStatsOverviewWidget,
  TrainerActivityWidget,
  TrainerKeyMetricsWidget,
  TrainerTodayScheduleWidget,
  TrainerBatchPerformanceWidget,
  TrainerQuickActionBar,

  // Sections (Macro Widgets)
  StudentDashboardOverview,
  StudentCoursesSection,
  StudentScheduleSection,
  StudentProgressSection,
  
  TrainerDashboardOverview,
  TrainerScheduleSection,
  TrainerBatchesSection,
  TrainerStudentsSection
};

export const getWidgetComponent = (componentId: string) => {
  return WIDGET_REGISTRY[componentId] || null;
};
