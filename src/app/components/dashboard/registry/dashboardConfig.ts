import { PERMISSIONS } from '../../../config/permissions';

export interface WidgetConfig {
  id: string;
  title: string;
  componentId: string;
  role: string[];
  permissions?: string[];
  gridConfig: {
    w: number; // width in columns (using 12-grid system)
    h: number; // height (optional)
    minW?: number;
    minH?: number;
  };
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string; // Icon name as string
  layoutId: string; // Link to a specific layout of widgets
  permissions?: string[];
}

export interface DashboardLayoutConfig {
  role: string;
  tabs: TabConfig[];
  headerWidgets?: WidgetConfig[]; // Widgets always visible above tabs
  footerWidgets?: WidgetConfig[]; // Widgets always visible below content
  layouts: Record<string, WidgetConfig[]>;
}

// Admin Dashboard Configuration
export const adminDashboardConfig: DashboardLayoutConfig = {
  role: 'admin',
  headerWidgets: [
    { id: 'motivational-quote', title: 'Quote', componentId: 'MotivationalQuote', role: ['admin'], gridConfig: { w: 12, h: 1 } }
  ],
  tabs: [
    { id: 'overview', label: 'Overview', icon: 'BarChart3', layoutId: 'admin-overview', permissions: [PERMISSIONS.DASHBOARD_VIEW_GLOBAL] },
    { id: 'students', label: 'Students', icon: 'Users', layoutId: 'admin-students', permissions: [PERMISSIONS.STUDENT_MANAGEMENT_VIEW] },
    { id: 'trainers', label: 'Trainers', icon: 'GraduationCap', layoutId: 'admin-trainers', permissions: [PERMISSIONS.TRAINER_VIEW] },
    { id: 'courses', label: 'Courses', icon: 'BookOpen', layoutId: 'admin-courses', permissions: [PERMISSIONS.DASHBOARD_VIEW_GLOBAL] }, // Fallback to global view
    { id: 'onboarding', label: 'Onboarding', icon: 'UserCheck', layoutId: 'admin-onboarding', permissions: [PERMISSIONS.USER_VIEW] }
  ],
  layouts: {
    'admin-overview': [
      { id: 'admin-stats-overview', title: 'Key Stats', componentId: 'StatsOverviewWidget', role: ['admin'], permissions: [PERMISSIONS.DASHBOARD_WIDGET_STATS_VIEW], gridConfig: { w: 12, h: 1 } },
      { id: 'admin-growth-trend', title: 'Growth Trend', componentId: 'GrowthTrendWidget', role: ['admin'], permissions: [PERMISSIONS.DASHBOARD_VIEW_GLOBAL], gridConfig: { w: 8, h: 2 } },
      { id: 'admin-key-metrics', title: 'Key Metrics', componentId: 'KeyMetricsWidget', role: ['admin'], gridConfig: { w: 4, h: 2 } },
      { id: 'admin-user-distribution', title: 'User Distribution', componentId: 'UserDistributionWidget', role: ['admin'], gridConfig: { w: 6, h: 2 } },
      { id: 'admin-today-schedule', title: "Today's Schedule", componentId: 'TodayScheduleWidget', role: ['admin'], gridConfig: { w: 6, h: 2 } }
    ],
    'admin-students': [
      { id: 'student-overview', title: 'Student Overview', componentId: 'StudentOverview', role: ['admin'], gridConfig: { w: 12, h: 1 } },
      { id: 'student-insights', title: 'Student Insights', componentId: 'StudentInsights', role: ['admin'], gridConfig: { w: 12, h: 1 } }
    ],
    'admin-trainers': [
      { id: 'trainer-overview', title: 'Trainer Overview', componentId: 'TrainerOverview', role: ['admin'], gridConfig: { w: 12, h: 1 } },
      { id: 'trainer-insights', title: 'Trainer Insights', componentId: 'TrainerInsights', role: ['admin'], gridConfig: { w: 12, h: 1 } }
    ],
    'admin-courses': [
      { id: 'course-overview', title: 'Course Overview', componentId: 'CourseOverview', role: ['admin'], gridConfig: { w: 12, h: 1 } },
      { id: 'course-insights', title: 'Course Insights', componentId: 'CourseInsights', role: ['admin'], gridConfig: { w: 12, h: 1 } }
    ],
    'admin-onboarding': [
      { id: 'quick-stats', title: 'Quick Stats', componentId: 'QuickStatsOverview', role: ['admin'], gridConfig: { w: 12, h: 1 } },
      { id: 'onboarding-pipeline', title: 'Pipeline', componentId: 'OnboardingPipeline', role: ['admin'], gridConfig: { w: 8, h: 2 } },
      { id: 'recent-approvals', title: 'Approvals', componentId: 'RecentApprovals', role: ['admin'], gridConfig: { w: 4, h: 2 } },
      { id: 'alerts-panel', title: 'Alerts', componentId: 'AlertsPanel', role: ['admin'], gridConfig: { w: 4, h: 2 } }
    ]
  }
};

