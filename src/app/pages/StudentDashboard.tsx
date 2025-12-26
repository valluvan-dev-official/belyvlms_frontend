import { CourseCard } from '../components/CourseCard';
import { HoursSpentChart } from '../components/HoursSpentChart';
import { PerformanceChart } from '../components/PerformanceChart';
import { LeaderBoard } from '../components/LeaderBoard';

const courses = [
  {
    title: 'Basic: HTML and CSS',
    icon: '🎓',
    lessons: 3,
    files: 4,
    students: 99,
    backgroundColor: '#E6E6FA',
    iconBackgroundColor: '#D8D8F6'
  },
  {
    title: 'Branding Design',
    icon: '🏠',
    lessons: 2,
    files: 8,
    students: 99,
    backgroundColor: '#FFF5E6',
    iconBackgroundColor: '#FFE8CC'
  },
  {
    title: 'Motion Design',
    icon: '🚗',
    lessons: 2,
    files: 4,
    students: 99,
    backgroundColor: '#E6F5E6',
    iconBackgroundColor: '#D0EDD0'
  }
];

export function StudentDashboard() {
  return (
    <>
      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <HoursSpentChart />
        <PerformanceChart />
      </div>

      {/* Leaderboard */}
      <div className="mb-8">
        <LeaderBoard />
      </div>
    </>
  );
}
