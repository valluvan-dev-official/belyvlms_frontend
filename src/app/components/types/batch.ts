// Batch Management Type Definitions

export type BatchStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'on-hold';

export type DeliveryMode = 'online' | 'offline' | 'hybrid';
export type TrainingFormat = 'instructor-led' | 'self-paced' | 'blended';
export type SessionFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'dropped';
export type ScheduleConflictType = 'trainer' | 'student' | 'resource';

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  deliveryMode: DeliveryMode;
  status: BatchStatus;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  waitlistCount: number;
  location?: string;
  virtualPlatform?: string;
  trainingFormat: TrainingFormat;
  sessionFrequency: SessionFrequency;
  timezone: string;
  primaryTrainerId: string;
  primaryTrainerName: string;
  backupTrainerId?: string;
  backupTrainerName?: string;
  completionRate: number;
  attendanceRate: number;
  dropoutRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface BatchCreationForm {
  // Step 1 - Batch Information
  name: string;
  courseId: string;
  deliveryMode: DeliveryMode;
  startDate: string;
  endDate: string;
  capacity: number;
  location?: string;
  virtualPlatform?: string;
  
  // Step 2 - Delivery Configuration
  trainingFormat: TrainingFormat;
  sessionFrequency: SessionFrequency;
  assessmentPlanId?: string;
  resourceMappings: string[];
  
  // Step 3 - Trainer Assignment
  primaryTrainerId: string;
  backupTrainerId?: string;
  
  // Step 4 - Schedule Planning
  timezone: string;
  schedules: BatchSchedule[];
  
  // Step 5 - Review (computed)
}

export interface BatchSchedule {
  id: string;
  batchId: string;
  sessionNumber: number;
  sessionTitle: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  trainerId: string;
  trainerName: string;
  location?: string;
  virtualLink?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  attendanceCount: number;
  completionStatus: boolean;
  conflicts: ScheduleConflict[];
}

export interface ScheduleConflict {
  type: ScheduleConflictType;
  severity: 'low' | 'medium' | 'high';
  message: string;
  resourceId: string;
  resourceName: string;
  conflictingBatchId?: string;
  conflictingBatchName?: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  batchId: string;
  batchName: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
  approvedBy?: string;
  approvedAt?: string;
  progressPercentage: number;
  attendancePercentage: number;
  lastActiveDate: string;
  riskScore: number;
  waitlistPosition?: number;
}

export interface TrainerAssignment {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerEmail: string;
  batchId: string;
  batchName: string;
  role: 'primary' | 'backup';
  assignedDate: string;
  assignedBy: string;
  workloadHours: number;
  conflictCount: number;
  performanceScore: number;
  status: 'active' | 'replaced' | 'completed';
}

export interface TrainerWorkload {
  trainerId: string;
  trainerName: string;
  totalBatches: number;
  activeBatches: number;
  totalStudents: number;
  weeklyHours: number;
  monthlyHours: number;
  utilizationRate: number;
  performanceScore: number;
  conflictCount: number;
  availability: TrainerAvailability[];
}

export interface TrainerAvailability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface BatchAuditLog {
  id: string;
  batchId: string;
  batchName: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'enrollment' | 'schedule' | 'trainer-assignment';
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  changes: AuditChange[];
  impactLevel: 'low' | 'medium' | 'high';
  reason?: string;
}

export interface AuditChange {
  field: string;
  oldValue: string;
  newValue: string;
  impactDescription: string;
}

export interface BatchAnalytics {
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  totalStudents: number;
  averageCapacityUtilization: number;
  averageAttendanceRate: number;
  averageCompletionRate: number;
  dropoutRate: number;
  trainerUtilizationRate: number;
  batchesByStatus: Record<BatchStatus, number>;
  batchesByDeliveryMode: Record<DeliveryMode, number>;
  monthlyBatchTrend: MonthlyBatchData[];
  topPerformingBatches: Batch[];
  atRiskBatches: Batch[];
}

export interface MonthlyBatchData {
  month: string;
  created: number;
  completed: number;
  cancelled: number;
  averageAttendance: number;
}

export interface BatchTransferRequest {
  id: string;
  studentId: string;
  studentName: string;
  fromBatchId: string;
  fromBatchName: string;
  toBatchId: string;
  toBatchName: string;
  requestDate: string;
  requestedBy: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  progressMigration: boolean;
  attendanceMigration: boolean;
  impactAnalysis: TransferImpact;
}

export interface TransferImpact {
  currentProgress: number;
  attendanceRecord: number;
  assessmentScores: number;
  targetBatchCompatibility: number;
  estimatedAdjustmentPeriod: string;
  risks: string[];
  recommendations: string[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  specialization: string[];
  rating: number;
  totalBatches: number;
  activeBatches: number;
  isAvailable: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledBatches: number;
  completedBatches: number;
  averageAttendance: number;
  performanceScore: number;
}
