// Batch Student Viewer Component
// Tabbed interface for viewing active, inactive students and history

import { useState } from 'react';
import { X, Users, UserX, History, Calendar, TrendingUp, Award } from 'lucide-react';
import { BatchAPI, StudentAPI } from '../../types/batch-api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface BatchStudentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  batch: BatchAPI;
  students: StudentAPI[];
}

type Tab = 'active' | 'inactive' | 'history';

interface StudentHistory {
  studentId: string;
  studentName: string;
  joinDate: string;
  transferHistory: {
    date: string;
    fromBatch: string;
    toBatch: string;
    reason: string;
  }[];
  progressSummary: {
    attendanceRate: number;
    completionRate: number;
    averageScore: number;
  };
}

export function BatchStudentViewer({
  isOpen,
  onClose,
  batch,
  students
}: BatchStudentViewerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('active');

  // Mock data for demonstration
  const activeStudents = students.filter(s => 
    batch.enrolled_students?.includes(s.name) && s.enrollment_status === 'active'
  );

  const inactiveStudents = students.filter(s => 
    batch.enrolled_students?.includes(s.name) && s.enrollment_status !== 'active'
  );

  const studentHistories: StudentHistory[] = activeStudents.map(student => ({
    studentId: student.id,
    studentName: student.name,
    joinDate: '2026-02-01',
    transferHistory: [
      {
        date: '2026-01-15',
        fromBatch: 'D02AF',
        toBatch: batch.batch_id,
        reason: 'Schedule conflict'
      }
    ],
    progressSummary: {
      attendanceRate: Math.floor(Math.random() * 20) + 80,
      completionRate: Math.floor(Math.random() * 30) + 60,
      averageScore: Math.floor(Math.random() * 20) + 75
    }
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="text-green-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Batch Students</h2>
              <p className="text-sm text-gray-600">
                {batch.batch_id} - {batch.course_name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'active'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={16} />
                Active Students
                <Badge className="bg-green-600 text-white border-0 text-xs">
                  {activeStudents.length}
                </Badge>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'inactive'
                  ? 'bg-gray-50 text-gray-700 border-b-2 border-gray-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserX size={16} />
                Inactive Students
                <Badge className="bg-gray-600 text-white border-0 text-xs">
                  {inactiveStudents.length}
                </Badge>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <History size={16} />
                History & Timeline
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'active' && (
            <div className="space-y-3">
              {activeStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Users size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No active students</h3>
                  <p className="text-sm text-gray-600">No students are currently enrolled in this batch</p>
                </div>
              ) : (
                activeStudents.map(student => (
                  <div
                    key={student.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-green-700">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">
                        {student.enrollment_status || 'Active'}
                      </Badge>
                    </div>
                    {student.phone && (
                      <div className="mt-2 text-sm text-gray-600">
                        Phone: {student.phone}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'inactive' && (
            <div className="space-y-3">
              {inactiveStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <UserX size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No inactive students</h3>
                  <p className="text-sm text-gray-600">All enrolled students are currently active</p>
                </div>
              ) : (
                inactiveStudents.map(student => (
                  <div
                    key={student.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow opacity-75"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-700">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700 border-0">
                        {student.enrollment_status || 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {studentHistories.map(history => (
                <div
                  key={history.studentId}
                  className="bg-white border border-gray-200 rounded-lg p-5"
                >
                  {/* Student Header */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-700">
                        {history.studentName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{history.studentName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        Joined: {formatDate(history.joinDate)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-xs text-gray-600">Attendance</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700">
                        {history.progressSummary.attendanceRate}%
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Award size={16} className="text-blue-600" />
                        <span className="text-xs text-gray-600">Completion</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {history.progressSummary.completionRate}%
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Award size={16} className="text-purple-600" />
                        <span className="text-xs text-gray-600">Avg. Score</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">
                        {history.progressSummary.averageScore}%
                      </p>
                    </div>
                  </div>

                  {/* Transfer History */}
                  {history.transferHistory.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Transfer History</h4>
                      <div className="space-y-2">
                        {history.transferHistory.map((transfer, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-gray-200 text-gray-700 border-0 text-xs">
                                  {transfer.fromBatch}
                                </Badge>
                                <span className="text-gray-400">→</span>
                                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                                  {transfer.toBatch}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600">
                                {formatDate(transfer.date)} • {transfer.reason}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
          <Button variant="outline" onClick={onClose} className="px-6">
            Close
          </Button>
        </div>
      </div>
    </>
  );
}
