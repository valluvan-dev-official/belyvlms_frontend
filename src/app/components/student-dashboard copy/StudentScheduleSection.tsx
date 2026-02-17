import { Calendar, Clock, MapPin, Video, Bell } from 'lucide-react';

export function StudentScheduleSection() {
  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <WeekOverview />

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaySchedule />
        <UpcomingSchedule />
      </div>
    </div>
  );
}

function WeekOverview() {
  const weekData = [
    { day: 'Monday', classes: 3, completed: 3, status: 'completed' },
    { day: 'Tuesday', classes: 2, completed: 2, status: 'completed' },
    { day: 'Wednesday', classes: 3, completed: 0, status: 'today' },
    { day: 'Thursday', classes: 2, completed: 0, status: 'upcoming' },
    { day: 'Friday', classes: 3, completed: 0, status: 'upcoming' },
    { day: 'Saturday', classes: 1, completed: 0, status: 'upcoming' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">This Week's Classes</h3>
        <p className="text-xs text-[#6E7191]">Your weekly schedule overview</p>
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
              {day.status === 'completed' ? `${day.completed} attended` : 'classes'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TodaySchedule() {
  const classes = [
    {
      time: '10:00 AM - 12:00 PM',
      title: 'Python Basics - Session 15',
      course: 'Python Programming',
      instructor: 'Dr. Rajesh Kumar',
      location: 'Room 301',
      type: 'In-Person',
      status: 'upcoming'
    },
    {
      time: '02:00 PM - 04:00 PM',
      title: 'React Components Deep Dive',
      course: 'React Advanced',
      instructor: 'Ms. Priya Sharma',
      location: 'Online',
      type: 'Virtual',
      status: 'upcoming'
    },
    {
      time: '04:30 PM - 06:30 PM',
      title: 'Data Analysis Workshop',
      course: 'Data Science',
      instructor: 'Dr. Amit Patel',
      location: 'Lab 2',
      type: 'Workshop',
      status: 'upcoming'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Today's Classes</h3>
        <p className="text-xs text-[#6E7191]">Wednesday, January 24</p>
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
                <p className="text-xs font-semibold text-blue-700 mb-2">{cls.course}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    cls.type === 'Virtual' 
                      ? 'bg-purple-100 text-purple-700'
                      : cls.type === 'Workshop'
                      ? 'bg-orange-100 text-orange-700'
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
                {cls.type === 'Virtual' ? (
                  <Video className="w-3.5 h-3.5" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )}
                <span className="font-semibold">{cls.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E7191]">
                <Bell className="w-3.5 h-3.5" />
                <span className="font-semibold">Instructor: {cls.instructor}</span>
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

function UpcomingSchedule() {
  const upcomingClasses = [
    {
      date: 'Tomorrow',
      day: 'Thursday, Jan 25',
      classes: [
        { time: '10:00 AM', title: 'Python - Functions', type: 'Lecture' },
        { time: '02:00 PM', title: 'React - State Management', type: 'Practical' }
      ]
    },
    {
      date: 'Friday',
      day: 'Friday, Jan 26',
      classes: [
        { time: '10:00 AM', title: 'Data Science - Statistics', type: 'Lecture' },
        { time: '02:00 PM', title: 'Python - OOP Concepts', type: 'Lecture' },
        { time: '04:30 PM', title: 'React - Routing', type: 'Practical' }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1A1D1F] mb-0.5">Upcoming Classes</h3>
        <p className="text-xs text-[#6E7191]">Next 2 days</p>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {upcomingClasses.map((daySchedule, dayIndex) => (
          <div key={dayIndex}>
            <div className="mb-2 pb-2 border-b border-gray-200">
              <h4 className="text-sm font-bold text-[#1A1D1F]">{daySchedule.date}</h4>
              <p className="text-xs text-[#6E7191]">{daySchedule.day}</p>
            </div>

            <div className="space-y-2">
              {daySchedule.classes.map((cls, clsIndex) => (
                <div
                  key={clsIndex}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#1A1D1F]">{cls.time}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      cls.type === 'Practical'
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {cls.type}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#6E7191]">{cls.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
