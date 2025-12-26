import { BookOpen, FileText, Users } from 'lucide-react';

interface CourseCardProps {
  title: string;
  icon: string;
  lessons: number;
  files: number;
  students: number;
  backgroundColor: string;
  iconBackgroundColor: string;
}

export function CourseCard({ 
  title, 
  icon, 
  lessons, 
  files, 
  students, 
  backgroundColor,
  iconBackgroundColor 
}: CourseCardProps) {
  return (
    <div 
      className="rounded-2xl p-6 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
      style={{ backgroundColor }}
    >
      {/* Icon */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
        style={{ backgroundColor: iconBackgroundColor }}
      >
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-[#1A1D1F] font-semibold mb-6">{title}</h3>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[#6E7191] text-sm">
          <BookOpen size={16} />
          <span>{lessons}k</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#6E7191] text-sm">
          <FileText size={16} />
          <span>{files}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#6E7191] text-sm">
          <Users size={16} />
          <span>{students}</span>
        </div>
      </div>
    </div>
  );
}
