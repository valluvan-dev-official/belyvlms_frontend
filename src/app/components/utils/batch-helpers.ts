// Batch ID Generation and Validation Helpers
// Format: <CategoryInitial><CourseCodeLast2><AlphaSeries>
// Example: P05AA, D12AB, C07AZ

import { BatchAPI, BatchIDComponents, DayOfWeek, BatchType } from '../types/batch-api';

/**
 * Generate batch ID preview
 * @param categoryInitial - Single letter from category (e.g., "P" from "Programming")
 * @param courseCode - Full course code (e.g., "C2005")
 * @param existingBatches - List of existing batches to determine next alpha series
 * @returns Batch ID string (e.g., "P05AA")
 */
export function generateBatchID(
  categoryInitial: string,
  courseCode: string,
  existingBatches: BatchAPI[]
): string {
  // Extract last 2 digits from course code
  const courseCodeMatch = courseCode.match(/(\d{2,})$/);
  if (!courseCodeMatch) {
    throw new Error('Invalid course code format');
  }
  
  const courseDigits = courseCodeMatch[1];
  const last2Digits = courseDigits.slice(-2).padStart(2, '0');
  
  // Generate alpha series
  const alphaSeries = generateAlphaSeries(categoryInitial, last2Digits, existingBatches);
  
  return `${categoryInitial}${last2Digits}${alphaSeries}`;
}

/**
 * Generate next alpha series (AA → AB → ... → AZ → AA)
 * @param categoryInitial - Category initial letter
 * @param courseCodeLast2 - Last 2 digits of course code
 * @param existingBatches - Existing batches to check for next available series
 * @returns Alpha series string (e.g., "AA", "AB")
 */
function generateAlphaSeries(
  categoryInitial: string,
  courseCodeLast2: string,
  existingBatches: BatchAPI[]
): string {
  const prefix = `${categoryInitial}${courseCodeLast2}`;
  
  // Find all batches with same prefix
  const matchingBatches = existingBatches.filter(batch =>
    batch.batch_id.startsWith(prefix)
  );
  
  if (matchingBatches.length === 0) {
    return 'AA';
  }
  
  // Extract existing alpha series
  const existingSeries = matchingBatches
    .map(batch => batch.batch_id.slice(prefix.length))
    .filter(series => /^[A-Z]{2}$/.test(series))
    .sort();
  
  // Find next available series
  return getNextAlphaSeries(existingSeries);
}

/**
 * Get next alpha series with rollover logic
 */
function getNextAlphaSeries(existingSeries: string[]): string {
  if (existingSeries.length === 0) {
    return 'AA';
  }
  
  const lastSeries = existingSeries[existingSeries.length - 1];
  
  // Convert to numbers: AA = 0, AB = 1, ..., AZ = 25, BA = 26, ...
  const lastNumber = alphaToNumber(lastSeries);
  const nextNumber = lastNumber + 1;
  
  // Rollover after ZZ (675) back to AA
  const normalizedNumber = nextNumber % 676; // 26*26 = 676 combinations
  
  return numberToAlpha(normalizedNumber);
}

/**
 * Convert alpha series to number (AA=0, AB=1, ..., ZZ=675)
 */
function alphaToNumber(alpha: string): number {
  const first = alpha.charCodeAt(0) - 65; // A=0, B=1, ...
  const second = alpha.charCodeAt(1) - 65;
  return first * 26 + second;
}

/**
 * Convert number to alpha series (0=AA, 1=AB, ..., 675=ZZ)
 */
function numberToAlpha(num: number): string {
  const first = Math.floor(num / 26);
  const second = num % 26;
  return String.fromCharCode(65 + first) + String.fromCharCode(65 + second);
}

/**
 * Get default days based on batch type
 */
export function getDefaultDays(batchType: BatchType): DayOfWeek[] {
  switch (batchType) {
    case 'WD':
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    case 'WE':
      return ['Saturday', 'Sunday'];
    case 'WDWE':
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    case 'Hybrid':
      return ['Monday', 'Wednesday', 'Friday']; // Default hybrid pattern
    default:
      return [];
  }
}

/**
 * Validate if trainer has time conflict
 */
export function hasTrainerConflict(
  trainerId: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  days: DayOfWeek[],
  existingBatches: BatchAPI[],
  excludeBatchId?: string
): boolean {
  const trainerBatches = existingBatches.filter(
    batch => batch.trainer_id === trainerId &&
    batch.status === 'active' &&
    batch.id !== excludeBatchId
  );
  
  for (const batch of trainerBatches) {
    // Check date overlap
    const hasDateOverlap = 
      (startDate <= batch.end_date && endDate >= batch.start_date);
    
    if (!hasDateOverlap) continue;
    
    // Check day overlap
    const hasDayOverlap = days.some(day => batch.days.includes(day));
    
    if (!hasDayOverlap) continue;
    
    // Check time overlap
    const hasTimeOverlap = 
      (startTime < batch.end_time && endTime > batch.start_time);
    
    if (hasTimeOverlap) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get conflicting batches for a trainer
 */
export function getConflictingBatches(
  trainerId: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  days: DayOfWeek[],
  existingBatches: BatchAPI[],
  excludeBatchId?: string
): BatchAPI[] {
  const conflicts: BatchAPI[] = [];
  
  const trainerBatches = existingBatches.filter(
    batch => batch.trainer_id === trainerId &&
    batch.status === 'active' &&
    batch.id !== excludeBatchId
  );
  
  for (const batch of trainerBatches) {
    const hasDateOverlap = 
      (startDate <= batch.end_date && endDate >= batch.start_date);
    
    if (!hasDateOverlap) continue;
    
    const hasDayOverlap = days.some(day => batch.days.includes(day));
    
    if (!hasDayOverlap) continue;
    
    const hasTimeOverlap = 
      (startTime < batch.end_time && endTime > batch.start_time);
    
    if (hasTimeOverlap) {
      conflicts.push(batch);
    }
  }
  
  return conflicts;
}

/**
 * Validate form data
 */
export function validateBatchForm(formData: {
  course_id: string;
  trainer_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  hours_per_day: number;
  days: DayOfWeek[];
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (!formData.course_id) {
    errors.course_id = 'Course is required';
  }
  
  if (!formData.trainer_id) {
    errors.trainer_id = 'Trainer is required';
  }
  
  if (!formData.start_date) {
    errors.start_date = 'Start date is required';
  }
  
  if (!formData.end_date) {
    errors.end_date = 'End date is required';
  }
  
  if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
    errors.end_date = 'End date must be after start date';
  }
  
  if (!formData.start_time) {
    errors.start_time = 'Start time is required';
  }
  
  if (!formData.end_time) {
    errors.end_time = 'End time is required';
  }
  
  if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
    errors.end_time = 'End time must be after start time';
  }
  
  if (formData.hours_per_day < 0.5 || formData.hours_per_day > 24) {
    errors.hours_per_day = 'Hours per day must be between 0.5 and 24';
  }
  
  if (formData.days.length === 0) {
    errors.days = 'At least one day must be selected';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Format time for display (HH:MM to 12-hour format)
 */
export function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
    'on-hold': 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
