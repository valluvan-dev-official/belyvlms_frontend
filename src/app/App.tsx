import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { BatchProvider } from './context/BatchContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PERMISSIONS } from './config/permissions';

// Lazy Load Pages
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardLayout = lazy(() => import('./layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const UnifiedDashboard = lazy(() => import('./pages/UnifiedDashboard').then(m => ({ default: m.UnifiedDashboard })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const AddUserPage = lazy(() => import('./pages/AddUserPage').then(m => ({ default: m.AddUserPage })));
const StudentsPage = lazy(() => import('./pages/StudentsPage').then(m => ({ default: m.StudentsPage })));
const TrainersPage = lazy(() => import('./pages/TrainersPage').then(m => ({ default: m.TrainersPage })));
const BatchManagementPage = lazy(() => import('./pages/BatchManagementPage').then(m => ({ default: m.BatchManagementPage })));
const BatchMonitoringDashboardPage = lazy(() => import('./pages/BatchMonitoringDashboardPage').then(m => ({ default: m.BatchMonitoringDashboardPage })));
const BatchListPage = lazy(() => import('./pages/BatchListPage').then(m => ({ default: m.BatchListPage })));
const BatchCreationWizardPage = lazy(() => import('./pages/BatchCreationWizardPage').then(m => ({ default: m.BatchCreationWizardPage })));
const AccessControlPage = lazy(() => import('./pages/AccessControlPage').then(m => ({ default: m.AccessControlPage })));
const AccessDeniedPage = lazy(() => import('./pages/AccessDeniedPage').then(m => ({ default: m.AccessDeniedPage })));
const RoleDeactivationPage = lazy(() => import('./pages/RoleDeactivationPage').then(m => ({ default: m.RoleDeactivationPage })));
const UserRoleAssignmentPage = lazy(() => import('./pages/UserRoleAssignmentPage').then(m => ({ default: m.UserRoleAssignmentPage })));
const ResetPasswordRequired = lazy(() => import('./pages/ResetPasswordRequired').then(m => ({ default: m.ResetPasswordRequired })));
const ProfileConfigManager = lazy(() => import('./pages/ProfileConfigManager').then(m => ({ default: m.ProfileConfigManager })));
const ProfileFieldManager = lazy(() => import('./pages/ProfileFieldManager').then(m => ({ default: m.ProfileFieldManager })));
const MyCoursesPage = lazy(() => import('./pages/MyCoursesPage').then(m => ({ default: m.MyCoursesPage })));
const NewStudentDashboard = lazy(() => import('./pages/NewStudentDashboard').then(m => ({ default: m.NewStudentDashboard })));
const CourseWorkspace = lazy(() => import('./components/student-learning/CourseWorkspace').then(m => ({ default: m.CourseWorkspace })));
const SessionDetail = lazy(() => import('./components/student-learning/SessionDetail').then(m => ({ default: m.SessionDetail })));
const RecordingPlayer = lazy(() => import('./components/student-learning/RecordingPlayer').then(m => ({ default: m.RecordingPlayer })));
const StudentSchedulePage = lazy(() => import('./pages/StudentSchedulePage').then(m => ({ default: m.StudentSchedulePage })));
const StudentProgressPage = lazy(() => import('./pages/StudentProgressPage').then(m => ({ default: m.StudentProgressPage })));
const OnboardRequestsPage = lazy(() => import('./onboardRequests/pages/OnboardRequestsPage').then(m => ({ default: m.OnboardRequestsPage })));
const OnboardRequestDetailPage = lazy(() => import('./onboardRequests/pages/OnboardRequestDetailPage').then(m => ({ default: m.OnboardRequestDetailPage })));
const PublicRegisterPage = lazy(() => import('./onboardRequests/pages/PublicRegisterPage').then(m => ({ default: m.PublicRegisterPage })));
const AuditLogPage = lazy(() => import('./pages/AuditLogPage').then(m => ({ default: m.AuditLogPage })));
const AuditDashboard = lazy(() => import('./audit-logs/pages/AuditDashboard').then(m => ({ default: m.AuditDashboard })));
const AuditInvestigationGrid = lazy(() => import('./audit-logs/pages/AuditInvestigationGrid').then(m => ({ default: m.AuditInvestigationGrid })));
const AuditTimelineView = lazy(() => import('./audit-logs/pages/AuditTimelineView').then(m => ({ default: m.AuditTimelineView })));
const RBACTraceabilityPage = lazy(() => import('./audit-logs/pages/RBACTraceabilityPage').then(m => ({ default: m.RBACTraceabilityPage })));
const SuspiciousActivityPage = lazy(() => import('./audit-logs/pages/SuspiciousActivityPage').then(m => ({ default: m.SuspiciousActivityPage })));
const SystemLogView = lazy(() => import('./audit-logs/pages/SystemLogView').then(m => ({ default: m.SystemLogView })));
const CourseDashboard = lazy(() => import('./features/course-management/pages/CourseDashboard').then(m => ({ default: m.CourseDashboard })));
const CategoryManagement = lazy(() => import('./features/course-management/pages/CategoryManagement').then(m => ({ default: m.CategoryManagement })));
const CourseCreation = lazy(() => import('./features/course-management/pages/CourseCreation').then(m => ({ default: m.CourseCreation })));
const CourseUpdate = lazy(() => import('./features/course-management/pages/CourseUpdate').then(m => ({ default: m.CourseUpdate })));
const CourseStructurePreview = lazy(() => import('./features/course-management/pages/CourseStructurePreview').then(m => ({ default: m.CourseStructurePreview })));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#4ECDC4] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#6E7191]">Loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BatchProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Route - Login */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordRequired />} />
            <Route path="/public/register" element={<PublicRegisterPage />} />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<RoleHomeRedirect />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardGate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/users"
              element={
                <ProtectedRoute permission={PERMISSIONS.USER_VIEW}>
                  <DashboardLayout>
                    <UserManagementPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/onboard-requests"
              element={
                <ProtectedRoute permission={PERMISSIONS.USER_VIEW}>
                  <DashboardLayout>
                    <OnboardRequestsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/onboard-requests/:code"
              element={
                <ProtectedRoute permission={PERMISSIONS.USER_VIEW}>
                  <DashboardLayout>
                    <OnboardRequestDetailPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/add-user"
              element={
                <ProtectedRoute permission={PERMISSIONS.USER_MANAGEMENT_CREATE}>
                  <DashboardLayout>
                    <AddUserPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/students"
              element={
                <ProtectedRoute permission={PERMISSIONS.STUDENT_MANAGEMENT_VIEW}>
                  <DashboardLayout>
                    <StudentsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/trainers"
              element={
                <ProtectedRoute permission={PERMISSIONS.TRAINER_VIEW}>
                  <DashboardLayout>
                    <TrainersPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/access-control"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AccessControlPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/profile-configs"
              element={
                <ProtectedRoute permission={PERMISSIONS.ACCESS_CONTROL_VIEW}>
                  <DashboardLayout>
                    <ProfileConfigManager />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/profile-fields"
              element={
                <ProtectedRoute permission={PERMISSIONS.ACCESS_CONTROL_VIEW}>
                  <DashboardLayout>
                    <ProfileFieldManager />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/batches"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BatchListPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches/manage"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BatchManagementPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches/monitoring"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BatchMonitoringDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BatchListPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches/create"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BatchCreationWizardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CourseDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/create"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CourseCreation />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/:id/update"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CourseUpdate />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/:id/structure-preview"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CourseStructurePreview />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/categories"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CategoryManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/access-control/deactivate/:roleId"
              element={
                <ProtectedRoute permission={PERMISSIONS.ROLE_DELETE}>
                  <DashboardLayout>
                    <RoleDeactivationPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/assign-role"
              element={
                <ProtectedRoute permission={PERMISSIONS.USER_MANAGEMENT_ASSIGN_ROLE}>
                  <DashboardLayout>
                    <UserRoleAssignmentPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/audit-logs"
              element={
                <ProtectedRoute permission={PERMISSIONS.AUDIT_LOG_VIEW}>
                  <DashboardLayout>
                    <AuditLogPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit"
              element={
                <ProtectedRoute permission={PERMISSIONS.AUDIT_LOG_VIEW}>
                  <DashboardLayout>
                    <AuditDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit/investigation"
              element={
                <ProtectedRoute permission={PERMISSIONS.AUDIT_LOG_VIEW}>
                  <DashboardLayout>
                    <AuditInvestigationGrid />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit/timeline"
              element={
                <ProtectedRoute permission={PERMISSIONS.AUDIT_LOG_VIEW}>
                  <DashboardLayout>
                    <AuditTimelineView />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit/rbac-trace"
              element={
                <ProtectedRoute permission={PERMISSIONS.AUDIT_LOG_VIEW}>
                  <DashboardLayout>
                    <RBACTraceabilityPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit/suspicious"
              element={
                <ProtectedRoute permission={PERMISSIONS.AUDIT_LOG_VIEW}>
                  <DashboardLayout>
                    <SuspiciousActivityPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit/system"
              element={
                <ProtectedRoute permission={PERMISSIONS.AUDIT_LOG_VIEW}>
                  <DashboardLayout>
                    <SystemLogView />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-courses"
              element={
                <ProtectedRoute>
                  <StudentGate>
                    <DashboardLayout>
                      <MyCoursesPage />
                    </DashboardLayout>
                  </StudentGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/schedule"
              element={
                <ProtectedRoute>
                  <StudentGate>
                    <DashboardLayout>
                      <StudentSchedulePage />
                    </DashboardLayout>
                  </StudentGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/progress"
              element={
                <ProtectedRoute>
                  <StudentGate>
                    <DashboardLayout>
                      <StudentProgressPage />
                    </DashboardLayout>
                  </StudentGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning/course/:courseId"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CourseWorkspace />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/details"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CourseStructurePreview />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning/course/:courseId/sessions/:sessionId"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SessionDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning/course/:courseId/sessions/:sessionId/recording"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <RecordingPlayer />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<RoleHomeRedirect />} />

            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <StudentGate>
                    <DashboardLayout>
                      <NewStudentDashboard />
                    </DashboardLayout>
                  </StudentGate>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
        <Toaster />
        </BatchProvider>
      </AuthProvider>
    </Router>
  );
}

function RoleHomeRedirect() {
  const { activeRole } = useAuth();
  const code = activeRole?.code?.toLowerCase();
  const to = code === 'btr' || code === 'student' ? '/student' : '/dashboard';
  return <Navigate to={to} replace />;
}

function DashboardGate() {
  const { activeRole } = useAuth();
  const code = activeRole?.code?.toLowerCase();
  if (code === 'btr' || code === 'student') {
    return <Navigate to="/student" replace />;
  }
  return (
    <DashboardLayout>
      <UnifiedDashboard />
    </DashboardLayout>
  );
}

function StudentGate({ children }: { children: any }) {
  const { activeRole } = useAuth();
  const code = activeRole?.code?.toLowerCase();
  if (code === 'btr' || code === 'student') {
    return children;
  }
  return <Navigate to="/dashboard" replace />;
}
