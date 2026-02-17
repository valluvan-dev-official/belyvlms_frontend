import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Maximize,
  Settings,
  ChevronRight,
  BookOpen,
  FileText,
  Download,
  X,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function RecordingPlayer() {
  const { courseId, sessionId } = useParams();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600); // 60 minutes
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [showNotes, setShowNotes] = useState(true);
  const [showResources, setShowResources] = useState(false);
  
  const videoRef = useRef<HTMLDivElement>(null);

  // Auto-save progress every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        // Save progress to backend/localStorage
        console.log('Auto-saving progress:', currentTime);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            clearInterval(timer);
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const addNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: Date.now(),
        timestamp: currentTime,
        text: currentNote,
        createdAt: new Date().toISOString(),
      };
      setNotes([...notes, newNote]);
      setCurrentNote('');
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const jumpToTimestamp = (timestamp: number) => {
    setCurrentTime(timestamp);
  };

  // Mock session data
  const session = {
    session_id: Number(sessionId),
    title: 'Building REST APIs with Django REST Framework',
    course_name: 'Python Programming Basics',
    module: 'Django Framework',
    topic: 'Django REST Framework',
    trainer: 'Dr. Rajesh Kumar',
    chapters: [
      { id: 1, title: 'Introduction to REST', timestamp: 0 },
      { id: 2, title: 'Setting up Django REST Framework', timestamp: 300 },
      { id: 3, title: 'Creating Serializers', timestamp: 900 },
      { id: 4, title: 'Building API Endpoints', timestamp: 1800 },
      { id: 5, title: 'Authentication & Permissions', timestamp: 2700 },
    ],
    resources: [
      { id: 1, name: 'REST API Slides.pdf', type: 'PDF', size: '3.2 MB' },
      { id: 2, name: 'Code Examples.zip', type: 'ZIP', size: '8.5 MB' },
      { id: 3, name: 'API Documentation.pdf', type: 'PDF', size: '1.8 MB' },
    ],
  };

  const getCurrentChapter = () => {
    const chapter = session.chapters
      .slice()
      .reverse()
      .find((ch) => currentTime >= ch.timestamp);
    return chapter || session.chapters[0];
  };

  return (
    <div className="min-h-screen bg-[#1A1D1F] text-white">
      {/* Minimal Top Bar */}
      <div className="bg-black/40 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(`/learning/course/${courseId}/sessions/${sessionId}`)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Session</span>
        </button>
        <div className="text-center flex-1">
          <h2 className="text-sm font-medium text-white">{session.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {session.module} • {session.topic}
          </p>
        </div>
        <div className="w-32" /> {/* Spacer for center alignment */}
      </div>

      {/* Main Player Layout */}
      <div className="grid grid-cols-12 gap-0 h-[calc(100vh-56px)]">
        {/* Video Player Section */}
        <div className="col-span-9 bg-black flex flex-col">
          {/* Video Area */}
          <div
            ref={videoRef}
            className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black relative"
          >
            {/* Simulated Video Player */}
            <div className="text-center">
              <div className="mb-4">
                <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play size={40} className="text-white ml-2" />
                </div>
              </div>
              <p className="text-gray-400">Video Player</p>
              <p className="text-sm text-gray-500 mt-1">
                Chapter: {getCurrentChapter().title}
              </p>
            </div>

            {/* Chapter Markers Overlay */}
            <div className="absolute bottom-20 left-0 right-0 px-12">
              <div className="relative h-1 bg-white/20 rounded-full">
                {session.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => jumpToTimestamp(chapter.timestamp)}
                    className="absolute w-3 h-3 bg-[#4ECDC4] rounded-full -top-1 hover:scale-125 transition-transform"
                    style={{
                      left: `${(chapter.timestamp / duration) * 100}%`,
                    }}
                    title={chapter.title}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="bg-black/60 backdrop-blur-md px-6 py-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="relative h-1 bg-white/20 rounded-full group cursor-pointer">
                <div
                  className="absolute h-1 bg-[#4ECDC4] rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div
                  className="absolute w-4 h-4 bg-[#4ECDC4] rounded-full -top-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  {isPlaying ? (
                    <Pause size={20} className="text-black" />
                  ) : (
                    <Play size={20} className="text-black ml-0.5" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <Volume2 size={20} className="text-white" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-20 h-1 accent-[#4ECDC4]"
                  />
                </div>

                <div className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Playback Speed */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  >
                    {playbackSpeed}x
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-xl py-2 min-w-[100px]">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            setShowSpeedMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 ${
                            playbackSpeed === speed ? 'text-[#4ECDC4]' : 'text-white'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Settings size={20} />
                </button>

                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Notes & Resources */}
        <div className="col-span-3 bg-[#25292C] flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => {
                setShowNotes(true);
                setShowResources(false);
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                showNotes
                  ? 'bg-[#1A1D1F] text-[#4ECDC4] border-b-2 border-[#4ECDC4]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen size={16} className="inline mr-2" />
              Notes
            </button>
            <button
              onClick={() => {
                setShowNotes(false);
                setShowResources(true);
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                showResources
                  ? 'bg-[#1A1D1F] text-[#4ECDC4] border-b-2 border-[#4ECDC4]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText size={16} className="inline mr-2" />
              Resources
            </button>
          </div>

          {/* Notes Panel */}
          {showNotes && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chapter Timeline */}
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase">
                  Chapter Timeline
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {session.chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => jumpToTimestamp(chapter.timestamp)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                        currentTime >= chapter.timestamp &&
                        (session.chapters[chapter.id] === undefined ||
                          currentTime < session.chapters[chapter.id].timestamp)
                          ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]'
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]">{formatTime(chapter.timestamp)}</span>
                        <ChevronRight size={12} />
                      </div>
                      <div className="mt-1">{chapter.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase">
                  My Notes ({notes.length})
                </h3>
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No notes yet. Start taking notes!
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-[#1A1D1F] p-3 rounded-lg hover:bg-[#1F2326] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <button
                            onClick={() => jumpToTimestamp(note.timestamp)}
                            className="text-xs text-[#4ECDC4] hover:underline"
                          >
                            {formatTime(note.timestamp)}
                          </button>
                          <button className="text-gray-500 hover:text-white">
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-300">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Note Input */}
              <div className="p-4 border-t border-gray-700">
                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Add a note at current timestamp..."
                  className="w-full bg-[#1A1D1F] border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:border-[#4ECDC4] focus:outline-none resize-none"
                  rows={3}
                />
                <button
                  onClick={addNote}
                  disabled={!currentNote.trim()}
                  className="w-full mt-2 px-4 py-2 bg-[#4ECDC4] text-white rounded-lg font-medium hover:bg-[#44A08D] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add Note at {formatTime(currentTime)}
                </button>
              </div>
            </div>
          )}

          {/* Resources Panel */}
          {showResources && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-xs font-semibold text-gray-400 mb-4 uppercase">
                Learning Materials
              </h3>
              <div className="space-y-3">
                {session.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-[#1A1D1F] p-4 rounded-lg hover:bg-[#1F2326] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={20} className="text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm mb-1 truncate">
                          {resource.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {resource.type} • {resource.size}
                        </p>
                      </div>
                    </div>
                    <button className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-[#4ECDC4] text-white rounded-lg text-sm font-medium hover:bg-[#44A08D] transition-all">
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Note {
  id: number;
  timestamp: number;
  text: string;
  createdAt: string;
}
