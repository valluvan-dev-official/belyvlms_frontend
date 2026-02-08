import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Check, Briefcase, GraduationCap, Shield, User } from 'lucide-react';

export const RoleSwitcher = () => {
  const { availableRoles, activeRole, switchRole, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Role Configuration Mapping
  const getRoleConfig = (roleCode?: string) => {
    const code = (roleCode || '').toUpperCase();
    switch (code) {
      case 'ADMIN':
      case 'ADM':
      case 'SAM':
      case 'SUPER_ADMIN':
        return { icon: <Shield size={16} />, color: 'text-blue-900', bg: 'bg-blue-100', border: 'border-blue-200', label: 'Admin' };
      case 'TRAINER':
      case 'INSTRUCTOR':
      case 'TRN':
        return { icon: <Briefcase size={16} />, color: 'text-teal-600', bg: 'bg-teal-100', border: 'border-teal-200', label: 'Trainer' };
      case 'STUDENT':
      case 'BTR':
      case 'STD':
        return { icon: <GraduationCap size={16} />, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200', label: 'Student' };
      default:
        // Generic fallback for any other role code - Show the Code as Label instead of "Guest"
    return { 
      icon: <User size={16} />, 
      color: 'text-gray-600', 
      bg: 'bg-gray-100', 
      border: 'border-gray-200', 
      label: roleCode || 'Guest' 
    };
  }
};

// Use Code Only for display as requested
const activeLabel = activeRole?.code || 'GUEST';
const activeConfig = activeRole ? getRoleConfig(activeRole.code) : getRoleConfig('GUEST');

// If user has only one role, show static display
if (availableRoles.length <= 1) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${activeConfig.bg} ${activeConfig.border}`}>
      <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center ${activeConfig.color}`}>
        {activeConfig.icon}
      </div>
      <span className={`text-sm font-semibold ${activeConfig.color}`}>
        {activeLabel}
      </span>
    </div>
  );
}

const handleRoleSelect = async (roleCode: string) => {
  if (roleCode === activeRole?.code) return;
  
  try {
    setIsOpen(false);
    await switchRole(roleCode);
  } catch (error) {
    alert("Failed to switch role");
  }
};

return (
  <div className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${isOpen ? 'ring-2 ring-gray-200' : ''}`}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeConfig.bg} ${activeConfig.color}`}>
        {activeConfig.icon}
      </div>
      <div className="flex flex-col items-start mr-2">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Viewing as</span>
        <span className={`text-sm font-bold leading-none ${activeConfig.color}`}>
          {activeLabel}
        </span>
      </div>
      <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>

    {isOpen && (
      <>
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        />
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Switch Context</p>
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {availableRoles.map((role) => {
              const config = getRoleConfig(role.code);
              const isActive = activeRole?.code === role.code;
              
              // Use role.name for the list item to be descriptive (e.g., "Student")
              // But keep role.code for the badge/subtitle if needed
              
              return (
                <button
                  key={role.code}
                  onClick={() => handleRoleSelect(role.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className={`text-sm font-semibold truncate ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                      {role.name || role.code}
                    </span>
                    <span className="text-xs text-gray-400">
                      {role.code}
                    </span>
                  </div>
                  {isActive && <Check size={16} className="text-green-500" />}
                </button>
              );
            })}
          </div>
        </div>
      </>
    )}
  </div>
);
};
