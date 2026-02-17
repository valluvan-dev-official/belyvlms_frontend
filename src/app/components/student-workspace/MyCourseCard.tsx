import { useNavigate } from 'react-router-dom';
import { Star, Phone, MoreVertical, Play } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CourseCardData {
  course_id: number;
  course_name: string;
  course_code: string;
  trainer_name: string;
  trainer_title: string;
  description: string;
  preview_images: string[]; // Array of 9 image URLs for the grid
  course_avatar: string;
  modules_count: number;
  assignments_count: number;
  hours_count: number;
  completion_percentage: number;
  is_favorited: boolean;
  course_status: 'IN_PROGRESS' | 'COMPLETED';
  resume_module?: string;
  resume_topic?: string;
}

interface MyCourseCardProps {
  course: CourseCardData;
}

export function MyCourseCard({ course }: MyCourseCardProps) {
  const navigate = useNavigate();

  const handleResume = () => {
    navigate(`/learning/course/${course.course_id}`);
  };

  const handleViewDetails = () => {
    navigate(`/courses/${course.course_id}/details`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E2] overflow-hidden hover:shadow-lg transition-all">
      {/* Image Gallery Grid - 1x3 */}
      <div className="grid grid-cols-3 gap-1 p-4 pb-3">
        {course.preview_images.slice(0, 3).map((image, index) => (
          <div
            key={index}
            className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100"
          >
            <ImageWithFallback
              src={image}
              alt={`${course.course_name} preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Course Avatar & Info Section */}
      <div className="px-4 pb-4">
        {/* Avatar centered */}
        <div className="flex justify-center -mt-8 mb-3">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
            <ImageWithFallback
              src={course.course_avatar}
              alt={course.course_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Action Icons Row */}
        <div className="flex items-center justify-center gap-6 mb-3">
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="More options"
          >
            <MoreVertical size={20} />
          </button>

          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Contact trainer"
          >
            <Phone size={20} />
          </button>

          <button
            className={`transition-colors ${
              course.is_favorited
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Favorite"
          >
            <Star size={20} fill={course.is_favorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Course Name */}
        <h3 className="text-center text-base font-semibold text-[#1A1D1F] mb-1">
          {course.course_name.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
        </h3>

        {/* Course Code */}
        <p className="text-center text-sm text-gray-400 mb-3">
          {course.course_code}
        </p>

        {/* Description */}
        <p className="text-center text-xs text-gray-500 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-[#1A1D1F]">{course.modules_count}</p>
            <p className="text-xs text-gray-400">Modules</p>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-[#1A1D1F]">
              {course.completion_percentage}%
            </p>
            <p className="text-xs text-gray-400">Progress</p>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-[#1A1D1F]">{course.hours_count}h</p>
            <p className="text-xs text-gray-400">Hours</p>
          </div>
        </div>

        {/* Resume Learning Button */}
        {course.course_status === 'IN_PROGRESS' && course.resume_module && (
          <button
            onClick={handleResume}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-lg font-medium hover:shadow-md transition-all"
          >
            <Play size={16} />
            Resume: {course.resume_module}
          </button>
        )}

        {/* Completed Badge */}
        {course.course_status === 'COMPLETED' && (
          <div className="w-full mt-4 text-center px-4 py-2.5 bg-green-50 text-green-600 rounded-lg font-medium">
            ✓ Completed
          </div>
        )}
      </div>
    </div>
  );
}
