import { useState } from 'react';
import { MyCourseCard } from './MyCourseCard';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';

// Mock data with the exact visual style from the image
const MOCK_COURSES = [
  {
    course_id: 12,
    course_name: 'Python Programming Basics',
    course_code: 'PY-101',
    trainer_name: 'Dr. Rajesh Kumar',
    trainer_title: 'Senior Python Developer',
    description: 'Learn Python fundamentals and build real-world applications with hands-on projects',
    preview_images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=300&h=300&fit=crop',
    ],
    course_avatar: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200&h=200&fit=crop',
    modules_count: 20,
    assignments_count: 10,
    hours_count: 60,
    completion_percentage: 75,
    is_favorited: true,
    course_status: 'IN_PROGRESS' as const,
    resume_module: 'Django REST',
    resume_topic: 'Serializers',
  },
  {
    course_id: 15,
    course_name: 'HTML & CSS Fundamentals',
    course_code: 'WEB-100',
    trainer_name: 'Ms. Amrit Patel',
    trainer_title: 'Frontend Specialist',
    description: 'Master the building blocks of web design with comprehensive HTML and CSS training',
    preview_images: [
      'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1494253109108-2e30c049369b?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=300&h=300&fit=crop',
    ],
    course_avatar: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=200&h=200&fit=crop',
    modules_count: 10,
    assignments_count: 5,
    hours_count: 32,
    completion_percentage: 100,
    is_favorited: false,
    course_status: 'COMPLETED' as const,
  },
  {
    course_id: 18,
    course_name: 'JavaScript Advanced Concepts',
    course_code: 'JS-201',
    trainer_name: 'Mr. Vikram Singh',
    trainer_title: 'JavaScript Expert',
    description: 'Deep dive into advanced JavaScript patterns, async programming, and modern frameworks',
    preview_images: [
      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1592609931095-54a2168ae893?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1562813733-b31f71025d54?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop',
    ],
    course_avatar: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&h=200&fit=crop',
    modules_count: 20,
    assignments_count: 8,
    hours_count: 65,
    completion_percentage: 45,
    is_favorited: true,
    course_status: 'IN_PROGRESS' as const,
    resume_module: 'Async Programming',
    resume_topic: 'Promises',
  },
];

type FilterType = 'ALL' | 'IN_PROGRESS' | 'COMPLETED';

export function MyCoursesTab() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const filteredCourses = MOCK_COURSES.filter((course) => {
    if (activeFilter === 'ALL') return true;
    return course.course_status === activeFilter;
  });

  const stats = {
    total: MOCK_COURSES.length,
    inProgress: MOCK_COURSES.filter((c) => c.course_status === 'IN_PROGRESS').length,
    completed: MOCK_COURSES.filter((c) => c.course_status === 'COMPLETED').length,
  };

  return (
    <div className="w-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D1F]">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D1F]">{stats.inProgress}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1D1F]">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-[#E0E0E2] p-2 mb-6 inline-flex gap-2">
        {(['ALL', 'IN_PROGRESS', 'COMPLETED'] as FilterType[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter
                ? 'bg-[#1A1D1F] text-white'
                : 'text-[#6E7191] hover:bg-[#F7F7F8]'
            }`}
          >
            {filter === 'ALL'
              ? 'All Courses'
              : filter === 'IN_PROGRESS'
              ? 'In Progress'
              : 'Completed'}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <MyCourseCard key={course.course_id} course={course} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1D1F] mb-2">No Courses Found</h3>
          <p className="text-sm text-gray-500">
            No courses match the selected filter.
          </p>
        </div>
      )}
    </div>
  );
}
