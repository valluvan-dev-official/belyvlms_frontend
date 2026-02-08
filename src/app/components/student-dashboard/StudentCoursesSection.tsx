import { BookOpen, Clock, Users, TrendingUp, Award, PlayCircle } from 'lucide-react';

export function StudentCoursesSection() {
  return (
    <div className="space-y-6">
      {/* Course Stats */}
      <CourseStats />

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
}

function CourseStats() {
  const stats = [
    {
      label: 'Enrolled Courses',
      value: '3',
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Completed',
      value: '1',
      icon: Award,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      label: 'In Progress',
      value: '2',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Total Hours',
      value: '142',
      icon: Clock,
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

const courses = [
  {
    title: 'Python Programming Basics',
    code: 'PY-101',
    instructor: 'Dr. Rajesh Kumar',
    progress: 75,
    hoursSpent: 45,
    totalHours: 60,
    nextClass: 'Today, 10:00 AM',
    status: 'In Progress',
    color: 'blue',
    modules: { completed: 15, total: 20 },
    assignments: { completed: 8, total: 10 }
  },
  {
    title: 'React Advanced Development',
    code: 'REACT-201',
    instructor: 'Ms. Priya Sharma',
    progress: 60,
    hoursSpent: 32,
    totalHours: 50,
    nextClass: 'Tomorrow, 2:00 PM',
    status: 'In Progress',
    color: 'cyan',
    modules: { completed: 12, total: 18 },
    assignments: { completed: 6, total: 9 }
  },
  {
    title: 'HTML & CSS Fundamentals',
    code: 'WEB-100',
    instructor: 'Mr. Amit Patel',
    progress: 100,
    hoursSpent: 32,
    totalHours: 32,
    nextClass: null,
    status: 'Completed',
    color: 'emerald',
    modules: { completed: 10, total: 10 },
    assignments: { completed: 5, total: 5 }
  }
];

function CourseCard({ course }: { course: typeof courses[0] }) {
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
    }
  };

  const colors = colorClasses[course.color];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#1A1D1F] mb-1">{course.title}</h3>
          <p className="text-sm font-semibold text-[#6E7191] mb-2">{course.code}</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center text-white font-bold text-xs">
              {course.instructor.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-xs font-semibold text-[#6E7191]">{course.instructor}</span>
          </div>
        </div>
        <div className={`px-3 py-1 ${colors.bg} ${colors.border} border rounded-full`}>
          <span className={`text-xs font-bold ${colors.text}`}>{course.status}</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#6E7191]">Course Progress</span>
          <span className="text-xs font-bold text-[#1A1D1F]">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className={`bg-gradient-to-r ${colors.gradient} h-2 rounded-full transition-all`}
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
          <BookOpen className={`w-4 h-4 ${colors.text} mb-2`} />
          <div className={`text-lg font-bold ${colors.text} mb-0.5`}>
            {course.modules.completed}/{course.modules.total}
          </div>
          <div className="text-xs font-semibold text-[#6E7191]">Modules</div>
        </div>

        <div className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
          <Award className={`w-4 h-4 ${colors.text} mb-2`} />
          <div className={`text-lg font-bold ${colors.text} mb-0.5`}>
            {course.assignments.completed}/{course.assignments.total}
          </div>
          <div className="text-xs font-semibold text-[#6E7191]">Assignments</div>
        </div>

        <div className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
          <Clock className={`w-4 h-4 ${colors.text} mb-2`} />
          <div className={`text-lg font-bold ${colors.text} mb-0.5`}>
            {course.hoursSpent}/{course.totalHours}
          </div>
          <div className="text-xs font-semibold text-[#6E7191]">Hours</div>
        </div>

        <div className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
          <TrendingUp className={`w-4 h-4 ${colors.text} mb-2`} />
          <div className={`text-lg font-bold ${colors.text} mb-0.5`}>
            {Math.round((course.modules.completed / course.modules.total) * 100)}%
          </div>
          <div className="text-xs font-semibold text-[#6E7191]">Completion</div>
        </div>
      </div>

      {/* Next Class Info */}
      {course.nextClass && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-blue-900">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold">Next Class: {course.nextClass}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        {course.status === 'Completed' ? (
          <>
            <button className="px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Award className="w-4 h-4" />
              Certificate
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-[#1A1D1F] text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all">
              Review
            </button>
          </>
        ) : (
          <>
            <button className="px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Continue
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-[#1A1D1F] text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all">
              Details
            </button>
          </>
        )}
      </div>
    </div>
  );
}
