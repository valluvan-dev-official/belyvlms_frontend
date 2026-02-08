import { Users, Calendar, TrendingUp, Award, Clock, BookOpen } from 'lucide-react';

export function TrainerBatchesSection() {
  return (
    <div className="space-y-6">
      {/* Batch Stats */}
      <BatchStats />

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {batches.map((batch, index) => (
          <BatchCard key={index} batch={batch} />
        ))}
      </div>
    </div>
  );
}

function BatchStats() {
  const stats = [
    {
      label: 'Active Batches',
      value: '6',
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Total Students',
      value: '142',
      icon: Users,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      label: 'Avg Attendance',
      value: '92%',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Avg Completion',
      value: '85%',
      icon: Award,
      gradient: 'from-cyan-500 to-cyan-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-4 overflow-hidden group hover:shadow-lg transition-all"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`}></div>
            
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="text-3xl font-bold mb-1.5 text-[#1A1D1F]">
                {stat.value}
              </div>

              <div className="text-sm font-semibold text-[#1A1D1F]">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const batches = [
  {
    name: 'Python Basics',
    code: 'PY-101-A',
    students: 24,
    schedule: 'Mon, Wed, Fri • 10:00 AM',
    startDate: 'Aug 15, 2024',
    endDate: 'Nov 15, 2024',
    progress: 75,
    attendance: 95,
    completion: 88,
    status: 'In Progress',
    color: 'blue'
  },
  {
    name: 'React Advanced',
    code: 'REACT-201-B',
    students: 18,
    schedule: 'Tue, Thu • 02:00 PM',
    startDate: 'Sep 1, 2024',
    endDate: 'Dec 1, 2024',
    progress: 60,
    attendance: 92,
    completion: 85,
    status: 'In Progress',
    color: 'cyan'
  },
  {
    name: 'Data Science',
    code: 'DS-301-C',
    students: 22,
    schedule: 'Mon, Wed, Fri • 04:30 PM',
    startDate: 'Sep 15, 2024',
    endDate: 'Dec 15, 2024',
    progress: 50,
    attendance: 88,
    completion: 82,
    status: 'In Progress',
    color: 'emerald'
  },
  {
    name: 'Web Development',
    code: 'WEB-101-D',
    students: 28,
    schedule: 'Tue, Thu, Sat • 10:00 AM',
    startDate: 'Oct 1, 2024',
    endDate: 'Jan 1, 2025',
    progress: 40,
    attendance: 90,
    completion: 86,
    status: 'In Progress',
    color: 'purple'
  },
  {
    name: 'ML Fundamentals',
    code: 'ML-201-E',
    students: 20,
    schedule: 'Mon, Wed • 06:00 PM',
    startDate: 'Oct 15, 2024',
    endDate: 'Jan 15, 2025',
    progress: 35,
    attendance: 85,
    completion: 80,
    status: 'In Progress',
    color: 'orange'
  },
  {
    name: 'Backend APIs',
    code: 'BE-301-F',
    students: 30,
    schedule: 'Tue, Thu, Fri • 04:00 PM',
    startDate: 'Nov 1, 2024',
    endDate: 'Feb 1, 2025',
    progress: 25,
    attendance: 93,
    completion: 89,
    status: 'In Progress',
    color: 'pink'
  }
];

function BatchCard({ batch }: { batch: typeof batches[0] }) {
  const colorClasses: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      gradient: 'from-blue-500 to-blue-600'
    },
    cyan: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      text: 'text-cyan-700',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      gradient: 'from-purple-500 to-purple-600'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      gradient: 'from-orange-500 to-orange-600'
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
      gradient: 'from-pink-500 to-pink-600'
    }
  };

  const colors = colorClasses[batch.color];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#1A1D1F] mb-1">{batch.name}</h3>
          <p className="text-sm font-semibold text-[#6E7191]">{batch.code}</p>
        </div>
        <div className={`px-3 py-1 ${colors.bg} ${colors.border} border rounded-full`}>
          <span className={`text-xs font-bold ${colors.text}`}>{batch.status}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
          <Users className={`w-4 h-4 ${colors.text} mb-2`} />
          <div className={`text-2xl font-bold ${colors.text} mb-0.5`}>{batch.students}</div>
          <div className="text-xs font-semibold text-[#6E7191]">Students</div>
        </div>

        <div className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
          <TrendingUp className={`w-4 h-4 ${colors.text} mb-2`} />
          <div className={`text-2xl font-bold ${colors.text} mb-0.5`}>{batch.attendance}%</div>
          <div className="text-xs font-semibold text-[#6E7191]">Attendance</div>
        </div>

        <div className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
          <Award className={`w-4 h-4 ${colors.text} mb-2`} />
          <div className={`text-2xl font-bold ${colors.text} mb-0.5`}>{batch.completion}%</div>
          <div className="text-xs font-semibold text-[#6E7191]">Completion</div>
        </div>

        <div className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
          <BookOpen className={`w-4 h-4 ${colors.text} mb-2`} />
          <div className={`text-2xl font-bold ${colors.text} mb-0.5`}>{batch.progress}%</div>
          <div className="text-xs font-semibold text-[#6E7191]">Progress</div>
        </div>
      </div>

      {/* Schedule Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-[#6E7191]">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold">{batch.schedule}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6E7191]">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-semibold">{batch.startDate} - {batch.endDate}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#6E7191]">Course Progress</span>
          <span className="text-xs font-bold text-[#1A1D1F]">{batch.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${colors.gradient} h-2 rounded-full transition-all`}
            style={{ width: `${batch.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button className="px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all">
          View Details
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-[#1A1D1F] text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all">
          Manage
        </button>
      </div>
    </div>
  );
}
