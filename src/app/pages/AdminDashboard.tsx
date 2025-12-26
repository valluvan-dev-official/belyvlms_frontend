import { AdminStatsCards } from '../components/AdminStatsCards';
import { CourseAnalytics } from '../components/CourseAnalytics';
import { RecentActivity } from '../components/RecentActivity';
import { UserManagementTable } from '../components/UserManagementTable';
import { HoursSpentChart } from '../components/HoursSpentChart';
import { PerformanceChart } from '../components/PerformanceChart';
import { SystemOverview } from '../components/SystemOverview';

export function AdminDashboard() {
  return (
    <>
      {/* Admin Stats Cards */}
      <AdminStatsCards />

      {/* Course Analytics and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <CourseAnalytics />
        <RecentActivity />
      </div>

      {/* User Management Table */}
      <div className="mb-8">
        <UserManagementTable />
      </div>

      {/* Admin Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <HoursSpentChart />
        <PerformanceChart />
      </div>

      {/* System Overview */}
      <div className="mb-8">
        <SystemOverview />
      </div>
    </>
  );
}
