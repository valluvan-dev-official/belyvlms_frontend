interface TrainerTodayScheduleWidgetProps {
  isLoading?: boolean;
}

export default function TrainerTodayScheduleWidget({ isLoading = false }: TrainerTodayScheduleWidgetProps) {
  if (isLoading) {
    return <div className="h-[320px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  const classes = [
    { time: '10:00 AM', batch: 'Python Basics', students: 24, status: 'upcoming' },
    { time: '02:00 PM', batch: 'React Advanced', students: 18, status: 'upcoming' },
    { time: '04:30 PM', batch: 'Data Science', students: 22, status: 'upcoming' },
    { time: '06:00 PM', batch: 'ML Fundamentals', students: 20, status: 'upcoming' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[320px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Today's Schedule</h3>
        <p className="text-xs text-[#6E7191]">4 classes scheduled</p>
      </div>

      <div className="space-y-2.5 overflow-y-auto flex-1 pr-2">
        {classes.map((cls, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-3 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-blue-900">{cls.time}</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {cls.students} students
              </span>
            </div>
            <div className="text-xs font-semibold text-blue-800 mb-1">{cls.batch}</div>
            <button className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all">
              Join Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
