import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Menu, X, ChevronDown } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { ProfileWidget } from '../components/ProfileWidget';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, UserProfile } from '../services/ProfileService/ProfileService';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUserProfile(data);
      } catch (e) {
        console.error("Failed to fetch profile for header", e);
      }
    };
    fetchProfile();
  }, []);

  const isAdminDashboard = location.pathname.includes('/admin');
  
  // Only show ProfileWidget on overview/dashboard pages
  const shouldShowProfileWidget = location.pathname === '/dashboard' || location.pathname === '/admin/dashboard';
  const displayName = userProfile?.name || authUser?.name || authUser?.email?.split('@')[0] || 'User';

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar activeItem="overview" isCollapsed={sidebarCollapsed} />
      </div>

      {/* Sidebar - Mobile/Tablet */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar activeItem="overview" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className={`mx-auto p-6 lg:p-8 ${shouldShowProfileWidget ? 'max-w-7xl' : 'max-w-full'}`}>
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="ml-12 lg:ml-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-[#1A1D1F] mb-1">
                  Hello {displayName} 👋
                </h1>
                <p className="text-sm text-[#6E7191]">
                  {isAdminDashboard 
                    ? 'Manage your learning platform' 
                    : "Let's learn something new today!"}
                </p>
              </div>
              
              {/* Dashboard Switcher moved to Sidebar */}
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 md:flex-initial">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E7191]" />
                <input
                  type="text"
                  placeholder="Search from courses..."
                  className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-white border border-[#E0E0E2] rounded-xl text-sm focus:outline-none focus:border-[#4ECDC4]"
                />
              </div>

              {/* Notification */}
              <button className="p-2.5 hover:bg-white rounded-xl transition-colors">
                <Bell size={20} className="text-[#6E7191]" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          {children}
        </div>
      </main>

      {/* Right Profile Panel - Desktop */}
      {shouldShowProfileWidget && (
        <div className="hidden xl:block">
          <ProfileWidget />
        </div>
      )}

      {/* Right Profile Panel - Mobile/Tablet Overlay */}
      {showProfile && (
        <div className="xl:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setShowProfile(false)}>
          <div className="ml-auto h-full" onClick={(e) => e.stopPropagation()}>
            <ProfileWidget />
          </div>
        </div>
      )}
    </div>
  );
}
