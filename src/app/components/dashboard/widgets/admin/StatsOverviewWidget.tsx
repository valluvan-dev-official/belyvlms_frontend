import { useEffect, useState } from 'react';
import { Users, BookOpen, Calendar, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Skeleton } from '../../../ui/skeleton';
import { DashboardService, HeroStat } from '../../../../services/DashboardService/DashboardService';

interface StatsOverviewWidgetProps {
  isLoading?: boolean;
}

export default function StatsOverviewWidget({ isLoading: initialLoading = false }: StatsOverviewWidgetProps) {
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await DashboardService.getStats();
        // Fallback to default stats if API returns empty array (to prevent empty dashboard)
        if (Array.isArray(data) && data.length > 0) {
          setStats(data);
        } else {
          setStats([
            { key: 'total-users', label: 'Total Users', value: '0', subtext: 'No data available', icon: 'Users', change: '0%', changeType: 'neutral' },
            { key: 'active-students', label: 'Active Students', value: '0', subtext: 'No data available', icon: 'BookOpen', change: '0%', changeType: 'neutral' },
            { key: 'active-trainers', label: 'Active Trainers', value: '0', subtext: 'No data available', icon: 'Users', change: '0%', changeType: 'neutral' },
            { key: 'courses', label: 'Total Courses', value: '0', subtext: 'No data available', icon: 'BookOpen', change: '0%', changeType: 'neutral' }
          ]);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
        // Fallback on error
        setStats([
          { key: 'total-users', label: 'Total Users', value: '0', subtext: 'Error loading data', icon: 'Users', change: '0%', changeType: 'neutral' },
          { key: 'active-students', label: 'Active Students', value: '0', subtext: 'Error loading data', icon: 'BookOpen', change: '0%', changeType: 'neutral' },
          { key: 'active-trainers', label: 'Active Trainers', value: '0', subtext: 'Error loading data', icon: 'Users', change: '0%', changeType: 'neutral' },
          { key: 'courses', label: 'Total Courses', value: '0', subtext: 'Error loading data', icon: 'BookOpen', change: '0%', changeType: 'neutral' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'BookOpen': return BookOpen;
      case 'Calendar': return Calendar;
      case 'AlertCircle': return AlertCircle;
      default: return Users;
    }
  };

  const getGradient = (index: number) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-emerald-500 to-emerald-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600'
    ];
    return gradients[index] || gradients[0];
  };

  if (initialLoading || loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm h-[140px]">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
            <Skeleton className="w-24 h-8 mb-2" />
            <Skeleton className="w-32 h-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = getIcon(stat.icon || 'Users');
        const isWarning = stat.changeType === 'warning';
        const gradient = getGradient(index);
        
        return (
          <div
            key={stat.key || index}
            className={`relative bg-white rounded-2xl border shadow-sm p-4 overflow-hidden group hover:shadow-lg transition-all ${
              isWarning ? 'border-orange-300' : 'border-gray-200'
            }`}
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`}></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {stat.change && stat.change !== 'Alert' && (
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                    isWarning 
                      ? 'bg-orange-50 border border-orange-200' 
                      : 'bg-emerald-50'
                  }`}>
                    {!isWarning && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className={`text-xs font-bold ${
                      isWarning ? 'text-orange-600' : 'text-emerald-600'
                    }`}>{stat.change}</span>
                  </div>
                )}
                {isWarning && (
                  <div className="flex items-center gap-1 bg-orange-100 px-2.5 py-1 rounded-full animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-xs font-bold text-orange-700">Alert</span>
                  </div>
                )}
              </div>

              <div className={`text-3xl font-bold mb-1.5 ${
                isWarning ? 'text-orange-600' : 'text-[#1A1D1F]'
              }`}>
                {stat.value}
              </div>

              <div className={`text-sm font-semibold mb-1.5 ${
                isWarning ? 'text-orange-900' : 'text-[#1A1D1F]'
              }`}>
                {stat.label}
              </div>

              <div className={`text-xs leading-relaxed ${
                isWarning ? 'text-orange-700' : 'text-[#6E7191]'
              }`}>
                {stat.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
