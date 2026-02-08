import { Calendar, Clock, Users, MapPin, Video } from 'lucide-react';

export function TrainerScheduleSection() {
  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <WeekOverview />

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingClasses />
        <CompletedClasses />
      </div>
    </div>
  );
}

function WeekOverview() {
  const weekData = [
    { day: 'Monday', classes: 4, hours: 6, status: 'completed' },
    { day: 'Tuesday', classes: 3, hours: 5, status: 'completed' },
    { day: 'Wednesday', classes: 5, hours: 7, status: 'today' },
    { day: 'Thursday', classes: 4, hours: 6, status: 'upcoming' },
    { day: 'Friday', classes: 3, hours: 5, status: 'upcoming' },
    { day: 'Saturday', classes: 2, hours: 4, status: 'upcoming' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">This Week's Schedule</h3>
        <p className="text-xs text-[#6E7191]">Overview of your teaching hours</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {weekData.map((day) => (
          <div
            key={day.day}
            className={`rounded-xl p-4 border-2 transition-all ${
              day.status === 'today'
                ? 'bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] border-[#4ECDC4] shadow-lg'
                : day.status === 'completed'
                ? 'bg-gray-50 border-gray-200'
                : 'bg-white border-gray-200 hover:border-[#4ECDC4]'
            }`}
          >
            <div className={`text-xs font-semibold mb-2 ${
              day.status === 'today' ? 'text-white' : 'text-[#6E7191]'
            }`}>
              {day.day}
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              day.status === 'today' ? 'text-white' : 'text-[#1A1D1F]'
            }`}>
              {day.classes}
            </div>
            <div className={`text-xs ${
              day.status === 'today' ? 'text-white/90' : 'text-[#6E7191]'
            }`}>
              {day.hours} hours
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingClasses() {
  const classes = [
    {
      time: '10:00 AM - 12:00 PM',
      title: 'Python Basics - Session 15',
      batch: 'Batch A',
      students: 24,
      location: 'Room 301',
      type: 'In-Person'
    },
    {
      time: '02:00 PM - 04:00 PM',
      title: 'React Advanced - Components',
      batch: 'Batch B',
      students: 18,
      location: 'Online',
      type: 'Virtual'
    },
    {
      time: '04:30 PM - 06:30 PM',
      title: 'Data Science - ML Intro',
      batch: 'Batch C',
      students: 22,
      location: 'Room 402',
      type: 'In-Person'
    },
    {
      time: '06:00 PM - 08:00 PM',
      title: 'ML Fundamentals - Neural Networks',
      batch: 'Batch D',
      students: 20,
      location: 'Online',
      type: 'Virtual'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Upcoming Classes</h3>
        <p className="text-xs text-[#6E7191]">Today's schedule</p>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {classes.map((cls, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#1A1D1F] mb-1">{cls.title}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {cls.batch}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    cls.type === 'Virtual' 
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {cls.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-[#6E7191]">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-semibold">{cls.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E7191]">
                <Users className="w-3.5 h-3.5" />
                <span className="font-semibold">{cls.students} students</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E7191]">
                {cls.type === 'Virtual' ? (
                  <Video className="w-3.5 h-3.5" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )}
                <span className="font-semibold">{cls.location}</span>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all">
              {cls.type === 'Virtual' ? 'Join Virtual Class' : 'View Details'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletedClasses() {
  const classes = [
    {
      time: '10:00 AM - 12:00 PM',
      title: 'Python Basics - Session 14',
      batch: 'Batch A',
      students: 24,
      attendance: '22/24',
      date: 'Yesterday'
    },
    {
      time: '02:00 PM - 04:00 PM',
      title: 'React Advanced - Hooks',
      batch: 'Batch B',
      students: 18,
      attendance: '17/18',
      date: 'Yesterday'
    },
    {
      time: '04:30 PM - 06:30 PM',
      title: 'Data Science - Statistics',
      batch: 'Batch C',
      students: 22,
      attendance: '20/22',
      date: 'Yesterday'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Recent Classes</h3>
        <p className="text-xs text-[#6E7191]">Completed sessions</p>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {classes.map((cls, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#1A1D1F] mb-1">{cls.title}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-700 bg-gray-200 px-2 py-0.5 rounded">
                    {cls.batch}
                  </span>
                  <span className="text-xs text-[#6E7191]">{cls.date}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-[#6E7191]">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-semibold">{cls.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E7191]">
                <Users className="w-3.5 h-3.5" />
                <span className="font-semibold">Attendance: {cls.attendance}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 bg-white border border-gray-300 text-[#1A1D1F] text-xs font-semibold rounded-lg hover:bg-gray-50 transition-all">
                View Recording
              </button>
              <button className="px-3 py-2 bg-white border border-gray-300 text-[#1A1D1F] text-xs font-semibold rounded-lg hover:bg-gray-50 transition-all">
                View Attendance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
