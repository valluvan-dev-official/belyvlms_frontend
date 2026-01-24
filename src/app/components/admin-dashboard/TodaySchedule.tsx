import { Calendar, Clock, Users, Video } from 'lucide-react';

interface ScheduleItem {
  id: string;
  title: string;
  type: 'class' | 'meeting' | 'interview';
  time: string;
  participants: number;
  color: string;
}

export function TodaySchedule() {
  // Mock data - Replace with actual API
  const scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      title: 'Full Stack Batch Orientation',
      type: 'class',
      time: '2:00 PM - 3:30 PM',
      participants: 24,
      color: 'blue'
    },
    {
      id: '2',
      title: 'Trainer Review Meeting',
      type: 'meeting',
      time: '4:00 PM - 4:30 PM',
      participants: 5,
      color: 'purple'
    },
    {
      id: '3',
      title: 'Candidate Interviews',
      type: 'interview',
      time: '5:00 PM - 6:00 PM',
      participants: 3,
      color: 'orange'
    },
    {
      id: '4',
      title: 'Data Analytics Workshop',
      type: 'class',
      time: '6:30 PM - 8:00 PM',
      participants: 18,
      color: 'blue'
    }
  ];

  const getTypeIcon = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'class':
        return Video;
      case 'meeting':
        return Users;
      case 'interview':
        return Users;
    }
  };

  const getTypeColor = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        icon: 'text-blue-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-900',
        icon: 'text-purple-600'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-900',
        icon: 'text-orange-600'
      }
    };
    return colors[color] || colors.blue;
  };

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
        {scheduleItems.map((item) => {
          const Icon = getTypeIcon(item.type);
          const colors = getTypeColor(item.color);
          
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
                    
                    <div className="flex items-center gap-1.5">
                      <Users className={`w-3 h-3 ${colors.icon}`} />
                      <span className={`text-xs font-medium ${colors.text}`}>
                        {item.participants} {item.participants === 1 ? 'person' : 'people'}
                      </span>
                    </div>
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
      {scheduleItems.length === 0 && (
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