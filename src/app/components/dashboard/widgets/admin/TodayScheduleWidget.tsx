import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { Skeleton } from '../../../ui/skeleton';
import { DashboardService, ScheduleEvent } from '../../../../services/DashboardService/DashboardService';

interface TodayScheduleWidgetProps {
  isLoading?: boolean;
}

export default function TodayScheduleWidget({ isLoading: initialLoading = false }: TodayScheduleWidgetProps) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await DashboardService.getTodaySchedule();
        setEvents(response?.events || []);
      } catch (error) {
        console.error("Failed to load schedule", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class':
        return Video;
      case 'meeting':
        return Users;
      default:
        return Users;
    }
  };

  const getTypeColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: 'text-blue-600' },
      { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', icon: 'text-purple-600' },
      { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', icon: 'text-orange-600' }
    ];
    return colors[index % colors.length];
  };

  if (initialLoading || loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-20 h-8 rounded-lg" />
        </div>
        <div className="space-y-4 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-start p-3 border border-gray-50 rounded-xl">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1A1D1F] flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            Today's Schedule
          </h3>
          <p className="text-xs text-[#6E7191] ml-9">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Schedule Items */}
      <div className="space-y-2.5 overflow-y-auto flex-1 pr-2">
        {events.map((item, index) => {
          const Icon = getTypeIcon(item.type);
          const colors = getTypeColor(index);
          
          return (
            <div
              key={item.id}
              className={`${colors.bg} ${colors.border} border rounded-xl p-3 hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-2.5">
                {/* Icon */}
                <div className={`w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon className={`w-4 h-4 ${colors.icon}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-semibold ${colors.text} mb-1.5`}>
                    {item.title}
                  </h4>
                  
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3 h-3 ${colors.icon}`} />
                      <span className={`text-xs font-medium ${colors.text}`}>
                        {item.time}
                      </span>
                    </div>
                    
                    {item.attendees_count !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Users className={`w-3 h-3 ${colors.icon}`} />
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {item.attendees_count} {item.attendees_count === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${colors.icon.replace('text-', 'bg-')} animate-pulse`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-[#6E7191]">No schedule for today</p>
        </div>
      )}
    </div>
  );
}
