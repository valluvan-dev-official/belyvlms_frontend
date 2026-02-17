// Enterprise-Grade Batch Management API Types
// Strictly aligned with backend API model

export type BatchType = 'WD' | 'WE' | 'WDWE' | 'Hybrid';
export type BatchStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled' | 'on-hold';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// Backend Batch Model
export interface BatchAPI {
  id: string;
  batch_id: string; // Auto-generated: <CategoryInitial><CourseCodeLast2><AlphaSeries>
  course_id: string;
  course_name?: string; // Computed
  course_category?: string; // Computed
  trainer_id: string;
  trainer_name?: string; // Computed
  trainer_type?: 'Full Time' | 'Freelancer'; // Trainer type
  batch_type: BatchType;
  start_date: string; // ISO date
  end_date: string; // ISO date
  tentative_end_date?: string; // Tentative end date
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  hours_per_day: number; // 0.5-24
  days: DayOfWeek[]; // Explicit days array
  status: BatchStatus;
  student_count?: number; // Computed
  batch_completion_percentage?: number; // Batch % completion
  enrolled_students?: string[]; // Student names
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Batch Creation Payload (POST /api/batches/)
export interface BatchCreatePayload {
  course_id: string;
  trainer_id: string;
  batch_type: BatchType;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  hours_per_day: number;
  days: DayOfWeek[];
  status?: BatchStatus; // Default: 'draft'
}

// Batch Update Payload (PUT /api/batches/{id}/)
export interface BatchUpdatePayload {
  trainer_id?: string;
  batch_type?: BatchType;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  hours_per_day?: number;
  days?: DayOfWeek[];
  status?: BatchStatus;
}

// Add Students Payload (POST /api/batches/{id}/add_student/)
export interface AddStudentPayload {
  student_ids: string[];
}

// Category for course selection
export interface CourseCategory {
  id: string;
  code: string; // e.g., "P", "D", "C"
  name: string;
  initial: string; // First letter for batch ID
}

// Course with category info
export interface CourseWithCategory {
  id: string;
  code: string; // e.g., "C2005"
  name: string;
  category_id: string;
  category_name: string;
  category_code: string;
  duration: number;
  is_active: boolean;
}

// Trainer with stack/skills
export interface TrainerAPI {
  id: string;
  name: string;
  email: string;
  stack: string[]; // Courses the trainer can teach
  rating?: number;
  active_batches?: number;
  is_available: boolean;
}

// Student for enrollment
export interface StudentAPI {
  id: string;
  name: string;
  email: string;
  phone?: string;
  enrollment_status?: string;
}

// Time Slot Conflict
export interface TimeSlotConflict {
  batch_id: string;
  batch_name: string;
  trainer_name: string;
  start_time: string;
  end_time: string;
  days: DayOfWeek[];
}

// Batch ID Generation Logic
export interface BatchIDComponents {
  categoryInitial: string; // Single letter from category
  courseCodeLast2: string; // Last 2 digits of course code
  alphaSeries: string; // AA, AB, ..., AZ, then rollover to AA
}

// Form State for Create/Update
export interface BatchFormState {
  course_category?: string;
  course_id: string;
  trainer_id: string;
  batch_type: BatchType;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  hours_per_day: number;
  days: DayOfWeek[];
  status: BatchStatus;
  selected_students: string[];
  batch_id_preview?: string; // Read-only preview
}

// Validation errors
export interface BatchFormErrors {
  course_category?: string;
  course_id?: string;
  trainer_id?: string;
  batch_type?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  hours_per_day?: string;
  days?: string;
  general?: string;
}