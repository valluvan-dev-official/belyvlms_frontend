// Enterprise Batch Management Side Drawer
// Aligned with backend API - No manual batch name field

import { useState, useEffect, Fragment } from 'react';
import { X, AlertCircle, CheckCircle2, Calendar, Clock, Users, BookOpen, User, Save } from 'lucide-react';
import { 
  BatchAPI, 
  BatchFormState, 
  BatchFormErrors, 
  CourseCategory, 
  CourseWithCategory, 
  TrainerAPI, 
  StudentAPI,
  BatchType,
  DayOfWeek,
  BatchStatus
} from '../../types/batch-api';
import {
  generateBatchID,
  getDefaultDays,
  hasTrainerConflict,
  validateBatchForm,
  formatTime12Hour,
  getStatusColor
} from '../utils/batch-helpers';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';

interface BatchManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  batch?: BatchAPI | null;
  categories: CourseCategory[];
  courses: CourseWithCategory[];
  trainers: TrainerAPI[];
  students: StudentAPI[];
  existingBatches: BatchAPI[];
  onSave: (batch: BatchAPI) => Promise<void>;
  onAddStudents?: (batchId: string, studentIds: string[]) => Promise<void>;
}

const BATCH_TYPES: BatchType[] = ['WD', 'WE', 'WDWE', 'Hybrid'];
const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function BatchManagementDrawer({
  isOpen,
  onClose,
  mode,
  batch,
  categories,
  courses,
  trainers,
  students,
  existingBatches,
  onSave,
  onAddStudents
}: BatchManagementDrawerProps) {
  const [formData, setFormData] = useState<BatchFormState>({
    course_category: '',
    course_id: '',
    trainer_id: '',
    batch_type: 'WD',
    start_date: '',
    end_date: '',
    start_time: '09:00',
    end_time: '17:00',
    hours_per_day: 8,
    days: [],
    status: 'draft',
    selected_students: [],
    batch_id_preview: ''
  });

  const [errors, setErrors] = useState<BatchFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<CourseWithCategory[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<TrainerAPI[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithCategory | null>(null);

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && batch) {
      const course = courses.find(c => c.id === batch.course_id);
      setFormData({
        course_category: course?.category_id || '',
        course_id: batch.course_id,
        trainer_id: batch.trainer_id,
        batch_type: batch.batch_type,
        start_date: batch.start_date,
        end_date: batch.end_date,
        start_time: batch.start_time,
        end_time: batch.end_time,
        hours_per_day: batch.hours_per_day,
        days: batch.days,
        status: batch.status,
        selected_students: [],
        batch_id_preview: batch.batch_id
      });
      if (course) {
        setSelectedCourse(course);
      }
    } else {
      // Reset for create mode
      setFormData({
        course_category: '',
        course_id: '',
        trainer_id: '',
        batch_type: 'WD',
        start_date: '',
        end_date: '',
        start_time: '09:00',
        end_time: '17:00',
        hours_per_day: 8,
        days: [],
        status: 'draft',
        selected_students: [],
        batch_id_preview: ''
      });
      setSelectedCourse(null);
    }
    setErrors({});
  }, [mode, batch, courses, isOpen]);

  // Filter courses by category
  useEffect(() => {
    if (formData.course_category) {
      const filtered = courses.filter(c => c.category_id === formData.course_category && c.is_active);
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [formData.course_category, courses]);

  // Generate batch ID preview and filter trainers when course is selected
  useEffect(() => {
    if (formData.course_id) {
      const course = courses.find(c => c.id === formData.course_id);
      if (course) {
        setSelectedCourse(course);
        
        // Generate batch ID preview (only in create mode)
        if (mode === 'create') {
          const category = categories.find(cat => cat.id === course.category_id);
          if (category) {
            try {
              const batchId = generateBatchID(category.initial, course.code, existingBatches);
              setFormData(prev => ({ ...prev, batch_id_preview: batchId }));
            } catch (error) {
              console.error('Error generating batch ID:', error);
            }
          }
        }
        
        // Filter trainers by course in their stack
        const eligible = trainers.filter(trainer => 
          trainer.stack.includes(course.name) && trainer.is_available
        );
        setFilteredTrainers(eligible);
      }
    } else {
      setSelectedCourse(null);
      setFilteredTrainers([]);
      if (mode === 'create') {
        setFormData(prev => ({ ...prev, batch_id_preview: '' }));
      }
    }
  }, [formData.course_id, courses, categories, trainers, existingBatches, mode]);

  // Auto-default days when batch type changes
  useEffect(() => {
    if (formData.batch_type) {
      const defaultDays = getDefaultDays(formData.batch_type);
      setFormData(prev => ({ ...prev, days: defaultDays }));
    }
  }, [formData.batch_type]);

  const handleInputChange = (field: keyof BatchFormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof BatchFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDayToggle = (day: DayOfWeek) => {
    const currentDays = formData.days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    handleInputChange('days', newDays);
  };

  const handleStudentToggle = (studentId: string) => {
    const current = formData.selected_students;
    const updated = current.includes(studentId)
      ? current.filter(id => id !== studentId)
      : [...current, studentId];
    handleInputChange('selected_students', updated);
  };

  const handleSubmit = async () => {
    // Validate form
    const validation = validateBatchForm({
      course_id: formData.course_id,
      trainer_id: formData.trainer_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      hours_per_day: formData.hours_per_day,
      days: formData.days
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Please fix all validation errors');
      return;
    }

    // Check trainer conflicts
    const hasConflict = hasTrainerConflict(
      formData.trainer_id,
      formData.start_date,
      formData.end_date,
      formData.start_time,
      formData.end_time,
      formData.days,
      existingBatches,
      batch?.id
    );

    if (hasConflict) {
      setErrors(prev => ({
        ...prev,
        trainer_id: 'Trainer has conflicting batches in this time slot'
      }));
      toast.error('Trainer time conflict detected');
      return;
    }

    setLoading(true);

    try {
      const course = courses.find(c => c.id === formData.course_id);
      const trainer = trainers.find(t => t.id === formData.trainer_id);

      const batchData: BatchAPI = {
        id: batch?.id || `temp-${Date.now()}`,
        batch_id: mode === 'edit' ? batch!.batch_id : formData.batch_id_preview!,
        course_id: formData.course_id,
        course_name: course?.name,
        course_category: course?.category_name,
        trainer_id: formData.trainer_id,
        trainer_name: trainer?.name,
        batch_type: formData.batch_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        hours_per_day: formData.hours_per_day,
        days: formData.days,
        status: formData.status,
        student_count: formData.selected_students.length,
        created_at: batch?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: batch?.created_by || 'current-user@belyv.com'
      };

      // Save batch
      await onSave(batchData);

      // Add students if selected (only in create mode)
      if (mode === 'create' && formData.selected_students.length > 0 && onAddStudents) {
        await onAddStudents(batchData.id, formData.selected_students);
      }

      toast.success(`Batch ${batchData.batch_id} ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      onClose();
    } catch (error) {
      console.error('Error saving batch:', error);
      toast.error(`Failed to ${mode} batch`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Create New Batch' : 'Edit Batch'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Configure batch settings and auto-generate Batch ID' 
                : 'Update batch configuration and assignments'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Batch ID Preview Badge (Create Mode) */}
        {mode === 'create' && formData.batch_id_preview && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-blue-600" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-900">Batch ID Preview</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-mono font-bold text-blue-600">
                    {formData.batch_id_preview}
                  </span>
                  <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                    Auto-generated on save
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batch ID Badge (Edit Mode) */}
        {mode === 'edit' && batch && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Batch ID</p>
                <span className="text-2xl font-mono font-bold text-gray-900">
                  {batch.batch_id}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(batch.status)}`}>
                {batch.status.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Step 1: Course Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <BookOpen size={16} />
              Course Category *
            </Label>
            <Select
              value={formData.course_category}
              onValueChange={(value) => {
                handleInputChange('course_category', value);
                handleInputChange('course_id', ''); // Reset course selection
              }}
              disabled={mode === 'edit'}
            >
              <SelectTrigger className={errors.course_category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name} ({cat.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.course_category && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.course_category}
              </p>
            )}
          </div>

          {/* Step 2: Course Selection */}
          {formData.course_category && (
            <div className="space-y-2">
              <Label htmlFor="course" className="flex items-center gap-2">
                <BookOpen size={16} />
                Course *
              </Label>
              <Select
                value={formData.course_id}
                onValueChange={(value) => handleInputChange('course_id', value)}
                disabled={mode === 'edit'}
              >
                <SelectTrigger className={errors.course_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCourses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course_id && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.course_id}
                </p>
              )}
            </div>
          )}

          {/* Step 3: Trainer Selection */}
          {formData.course_id && (
            <div className="space-y-2">
              <Label htmlFor="trainer" className="flex items-center gap-2">
                <User size={16} />
                Trainer * {filteredTrainers.length > 0 && `(${filteredTrainers.length} eligible)`}
              </Label>
              <Select
                value={formData.trainer_id}
                onValueChange={(value) => handleInputChange('trainer_id', value)}
              >
                <SelectTrigger className={errors.trainer_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select trainer" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTrainers.map(trainer => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.name} - {trainer.rating}⭐ ({trainer.active_batches} active)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.trainer_id && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.trainer_id}
                </p>
              )}
              {filteredTrainers.length === 0 && formData.course_id && (
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <AlertCircle size={14} /> No trainers available for this course
                </p>
              )}
            </div>
          )}

          {/* Step 4: Batch Type */}
          <div className="space-y-2">
            <Label htmlFor="batch_type">Batch Type *</Label>
            <Select
              value={formData.batch_type}
              onValueChange={(value) => handleInputChange('batch_type', value as BatchType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WD">Weekday (Mon-Fri)</SelectItem>
                <SelectItem value="WE">Weekend (Sat-Sun)</SelectItem>
                <SelectItem value="WDWE">Full Week (Mon-Sun)</SelectItem>
                <SelectItem value="Hybrid">Hybrid (Custom)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Step 5: Days Selection */}
          <div className="space-y-2">
            <Label>Days *</Label>
            <div className="grid grid-cols-2 gap-2">
              {DAYS_OF_WEEK.map(day => (
                <label
                  key={day}
                  className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    checked={formData.days.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <span className="text-sm">{day}</span>
                </label>
              ))}
            </div>
            {errors.days && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.days}
              </p>
            )}
          </div>

          {/* Step 6: Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="flex items-center gap-2">
                <Calendar size={16} />
                Start Date *
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className={errors.start_date ? 'border-red-500' : ''}
              />
              {errors.start_date && (
                <p className="text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="flex items-center gap-2">
                <Calendar size={16} />
                End Date *
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className={errors.end_date ? 'border-red-500' : ''}
              />
              {errors.end_date && (
                <p className="text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Step 7: Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="flex items-center gap-2">
                <Clock size={16} />
                Start Time *
              </Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                className={errors.start_time ? 'border-red-500' : ''}
              />
              {errors.start_time && (
                <p className="text-sm text-red-600">{errors.start_time}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time" className="flex items-center gap-2">
                <Clock size={16} />
                End Time *
              </Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                className={errors.end_time ? 'border-red-500' : ''}
              />
              {errors.end_time && (
                <p className="text-sm text-red-600">{errors.end_time}</p>
              )}
            </div>
          </div>

          {/* Step 8: Hours Per Day */}
          <div className="space-y-2">
            <Label htmlFor="hours_per_day">Hours Per Day *</Label>
            <Input
              id="hours_per_day"
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              value={formData.hours_per_day}
              onChange={(e) => handleInputChange('hours_per_day', parseFloat(e.target.value))}
              className={errors.hours_per_day ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-500">Must be between 0.5 and 24 hours</p>
            {errors.hours_per_day && (
              <p className="text-sm text-red-600">{errors.hours_per_day}</p>
            )}
          </div>

          {/* Step 9: Status (Edit mode only) */}
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value as BatchStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 10: Students (Create mode only) */}
          {mode === 'create' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users size={16} />
                Add Students (Optional)
              </Label>
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                {students.length === 0 ? (
                  <p className="text-sm text-gray-500">No students available</p>
                ) : (
                  students.map(student => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <Checkbox
                        checked={formData.selected_students.includes(student.id)}
                        onCheckedChange={() => handleStudentToggle(student.id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{student.enrollment_status}</span>
                    </label>
                  ))
                )}
              </div>
              {formData.selected_students.length > 0 && (
                <p className="text-sm text-gray-600">
                  {formData.selected_students.length} student(s) selected
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.course_id || !formData.trainer_id}
            className="gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {mode === 'create' ? 'Create Batch' : 'Update Batch'}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
