import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NoAccessProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export const NoAccess: React.FC<NoAccessProps> = ({ 
  title = "Access Restricted", 
  message = "You don't have permission to view this page. Please contact your administrator if you believe this is a mistake.",
  showBackButton = true
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-[#E0E0E2] p-8 text-center">
        <div className="w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldAlert size={32} className="text-[#FF3B3B]" />
        </div>
        
        <h1 className="text-2xl font-bold text-[#1A1D1F] mb-3">
          {title}
        </h1>
        
        <p className="text-[#6E7191] mb-8 leading-relaxed">
          {message}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-[#4ECDC4] text-white font-medium rounded-xl hover:bg-[#44A08D] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go to Dashboard
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-white text-[#FF3B3B] font-medium rounded-xl border border-[#FF3B3B]/20 hover:bg-[#FFF5F5] transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
