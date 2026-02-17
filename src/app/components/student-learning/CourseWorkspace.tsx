import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  CheckCircle, 
  Circle,
  Play,
  FileText,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Video,
  Download,
  Users,
  User,
  PlayCircle,
  Radio,
} from 'lucide-react';
import { useState } from 'react';

type SessionStatus = 'UPCOMING' | 'LIVE_NOW' | 'COMPLETED' | 'RECORDING_AVAILABLE';

export function CourseWorkspace() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([1]));

  // Mock course data
  const course = getCourseById(Number(courseId));

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1A1D1F] mb-2">Course Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#4ECDC4] hover:underline"
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const toggleModule = (moduleId: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleSessionClick = (session: Session) => {
    navigate(`/learning/course/${courseId}/sessions/${session.session_id}`);
  };

  const handleWatchRecording = (session: Session) => {
    navigate(`/learning/course/${courseId}/sessions/${session.session_id}/recording`);
  };

  // Get resume learning info
  const getResumeInfo = () => {
    // Mock: Get the last accessed session
    const lastSession = course.modules[1]?.topics[1]?.sessions[0];
    if (lastSession) {
      return {
        module_name: course.modules[1].module_name,
        topic_name: course.modules[1].topics[1].topic_name,
        session: lastSession,
        last_position: 1847, // seconds
      };
    }
    return null;
  };

  const resumeInfo = getResumeInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <button
            onClick={() => navigate('/student/my-courses')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to My Courses</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1D1F]">{course.course_name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {course.course_code} • {course.trainer_name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-[#4ECDC4]">
                  {course.completion_percentage}%
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Panel Layout */}
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* LEFT PANEL - Module Navigator */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="font-semibold text-[#1A1D1F] mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-[#4ECDC4]" />
              Course Structure
            </h2>
            <div className="space-y-2">
              {course.modules.map((module) => (
                <ModuleTreeItem
                  key={module.module_id}
                  module={module}
                  isExpanded={expandedModules.has(module.module_id)}
                  onToggle={() => toggleModule(module.module_id)}
                  courseId={course.course_id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL - Session List OR Session Detail */}
        <div className="col-span-6 space-y-4">
          {/* SESSION LIST */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1A1D1F] mb-4">All Sessions</h2>
            <div className="space-y-3">
              {course.modules.map((module) =>
                module.topics.map((topic) =>
                  topic.sessions.map((session) => (
                    <SessionCard
                      key={session.session_id}
                      session={session}
                      module={module}
                      topic={topic}
                      onClick={() => handleSessionClick(session)}
                      onWatchRecording={() => handleWatchRecording(session)}
                    />
                  ))
                )
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Resume Intelligence & Course Insights */}
        <div className="col-span-3 space-y-4">
          {/* Resume Learning Panel */}
          {resumeInfo && (
            <div className="bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] rounded-xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <PlayCircle size={24} />
                <h3 className="font-semibold">Resume Learning</h3>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-sm opacity-90">
                  <div className="flex items-center gap-1">
                    <ChevronRight size={14} />
                    <span>{resumeInfo.module_name}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <ChevronRight size={14} />
                    <span>{resumeInfo.topic_name}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-8">
                    <ChevronRight size={14} />
                    <span className="font-medium">{resumeInfo.session.session_title}</span>
                  </div>
                </div>
                <div className="text-xs opacity-75">
                  Last watched: {formatTime(resumeInfo.last_position)} / {resumeInfo.session.duration}
                </div>
              </div>
              <button
                onClick={() => handleWatchRecording(resumeInfo.session)}
                className="w-full bg-white text-[#4ECDC4] py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Play size={16} />
                Continue Learning
              </button>
            </div>
          )}

          {/* Overall Progress */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Course Progress</p>
                <p className="text-2xl font-bold text-[#1A1D1F]">
                  {course.completion_percentage}%
                </p>
              </div>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] h-2 rounded-full transition-all"
                style={{ width: `${course.completion_percentage}%` }}
              />
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-[#1A1D1F] mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#4ECDC4]" />
              Attendance Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Classes Attended</span>
                <span className="font-semibold text-[#1A1D1F]">24/30</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attendance Rate</span>
                <span className="font-semibold text-green-600">80%</span>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-[#1A1D1F] mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-[#4ECDC4]" />
              Upcoming Sessions
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-[#1A1D1F]">Django ORM Deep Dive</p>
                <p className="text-xs text-gray-500 mt-1">Today, 3:00 PM</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-[#1A1D1F]">REST API Best Practices</p>
                <p className="text-xs text-gray-500 mt-1">Tomorrow, 2:00 PM</p>
              </div>
            </div>
          </div>

          {/* Course Resources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-[#1A1D1F] mb-4 flex items-center gap-2">
              <FileText size={18} className="text-[#4ECDC4]" />
              Course Resources
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                <Download size={16} />
                Course Syllabus.pdf
              </button>
              <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                <Download size={16} />
                Code Exercises.zip
              </button>
              <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                <Download size={16} />
                Reference Guide.pdf
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SIMPLIFIED SESSION CARD (LIKE IMAGE)
interface SessionCardProps {
  session: Session;
  module: Module;
  topic: Topic;
  onClick: () => void;
  onWatchRecording: () => void;
}

function SessionCard({ session, module, topic, onClick, onWatchRecording }: SessionCardProps) {
  const status = computeSessionStatus(session);

  const getStatusBadge = () => {
    if (status === 'LIVE_NOW') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <Radio size={12} />
          LIVE NOW
        </span>
      );
    }
    if (status === 'RECORDING_AVAILABLE') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <Video size={12} />
          RECORDING AVAILABLE
        </span>
      );
    }
    return null;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 cursor-pointer" onClick={onClick}>
          <div className="flex items-center gap-2 mb-1">
            <Play size={16} className="text-[#4ECDC4]" />
            <h4 className="font-medium text-[#1A1D1F] text-sm hover:text-[#4ECDC4]">
              {session.session_title}
            </h4>
          </div>
          <p className="text-xs text-gray-500">
            {module.module_name} → {topic.topic_name}
          </p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <User size={14} />
          {session.trainer_display_name}
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(session.session_datetime).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          {session.session_duration}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600 uppercase font-medium">
          {session.session_mode}
        </span>
        {status === 'RECORDING_AVAILABLE' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchRecording();
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm"
          >
            <Play size={14} />
            Watch Recording
          </button>
        )}
        {status === 'LIVE_NOW' && (
          <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm flex items-center gap-2">
            <Radio size={14} />
            Live
          </span>
        )}
      </div>
    </div>
  );
}

// MODULE TREE COMPONENT
interface ModuleTreeItemProps {
  module: Module;
  isExpanded: boolean;
  onToggle: () => void;
  courseId: number;
}

function ModuleTreeItem({ module, isExpanded, onToggle }: ModuleTreeItemProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-2 p-3 rounded-lg transition-all ${
          module.is_completed
            ? 'bg-green-50 border border-green-200'
            : module.is_locked
            ? 'bg-gray-50 border border-gray-200'
            : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
        }`}
      >
        {module.is_completed ? (
          <CheckCircle size={18} className="text-green-600" />
        ) : module.is_locked ? (
          <Lock size={18} className="text-gray-400" />
        ) : (
          <Circle size={18} className="text-blue-600" />
        )}
        <span className="flex-1 text-left text-sm font-medium text-[#1A1D1F]">
          {module.module_name}
        </span>
        {isExpanded ? (
          <ChevronDown size={18} className="text-gray-400" />
        ) : (
          <ChevronRight size={18} className="text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
          {module.topics.map((topic) => (
            <div key={topic.topic_id} className="flex items-center gap-2 p-2">
              {topic.is_completed ? (
                <CheckCircle size={14} className="text-green-600" />
              ) : (
                <Circle size={14} className="text-gray-400" />
              )}
              <span className="text-xs text-gray-700">{topic.topic_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// HELPER FUNCTIONS
function computeSessionStatus(session: Session): SessionStatus {
  const now = new Date();
  const sessionStart = new Date(session.session_datetime);
  const sessionEnd = new Date(sessionStart.getTime() + parseDuration(session.session_duration) * 60000);

  if (now < sessionStart) {
    return 'UPCOMING';
  } else if (now >= sessionStart && now <= sessionEnd) {
    return 'LIVE_NOW';
  } else if (now > sessionEnd && session.recording_status === 'AVAILABLE') {
    return 'RECORDING_AVAILABLE';
  } else {
    return 'COMPLETED';
  }
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)\s*min/);
  return match ? parseInt(match[1]) : 60;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`;
}

// TYPES
interface Session {
  session_id: number;
  session_title: string;
  topic_name: string;
  trainer_display_name: string;
  session_datetime: string;
  session_duration: string;
  session_mode: 'LIVE' | 'RECORDING';
  is_completed: boolean;
  has_recording: boolean;
  has_materials: boolean;
  recording_status?: 'AVAILABLE' | 'PROCESSING' | 'UNAVAILABLE';
  description?: string;
  objectives?: string[];
  materials?: Array<{
    name: string;
    type: string;
    size: string;
  }>;
}

interface Topic {
  topic_id: number;
  topic_name: string;
  is_completed: boolean;
  sessions: Session[];
}

interface Module {
  module_id: number;
  module_name: string;
  is_completed: boolean;
  is_locked: boolean;
  topics: Topic[];
}

interface CourseData {
  course_id: number;
  course_name: string;
  course_code: string;
  trainer_name: string;
  completion_percentage: number;
  modules: Module[];
}

// MOCK DATA
function getCourseById(id: number): CourseData | null {
  const courses: Record<number, CourseData> = {
    12: {
      course_id: 12,
      course_name: 'Python Programming Basics',
      course_code: 'PY-101',
      trainer_name: 'Dr. Rajesh Kumar',
      completion_percentage: 75,
      modules: [
        {
          module_id: 1,
          module_name: 'Python Fundamentals',
          is_completed: true,
          is_locked: false,
          topics: [
            {
              topic_id: 1,
              topic_name: 'Introduction to Python',
              is_completed: true,
              sessions: [
                {
                  session_id: 1,
                  session_title: 'Python Setup & First Program',
                  topic_name: 'Introduction to Python',
                  trainer_display_name: 'Dr. Rajesh Kumar',
                  session_datetime: '2026-01-15T10:00:00',
                  session_duration: '45 min',
                  session_mode: 'RECORDING',
                  is_completed: true,
                  has_recording: true,
                  has_materials: true,
                  recording_status: 'AVAILABLE',
                  description:
                    'Learn how to set up Python development environment and write your first Python program. We will cover installation, IDE setup, and basic syntax.',
                  objectives: [
                    'Install Python and set up development environment',
                    'Understand Python syntax basics',
                    'Write and execute your first Python program',
                    'Learn about Python REPL and script execution',
                  ],
                  materials: [
                    { name: 'Python Setup Guide.pdf', type: 'PDF', size: '2.5 MB' },
                    { name: 'First Program Code.py', type: 'Python', size: '1 KB' },
                    { name: 'Slides - Session 1.pptx', type: 'PowerPoint', size: '8.2 MB' },
                  ],
                },
              ],
            },
            {
              topic_id: 2,
              topic_name: 'Variables & Data Types',
              is_completed: true,
              sessions: [
                {
                  session_id: 2,
                  session_title: 'Working with Data Types',
                  topic_name: 'Variables & Data Types',
                  trainer_display_name: 'Dr. Rajesh Kumar',
                  session_datetime: '2026-01-16T14:00:00',
                  session_duration: '60 min',
                  session_mode: 'RECORDING',
                  is_completed: true,
                  has_recording: true,
                  has_materials: true,
                  recording_status: 'AVAILABLE',
                  description: 'Deep dive into Python data types and variables.',
                  objectives: [
                    'Understand different data types in Python',
                    'Learn about type conversion',
                    'Master string operations',
                  ],
                  materials: [
                    { name: 'Data Types Guide.pdf', type: 'PDF', size: '1.8 MB' },
                  ],
                },
              ],
            },
          ],
        },
        {
          module_id: 2,
          module_name: 'Django Framework',
          is_completed: false,
          is_locked: false,
          topics: [
            {
              topic_id: 3,
              topic_name: 'Django Basics',
              is_completed: true,
              sessions: [
                {
                  session_id: 3,
                  session_title: 'Introduction to Django',
                  topic_name: 'Django Basics',
                  trainer_display_name: 'Dr. Rajesh Kumar',
                  session_datetime: '2026-02-01T15:00:00',
                  session_duration: '90 min',
                  session_mode: 'RECORDING',
                  is_completed: true,
                  has_recording: true,
                  has_materials: true,
                  recording_status: 'AVAILABLE',
                  description: 'Introduction to Django web framework.',
                  objectives: ['Understand Django architecture', 'Create your first Django project'],
                  materials: [
                    { name: 'Django Intro.pdf', type: 'PDF', size: '3.2 MB' },
                  ],
                },
              ],
            },
            {
              topic_id: 4,
              topic_name: 'Django REST Framework',
              is_completed: false,
              sessions: [
                {
                  session_id: 4,
                  session_title: 'Building REST APIs',
                  topic_name: 'Django REST Framework',
                  trainer_display_name: 'Dr. Rajesh Kumar',
                  session_datetime: '2026-02-05T16:00:00',
                  session_duration: '120 min',
                  session_mode: 'RECORDING',
                  is_completed: false,
                  has_recording: true,
                  has_materials: true,
                  recording_status: 'AVAILABLE',
                  description: 'Learn to build REST APIs with Django REST Framework.',
                  objectives: [
                    'Understand REST principles',
                    'Create serializers',
                    'Build API endpoints',
                  ],
                  materials: [
                    { name: 'REST API Guide.pdf', type: 'PDF', size: '4.1 MB' },
                    { name: 'Code Examples.zip', type: 'ZIP', size: '12 MB' },
                  ],
                },
                {
                  session_id: 5,
                  session_title: 'Serializers Deep Dive',
                  topic_name: 'Django REST Framework',
                  trainer_display_name: 'Dr. Rajesh Kumar',
                  session_datetime: '2026-02-12T15:00:00',
                  session_duration: '90 min',
                  session_mode: 'LIVE',
                  is_completed: false,
                  has_recording: false,
                  has_materials: false,
                  recording_status: 'UNAVAILABLE',
                },
                {
                  session_id: 6,
                  session_title: 'Advanced DRF Concepts',
                  topic_name: 'Django REST Framework',
                  trainer_display_name: 'Dr. Rajesh Kumar',
                  session_datetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                  session_duration: '120 min',
                  session_mode: 'LIVE',
                  is_completed: false,
                  has_recording: false,
                  has_materials: false,
                  recording_status: 'UNAVAILABLE',
                },
                {
                  session_id: 7,
                  session_title: 'DRF Authentication & Permissions',
                  topic_name: 'Django REST Framework',
                  trainer_display_name: 'Dr. Rajesh Kumar',
                  session_datetime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                  session_duration: '90 min',
                  session_mode: 'LIVE',
                  is_completed: false,
                  has_recording: false,
                  has_materials: false,
                  recording_status: 'UNAVAILABLE',
                },
              ],
            },
          ],
        },
        {
          module_id: 3,
          module_name: 'Advanced Python Concepts',
          is_completed: false,
          is_locked: true,
          topics: [
            {
              topic_id: 5,
              topic_name: 'Decorators & Generators',
              is_completed: false,
              sessions: [],
            },
          ],
        },
      ],
    },
    15: {
      course_id: 15,
      course_name: 'HTML & CSS Fundamentals',
      course_code: 'WEB-100',
      trainer_name: 'Ms. Amrit Patel',
      completion_percentage: 100,
      modules: [
        {
          module_id: 10,
          module_name: 'HTML Basics',
          is_completed: true,
          is_locked: false,
          topics: [
            {
              topic_id: 10,
              topic_name: 'HTML Elements',
              is_completed: true,
              sessions: [
                {
                  session_id: 10,
                  session_title: 'HTML Structure & Tags',
                  topic_name: 'HTML Elements',
                  trainer_display_name: 'Ms. Amrit Patel',
                  session_datetime: '2026-01-10T10:00:00',
                  session_duration: '60 min',
                  session_mode: 'RECORDING',
                  is_completed: true,
                  has_recording: true,
                  has_materials: true,
                  recording_status: 'AVAILABLE',
                  description: 'Learn HTML basics and structure.',
                  objectives: ['Understand HTML tags', 'Create basic HTML pages'],
                  materials: [
                    { name: 'HTML Basics.pdf', type: 'PDF', size: '2.1 MB' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    18: {
      course_id: 18,
      course_name: 'JavaScript Advanced Concepts',
      course_code: 'JS-201',
      trainer_name: 'Mr. Vikram Singh',
      completion_percentage: 45,
      modules: [
        {
          module_id: 20,
          module_name: 'JavaScript Core',
          is_completed: false,
          is_locked: false,
          topics: [
            {
              topic_id: 20,
              topic_name: 'Async Programming',
              is_completed: false,
              sessions: [
                {
                  session_id: 20,
                  session_title: 'Promises & Async/Await',
                  topic_name: 'Async Programming',
                  trainer_display_name: 'Mr. Vikram Singh',
                  session_datetime: '2026-02-08T14:00:00',
                  session_duration: '75 min',
                  session_mode: 'RECORDING',
                  is_completed: false,
                  has_recording: true,
                  has_materials: true,
                  recording_status: 'AVAILABLE',
                  description: 'Master async programming in JavaScript.',
                  objectives: ['Understand promises', 'Use async/await'],
                  materials: [
                    { name: 'Async Guide.pdf', type: 'PDF', size: '2.8 MB' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  return courses[id] || null;
}
