import { useAuth } from '@/app/context/AuthContext';
import { Badge, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AdminProfileCard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4ECDC4]/10 to-transparent rounded-full -mr-16 -mt-16" />
      
      <div className="relative">
        {/* Header with expand icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white text-xl font-bold shadow-md">
              {user ? getInitials(user.name) : 'AD'}
            </div>
            
            {/* User info */}
            <div>
              <h3 className="text-lg font-bold text-[#1A1D1F]">
                {user?.name || 'Admin User'}
              </h3>
              <p className="text-sm text-[#6E7191] flex items-center gap-1">
                <Badge className="w-3.5 h-3.5" />
                System Administrator
              </p>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4 text-[#6E7191]" />
          </button>
        </div>

        {/* Admin ID */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-xs text-[#6E7191] mb-1">Admin ID</p>
          <p className="text-sm font-semibold text-[#1A1D1F]">ADM-2026-001</p>
        </div>

        {/* Current Session Time */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-[#6E7191]">
              <Clock className="w-4 h-4" />
              <span>{getGreeting()}</span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md">
              ACTIVE
            </span>
          </div>
          
          {/* Live Clock */}
          <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#1A1D1F] font-mono tracking-tight">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-[#6E7191] mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Today's Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-xs text-blue-900 font-medium">Approvals</span>
            </div>
            <p className="text-xl font-bold text-blue-900">8</p>
            <p className="text-xs text-blue-700">Today</p>
          </div>

          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <span className="text-xs text-orange-900 font-medium">Pending</span>
            </div>
            <p className="text-xl font-bold text-orange-900">12</p>
            <p className="text-xs text-orange-700">Awaiting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