// Student Dashboard Configuration
export const studentDashboardConfig: DashboardLayoutConfig = {
  role: 'student',
  tabs: [
    { id: 'overview', label: 'Overview', icon: 'BarChart3', layoutId: 'student-overview' },
    { id: 'courses', label: 'My Courses', icon: 'BookOpen', layoutId: 'student-courses' },
    { id: 'schedule', label: 'Schedule', icon: 'Calendar', layoutId: 'student-schedule' },
    { id: 'progress', label: 'Progress', icon: 'TrendingUp', layoutId: 'student-progress' }
  ],
  layouts: {
    'student-overview': [
      { id: 'student-overview-section', title: 'Overview', componentId: 'StudentDashboardOverview', role: ['student'], gridConfig: { w: 12, h: 1 } }
    ],
    'student-courses': [
      { id: 'student-courses-section', title: 'My Courses', componentId: 'StudentCoursesSection', role: ['student'], gridConfig: { w: 12, h: 1 } }
    ],
    'student-schedule': [
      { id: 'student-schedule-section', title: 'Schedule', componentId: 'StudentScheduleSection', role: ['student'], gridConfig: { w: 12, h: 1 } }
    ],
    'student-progress': [
      { id: 'student-progress-section', title: 'Progress', componentId: 'StudentProgressSection', role: ['student'], gridConfig: { w: 12, h: 1 } }
    ]
  }
};

// Trainer Dashboard Configuration
export const trainerDashboardConfig: DashboardLayoutConfig = {
  role: 'trainer',
  headerWidgets: [
    { id: 'motivational-quote', title: 'Quote', componentId: 'MotivationalQuote', role: ['trainer'], gridConfig: { w: 12, h: 1 } }
  ],
  footerWidgets: [
    { id: 'trainer-quick-actions', title: 'Quick Actions', componentId: 'TrainerQuickActionBar', role: ['trainer'], gridConfig: { w: 12, h: 1 } }
  ],
  tabs: [
    { id: 'overview', label: 'Overview', icon: 'BarChart3', layoutId: 'trainer-overview' },
    { id: 'schedule', label: 'Schedule', icon: 'Calendar', layoutId: 'trainer-schedule' },
    { id: 'batches', label: 'My Batches', icon: 'Layers', layoutId: 'trainer-batches' },
    { id: 'students', label: 'Students', icon: 'Users', layoutId: 'trainer-students' }
  ],
  layouts: {
    'trainer-overview': [
      { id: 'trainer-stats-overview', title: 'Key Stats', componentId: 'TrainerStatsOverviewWidget', role: ['trainer'], permissions: [PERMISSIONS.DASHBOARD_WIDGET_STATS_VIEW], gridConfig: { w: 12, h: 1 } },
      { id: 'trainer-activity', title: 'Activity', componentId: 'TrainerActivityWidget', role: ['trainer'], permissions: [PERMISSIONS.DASHBOARD_WIDGET_ACTIVITY_VIEW], gridConfig: { w: 8, h: 2 } },
      { id: 'trainer-key-metrics', title: 'Key Metrics', componentId: 'TrainerKeyMetricsWidget', role: ['trainer'], gridConfig: { w: 4, h: 2 } },
      { id: 'trainer-today-schedule', title: "Today's Schedule", componentId: 'TrainerTodayScheduleWidget', role: ['trainer'], gridConfig: { w: 6, h: 2 } },
      { id: 'trainer-batch-performance', title: 'Batch Performance', componentId: 'TrainerBatchPerformanceWidget', role: ['trainer'], gridConfig: { w: 6, h: 2 } }
    ],
    'trainer-schedule': [
      { id: 'trainer-schedule-section', title: 'Schedule', componentId: 'TrainerScheduleSection', role: ['trainer'], gridConfig: { w: 12, h: 1 } }
    ],
    'trainer-batches': [
      { id: 'trainer-batches-section', title: 'My Batches', componentId: 'TrainerBatchesSection', role: ['trainer'], gridConfig: { w: 12, h: 1 } }
    ],
    'trainer-students': [
      { id: 'trainer-students-section', title: 'Students', componentId: 'TrainerStudentsSection', role: ['trainer'], gridConfig: { w: 12, h: 1 } }
    ]
  }
};

export const getDashboardConfig = (role: string): DashboardLayoutConfig => {
  switch (role) {
    case 'student':
      return studentDashboardConfig;
    case 'trainer':
    case 'instructor':
    case 'trn':
      return trainerDashboardConfig;
    case 'admin':
    default:
      return adminDashboardConfig;
  }
};
