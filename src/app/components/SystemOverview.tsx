import { Server, Database, HardDrive, Activity } from 'lucide-react';

interface SystemStat {
  label: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ReactNode;
}

export function SystemOverview() {
  const systemStats: SystemStat[] = [
    {
      label: 'Server Status',
      value: 'Online',
      status: 'healthy',
      icon: <Server size={20} className="text-[#44A08D]" />
    },
    {
      label: 'Database',
      value: '98.2% Healthy',
      status: 'healthy',
      icon: <Database size={20} className="text-[#44A08D]" />
    },
    {
      label: 'Storage Used',
      value: '234 GB / 500 GB',
      status: 'healthy',
      icon: <HardDrive size={20} className="text-[#FFB347]" />
    },
    {
      label: 'Active Users',
      value: '847 online',
      status: 'healthy',
      icon: <Activity size={20} className="text-[#4ECDC4]" />
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="font-semibold text-[#1A1D1F] mb-6">System Overview</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {systemStats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-[#FAFAFA] rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              {stat.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#6E7191] mb-1">{stat.label}</p>
              <p className="text-sm font-medium text-[#1A1D1F]">{stat.value}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              stat.status === 'healthy' ? 'bg-[#44A08D]' :
              stat.status === 'warning' ? 'bg-[#FFB347]' :
              'bg-[#FF6B9D]'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
}
