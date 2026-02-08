import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
const AccessControlPage = lazy(() => import('./pages/AccessControlPage').then(m => ({ default: m.AccessControlPage })));
const AccessDeniedPage = lazy(() => import('./pages/AccessDeniedPage').then(m => ({ default: m.AccessDeniedPage })));
const RoleDeactivationPage = lazy(() => import('./pages/RoleDeactivationPage').then(m => ({ default: m.RoleDeactivationPage })));
const UserRoleAssignmentPage = lazy(() => import('./pages/UserRoleAssignmentPage').then(m => ({ default: m.UserRoleAssignmentPage })));
const ResetPasswordRequired = lazy(() => import('./pages/ResetPasswordRequired').then(m => ({ default: m.ResetPasswordRequired })));
const ProfileConfigManager = lazy(() => import('./pages/ProfileConfigManager').then(m => ({ default: m.ProfileConfigManager })));
const ProfileFieldManager = lazy(() => import('./pages/ProfileFieldManager').then(m => ({ default: m.ProfileFieldManager })));
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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Route - Login */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordRequired />} />
            <Route path="/public/register" element={<PublicRegisterPage />} />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <UnifiedDashboard />
                  </DashboardLayout>
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
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
