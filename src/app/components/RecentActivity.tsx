import { UserPlus, BookOpen, Award, FileText } from 'lucide-react';

interface Activity {
  id: number;
  type: 'user' | 'course' | 'achievement' | 'report';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  iconBg: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: 'user',
    title: 'New User Registered',
    description: 'Sarah Johnson joined the platform',
    time: '10 minutes ago',
    icon: <UserPlus size={18} className="text-white" />,
    iconBg: '#4ECDC4'
  },
  {
    id: 2,
    type: 'course',
    title: 'Course Published',
    description: 'Advanced React Patterns is now live',
    time: '1 hour ago',
    icon: <BookOpen size={18} className="text-white" />,
    iconBg: '#FF6B9D'
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'Charlie Rawal completed 50 courses',
    time: '3 hours ago',
    icon: <Award size={18} className="text-white" />,
    iconBg: '#FFB347'
  },
  {
    id: 4,
    type: 'report',
    title: 'Monthly Report Generated',
    description: 'December analytics report is ready',
    time: '5 hours ago',
    icon: <FileText size={18} className="text-white" />,
    iconBg: '#9B59B6'
  },
  {
    id: 5,
    type: 'course',
    title: 'Course Updated',
    description: 'Motion Design curriculum revised',
    time: '1 day ago',
    icon: <BookOpen size={18} className="text-white" />,
    iconBg: '#FF6B9D'
  }
];

export function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="font-semibold text-[#1A1D1F] mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-[#F5F5F7] last:border-0 last:pb-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: activity.iconBg }}
            >
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1D1F] mb-1">{activity.title}</p>
              <p className="text-sm text-[#6E7191] mb-1">{activity.description}</p>
              <p className="text-xs text-[#6E7191]">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
