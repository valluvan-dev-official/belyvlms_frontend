// Add Student to Batch - Simple Modal Design
// Matches exact UI specification with multi-select dropdown

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BatchAPI, StudentAPI } from '../../types/batch-api';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface AddStudentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  batch: BatchAPI;
  students: StudentAPI[];
  existingBatches: BatchAPI[];
  onAddStudents: (batchId: string, studentIds: string[]) => Promise<void>;
}

export function AddStudentDrawer({
  isOpen,
  onClose,
  batch,
  students,
  existingBatches,
  onAddStudents
}: AddStudentDrawerProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStudents([]);
      setSearchQuery('');
    }
  }, [isOpen]);

  // Get students already enrolled in this batch
  const enrolledInCurrentBatch = new Set(
    batch.enrolled_students?.map(name => 
      students.find(s => s.name === name)?.id
    ).filter(Boolean) || []
  );

  // Get students already active in other batches
  const studentsInOtherBatches = new Map<string, string>();
  existingBatches.forEach(b => {
    if (b.id !== batch.id && b.status === 'active') {
      b.enrolled_students?.forEach(studentName => {
        const student = students.find(s => s.name === studentName);
        if (student) {
          studentsInOtherBatches.set(student.id, b.batch_id);
        }
      });
    }
  });

  // Filter available students
  const availableStudents = students.filter(student => 
    !enrolledInCurrentBatch.has(student.id) &&
    !studentsInOtherBatches.has(student.id)
  );

  const filteredStudents = availableStudents.filter(student =>
    searchQuery === '' ||
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    setLoading(true);
    try {
      await onAddStudents(batch.id, selectedStudents);
      toast.success(`${selectedStudents.length} student(s) added to ${batch.batch_id}`);
      onClose();
    } catch (error) {
      toast.error('Failed to add students');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-[630px] m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add Students to Batch</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-5">
            {/* Select Students */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Select Students
              </label>
              <div className="relative">
                <div
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer min-h-[42px] flex items-center"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedStudents.length === 0 ? (
                    <span className="text-gray-400">Select students</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedStudents.slice(0, 2).map(studentId => (
                        <span key={studentId} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                          {students.find(s => s.id === studentId)?.name}
                        </span>
                      ))}
                      {selectedStudents.length > 2 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                          +{selectedStudents.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[280px] overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Searching..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border-0 focus:outline-none text-gray-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Student List */}
                    <div className="overflow-y-auto max-h-[220px]">
                      {filteredStudents.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No students available
                        </div>
                      ) : (
                        filteredStudents.map(student => (
                          <div
                            key={student.id}
                            className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                              selectedStudents.includes(student.id) ? 'bg-blue-100' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStudent(student.id);
                            }}
                          >
                            <div className="text-sm text-gray-900">
                              {student.id} - {student.name}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="px-6 bg-gray-400 hover:bg-gray-500 text-white border-0"
            >
              Close
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || selectedStudents.length === 0}
              className="px-6 bg-blue-900 hover:bg-blue-950 text-white"
            >
              {loading ? 'Adding...' : 'Add Students'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}