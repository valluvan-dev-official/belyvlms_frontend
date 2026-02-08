import { CourseCard } from '../../../CourseCard';

interface StudentCoursesWidgetProps {
  isLoading?: boolean;
}

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

export default function StudentCoursesWidget({ isLoading = false }: StudentCoursesWidgetProps) {
  if (isLoading) {
    return <div className="h-[200px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-full">
      {courses.map((course, index) => (
        <CourseCard key={index} {...course} />
      ))}
    </div>
  );
}
