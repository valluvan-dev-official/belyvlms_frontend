import { CircleCheck, ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from './ui/checkbox';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getMyProfile, UserProfile } from '../services/ProfileService/ProfileService';

export function ProfileWidget() {
  const { logout, user: authUser } = useAuth();
  const navigate = useNavigate();
  const progress = 0.75; // 75% progress
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (progress * circumference);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  const displayName =
    profile?.name ||
    authUser?.name ||
    authUser?.email?.split('@')[0] ||
    'User';

  const displayRole =
    profile?.role || 'Member';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const calendarDays = [
    { day: 'M', date: '', active: false },
    { day: 'T', date: '', active: false },
    { day: 'W', date: '', active: false },
    { day: 'T', date: '', active: false },
    { day: 'F', date: '', active: false },
    { day: 'S', date: '', active: false },
    { day: 'S', date: '', active: false },
    { day: '', date: '26', active: false },
    { day: '', date: '27', active: true },
    { day: '', date: '28', active: false },
    { day: '', date: '29', active: false },
    { day: '', date: '30', active: false },
    { day: '', date: '', active: false },
    { day: '', date: '', active: false },
  ];

  const todos = [
    { id: 1, text: 'Developing Restaurant Apps', category: 'Programming', time: '08:00 AM', checked: false },
    { id: 2, text: 'Integrate API', category: '', time: '', checked: false },
    { id: 3, text: 'Slicing Home Screen', category: '', time: '', checked: false },
    { id: 4, text: 'Research Objective User', category: 'Product Design', time: '09:40 PM', checked: false },
    { id: 5, text: 'Report Analysis P2P Business', category: 'Business', time: '04:30 PM', checked: true },
  ];

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-80 bg-white h-screen p-6 flex flex-col gap-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        {/* Profile Button */}
        <Link 
          to="/profile"
          className="inline-flex items-center gap-2 px-6 py-2.5 mb-4 bg-white border border-[#E0E0E2] rounded-xl hover:border-[#4ECDC4] hover:bg-[#F7F7F8] transition-all"
        >
          <User size={18} className="text-[#6E7191]" />
          <span className="text-sm font-medium text-[#1A1D1F]">Profile</span>
        </Link>

        <div className="relative mb-4">
          {/* Progress ring */}
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="#F5F5F7"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="#4ECDC4"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Profile image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] overflow-hidden flex items-center justify-center">
               {profile?.profile_picture ? (
                  <img 
                    src={profile.profile_picture} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-semibold">{getInitials(displayName)}</span>
                )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <h3 className="font-semibold text-[#1A1D1F]">{displayName}</h3>
            <CircleCheck size={16} className="text-[#4ECDC4]" fill="#4ECDC4" />
          </div>
          <p className="text-sm text-[#6E7191]">{displayRole}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-[#FAFAFA] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button>
            <ChevronLeft size={20} className="text-[#6E7191]" />
          </button>
          <h4 className="font-semibold text-[#1A1D1F]">December 2021</h4>
          <button>
            <ChevronRight size={20} className="text-[#6E7191]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg
                ${day.active 
                  ? 'bg-[#1A1D1F] text-white font-medium' 
                  : day.day 
                    ? 'text-[#6E7191] font-medium'
                    : 'text-[#6E7191]'
                }
              `}
            >
              {day.day || day.date}
            </div>
          ))}
        </div>
      </div>

      {/* To Do List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h4 className="font-semibold text-[#1A1D1F] mb-4">To Do List</h4>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-start gap-3">
              <Checkbox 
                checked={todo.checked}
                className="mt-1 rounded border-2 border-[#E0E0E2] data-[state=checked]:bg-[#4ECDC4] data-[state=checked]:border-[#4ECDC4]"
              />
              <div className="flex-1">
                <p className={`text-sm ${todo.checked ? 'line-through text-[#A0A3BD]' : 'text-[#1A1D1F]'}`}>
                  {todo.text}
                </p>
                {todo.category && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#6E7191]">{todo.category}</span>
                    {todo.time && (
                      <>
                        <span className="text-xs text-[#6E7191]">•</span>
                        <span className="text-xs text-[#FF9066]">{todo.time}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-[#E0E0E2] rounded-xl hover:border-[#4ECDC4] hover:bg-[#F7F7F8] transition-all"
      >
        <LogOut size={18} className="text-[#6E7191]" />
        <span className="text-sm font-medium text-[#1A1D1F]">Logout</span>
      </button>
    </div>
  );
}
