import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  backgroundColor: string;
  iconBackgroundColor: string;
}

export function AdminStatsCards() {
  const stats: StatCard[] = [
    {
      title: 'Total Students',
      value: '1,284',
      change: '+12.5%',
      changeType: 'positive',
      icon: <Users size={24} className="text-[#6E7191]" />,
      backgroundColor: '#E6E6FA',
      iconBackgroundColor: '#D8D8F6'
    },
    {
      title: 'Active Courses',
      value: '47',
      change: '+3 new',
      changeType: 'positive',
      icon: <BookOpen size={24} className="text-[#6E7191]" />,
      backgroundColor: '#FFF5E6',
      iconBackgroundColor: '#FFE8CC'
    },
    {
      title: 'Total Revenue',
      value: '$89,540',
      change: '+8.2%',
      changeType: 'positive',
      icon: <DollarSign size={24} className="text-[#6E7191]" />,
      backgroundColor: '#E6F5E6',
      iconBackgroundColor: '#D0EDD0'
    },
    {
      title: 'Completion Rate',
      value: '87.3%',
      change: '+2.1%',
      changeType: 'positive',
      icon: <TrendingUp size={24} className="text-[#6E7191]" />,
      backgroundColor: '#FFE6F0',
      iconBackgroundColor: '#FFCCE0'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: stat.iconBackgroundColor }}
            >
              {stat.icon}
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive'
                  ? 'bg-[#E6F5E6] text-[#44A08D]'
                  : 'bg-[#FFE6F0] text-[#FF6B9D]'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-[#6E7191] mb-1">{stat.title}</p>
          <p className="text-2xl font-semibold text-[#1A1D1F]">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
