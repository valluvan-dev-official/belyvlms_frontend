import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy Load Pages
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardLayout = lazy(() => import('./layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const AddUserPage = lazy(() => import('./pages/AddUserPage').then(m => ({ default: m.AddUserPage })));
const StudentsPage = lazy(() => import('./pages/StudentsPage').then(m => ({ default: m.StudentsPage })));
const TrainersPage = lazy(() => import('./pages/TrainersPage').then(m => ({ default: m.TrainersPage })));
const AccessControlPage = lazy(() => import('./pages/AccessControlPage').then(m => ({ default: m.AccessControlPage })));
const RoleDeactivationPage = lazy(() => import('./pages/RoleDeactivationPage').then(m => ({ default: m.RoleDeactivationPage })));
const UserRoleAssignmentPage = lazy(() => import('./pages/UserRoleAssignmentPage').then(m => ({ default: m.UserRoleAssignmentPage })));
const ResetPasswordRequired = lazy(() => import('./pages/ResetPasswordRequired').then(m => ({ default: m.ResetPasswordRequired })));
const ProfileConfigManager = lazy(() => import('./pages/ProfileConfigManager').then(m => ({ default: m.ProfileConfigManager })));
const ProfileFieldManager = lazy(() => import('./pages/ProfileFieldManager').then(m => ({ default: m.ProfileFieldManager })));
const OnboardRequestsPage = lazy(() => import('./onboardRequests/pages/OnboardRequestsPage').then(m => ({ default: m.OnboardRequestsPage })));
const OnboardRequestDetailPage = lazy(() => import('./onboardRequests/pages/OnboardRequestDetailPage').then(m => ({ default: m.OnboardRequestDetailPage })));
const PublicRegisterPage = lazy(() => import('./onboardRequests/pages/PublicRegisterPage').then(m => ({ default: m.PublicRegisterPage })));

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
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/users"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <UserManagementPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/onboard-requests"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <OnboardRequestsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/onboard-requests/:code"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <OnboardRequestDetailPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/add-user"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AddUserPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/management/students"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <StudentsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/trainers"
              element={
                <ProtectedRoute>
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
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfileConfigManager />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/profile-fields"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfileFieldManager />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/access-control/deactivate/:roleId"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <RoleDeactivationPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/management/assign-role"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <UserRoleAssignmentPage />
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
