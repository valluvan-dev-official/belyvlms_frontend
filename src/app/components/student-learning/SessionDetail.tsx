import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  FileText,
  Download,
  Calendar,
  Clock,
  User,
  MessageCircle,
  BookOpen,
} from 'lucide-react';
import { useState } from 'react';

export function SessionDetail() {
  const { courseId, sessionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'recording' | 'materials' | 'assignments' | 'discussion'
  >('overview');

  // Mock session data
  const session = getSessionById(Number(sessionId));

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1A1D1F] mb-2">Session Not Found</h2>
          <button
            onClick={() => navigate(`/learning/course/${courseId}`)}
            className="text-[#4ECDC4] hover:underline"
          >
            Go back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <button
            onClick={() => navigate(`/learning/course/${courseId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Course</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1D1F]">{session.session_title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {session.topic_name} • {session.trainer_name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {session.session_date}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={16} />
                  {session.duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 flex gap-6">
          {(['overview', 'recording', 'materials', 'assignments', 'discussion'] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-[#4ECDC4] text-[#4ECDC4] font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {activeTab === 'overview' && <OverviewTab session={session} />}
        {activeTab === 'recording' && (
          <RecordingTab session={session} courseId={Number(courseId)} />
        )}
        {activeTab === 'materials' && <MaterialsTab session={session} />}
        {activeTab === 'assignments' && <AssignmentsTab />}
        {activeTab === 'discussion' && <DiscussionTab />}
      </div>
    </div>
  );
}

function OverviewTab({ session }: { session: SessionData }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-[#1A1D1F] mb-6">Session Overview</h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Topic</label>
          <p className="text-[#1A1D1F] font-medium">{session.topic_name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Trainer</label>
          <div className="flex items-center gap-2">
            <User size={18} className="text-gray-400" />
            <p className="text-[#1A1D1F] font-medium">{session.trainer_name}</p>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Session Date</label>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <p className="text-[#1A1D1F] font-medium">{session.session_date}</p>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Duration</label>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <p className="text-[#1A1D1F] font-medium">{session.duration}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-[#1A1D1F] mb-3">Description</h3>
        <p className="text-gray-700 leading-relaxed">{session.description}</p>
      </div>

      <div>
        <h3 className="font-semibold text-[#1A1D1F] mb-3">Learning Objectives</h3>
        <ul className="space-y-2">
          {session.objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#4ECDC4] rounded-full mt-2" />
              <span className="text-gray-700">{objective}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecordingTab({
  session,
  courseId,
}: {
  session: SessionData;
  courseId: number;
}) {
  const navigate = useNavigate();

  if (!session.has_recording) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
        <Play size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-[#1A1D1F] mb-2">
          Recording Not Available
        </h3>
        <p className="text-gray-500">
          The recording for this session will be available after the live session.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
        <button
          onClick={() =>
            navigate(`/learning/course/${courseId}/sessions/${session.session_id}/recording`)
          }
          className="w-20 h-20 bg-[#4ECDC4] rounded-full flex items-center justify-center hover:bg-[#44A08D] transition-all transform hover:scale-110"
        >
          <Play size={32} className="text-white ml-1" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#1A1D1F] mb-1">{session.session_title}</h3>
          <p className="text-sm text-gray-500">Duration: {session.duration}</p>
        </div>
        <button
          onClick={() =>
            navigate(`/learning/course/${courseId}/sessions/${session.session_id}/recording`)
          }
          className="px-6 py-3 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Play size={18} />
          Watch Full Recording
        </button>
      </div>
    </div>
  );
}

function MaterialsTab({ session }: { session: SessionData }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-[#1A1D1F] mb-6 flex items-center gap-2">
        <FileText size={24} className="text-[#4ECDC4]" />
        Learning Materials
      </h2>

      <div className="space-y-3">
        {session.materials.map((material, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-[#1A1D1F]">{material.name}</p>
                <p className="text-xs text-gray-500">{material.type} • {material.size}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#44A08D] transition-all">
              <Download size={16} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssignmentsTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-[#1A1D1F] mb-6 flex items-center gap-2">
        <BookOpen size={24} className="text-[#4ECDC4]" />
        Assignments
      </h2>

      <div className="space-y-4">
        <div className="p-5 border-2 border-orange-200 bg-orange-50 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-[#1A1D1F] mb-1">
                Build a REST API with Django
              </h3>
              <p className="text-sm text-gray-600">Due: Feb 20, 2026</p>
            </div>
            <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
              Pending
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Create a complete REST API using Django REST Framework with CRUD operations.
          </p>
          <button className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#44A08D] transition-all">
            Start Assignment
          </button>
        </div>
      </div>
    </div>
  );
}

function DiscussionTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-[#1A1D1F] mb-6 flex items-center gap-2">
        <MessageCircle size={24} className="text-[#4ECDC4]" />
        Discussion Forum
      </h2>

      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              RK
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-[#1A1D1F]">Rahul Kumar</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-700">
                Can someone explain the difference between class-based and function-based views in Django?
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
              DR
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-[#1A1D1F]">Dr. Rajesh Kumar</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  Trainer
                </span>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
              <p className="text-sm text-gray-700">
                Great question! Class-based views provide more structure and reusability...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Types
interface SessionData {
  session_id: number;
  session_title: string;
  topic_name: string;
  trainer_name: string;
  session_date: string;
  duration: string;
  description: string;
  objectives: string[];
  has_recording: boolean;
  materials: Array<{
    name: string;
    type: string;
    size: string;
  }>;
}

// Mock Data
function getSessionById(id: number): SessionData | null {
  const sessions: Record<number, SessionData> = {
    1: {
      session_id: 1,
      session_title: 'Python Setup & First Program',
      topic_name: 'Introduction to Python',
      trainer_name: 'Dr. Rajesh Kumar',
      session_date: 'Jan 15, 2026',
      duration: '45 min',
      description:
        'Learn how to set up Python development environment and write your first Python program. We will cover installation, IDE setup, and basic syntax.',
      objectives: [
        'Install Python and set up development environment',
        'Understand Python syntax basics',
        'Write and execute your first Python program',
        'Learn about Python REPL and script execution',
      ],
      has_recording: true,
      materials: [
        { name: 'Python Setup Guide.pdf', type: 'PDF', size: '2.5 MB' },
        { name: 'First Program Code.py', type: 'Python', size: '1 KB' },
        { name: 'Slides - Session 1.pptx', type: 'PowerPoint', size: '8.2 MB' },
      ],
    },
    4: {
      session_id: 4,
      session_title: 'Building REST APIs',
      topic_name: 'Django REST Framework',
      trainer_name: 'Dr. Rajesh Kumar',
      session_date: 'Feb 5, 2026',
      duration: '120 min',
      description:
        'Deep dive into building REST APIs using Django REST Framework. Learn about serializers, views, and authentication.',
      objectives: [
        'Understand REST API principles',
        'Create serializers for data validation',
        'Build API endpoints with viewsets',
        'Implement authentication and permissions',
      ],
      has_recording: true,
      materials: [
        { name: 'REST API Best Practices.pdf', type: 'PDF', size: '3.8 MB' },
        { name: 'Django REST Code Examples.zip', type: 'ZIP', size: '12 MB' },
      ],
    },
  };

  return sessions[id] || null;
}
