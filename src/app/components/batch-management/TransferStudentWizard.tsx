// Transfer Students - Simple Modal Design
// Clean form with student selection, target batch, and reason

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BatchAPI, StudentAPI } from '../../types/batch-api';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface TransferStudentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  sourceBatch: BatchAPI;
  allBatches: BatchAPI[];
  students: StudentAPI[];
  onTransfer: (sourceBatchId: string, destBatchId: string, studentIds: string[]) => Promise<void>;
}

export function TransferStudentWizard({
  isOpen,
  onClose,
  sourceBatch,
  allBatches,
  students,
  onTransfer
}: TransferStudentWizardProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [targetBatchId, setTargetBatchId] = useState('');
  const [reason, setReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStudents([]);
      setTargetBatchId('');
      setReason('');
      setSearchQuery('');
    }
  }, [isOpen]);

  // Get eligible destination batches
  const eligibleBatches = allBatches.filter(
    b => b.id !== sourceBatch.id && 
         b.course_id === sourceBatch.course_id && 
         (b.status === 'active' || b.status === 'scheduled')
  );

  // Get active students from source batch
  const sourceStudents = students.filter(s =>
    sourceBatch.enrolled_students?.includes(s.name)
  );

  const filteredStudents = sourceStudents.filter(student =>
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
    if (!targetBatchId) {
      toast.error('Please select a target batch');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for transfer');
      return;
    }

    setLoading(true);
    try {
      await onTransfer(sourceBatch.id, targetBatchId, selectedStudents);
      toast.success(`Transfer request submitted for ${selectedStudents.length} student(s)`);
      onClose();
    } catch (error) {
      toast.error('Failed to submit transfer request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-[630px] m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Transfer Students</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer min-h-[100px] flex items-start"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedStudents.length === 0 ? (
                    <span className="text-gray-400"></span>
                  ) : (
                    <div className="flex flex-wrap gap-1 w-full">
                      {selectedStudents.map(studentId => {
                        const student = students.find(s => s.id === studentId);
                        return (
                          <span key={studentId} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                            {student?.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[280px] overflow-hidden">
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

            {/* Target Batch */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Target Batch
              </label>
              <Select value={targetBatchId} onValueChange={setTargetBatchId}>
                <SelectTrigger className="w-full bg-white border-gray-300">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleBatches.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No eligible batches available
                    </div>
                  ) : (
                    eligibleBatches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.batch_id} - {batch.course_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Reason
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder=""
                className="w-full min-h-[120px] border-gray-300 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading || selectedStudents.length === 0 || !targetBatchId || !reason.trim()}
              className="px-6 bg-blue-900 hover:bg-blue-950 text-white"
            >
              {loading ? 'Submitting...' : 'Submit Transfer'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
