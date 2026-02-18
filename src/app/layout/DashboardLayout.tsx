import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { RightSidebar } from '../components/admin-dashboard/RightSidebar';
import { RoleSwitcher } from '../components/RoleSwitcher';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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
        <Sidebar
          activeItem="overview"
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Sidebar - Mobile/Tablet */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-transparent" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar activeItem="overview" onNavItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto p-4 lg:p-8 max-w-full">
          {/* Header */}
          <header className="flex items-center justify-end gap-4 mb-8">
            <RoleSwitcher />

            {/* Notification */}
            <button className="p-2.5 hover:bg-white rounded-xl transition-colors">
              <Bell size={20} className="text-[#6E7191]" />
            </button>

            {/* Profile Toggle */}
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="ml-2 rounded-full transition-transform active:scale-95"
            >
              <div className="w-10 h-10 rounded-full bg-[#3A9E95] flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
            </button>
          </header>

          {/* Page Content */}
          {children}
        </div>
      </main>

      {/* Right Profile Panel - Desktop */}
      <div className="hidden xl:block">
        <RightSidebar isOpen={showProfile} onClose={() => setShowProfile(false)} />
      </div>

      {/* Right Profile Panel - Mobile/Tablet Overlay */}
      <div
        className={`xl:hidden fixed inset-0 z-40 bg-transparent transition-opacity duration-300 ${showProfile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowProfile(false)}
      >
        <div
          className={`ml-auto h-full w-80 transform transition-transform duration-300 ${showProfile ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <RightSidebar isOpen={true} onClose={() => setShowProfile(false)} />
        </div>
      </div>
    </div>
  );
}
