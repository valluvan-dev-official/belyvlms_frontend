// Course Management Type Definitions

export interface Category {
  id: string;
  code: string;
  name: string;
  courseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  duration: number;
  moduleId: string;
  order: number;
}

export interface Module {
  id: string;
  name: string;
  duration: number;
  courseId: string;
  hasTopics: boolean;
  topics: Topic[];
  order: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  type: CourseType;
  totalDuration: number;
  modules: Module[];
  moduleCount: number;
  topicCount: number;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
  linkedBatchCount: number;
}

export type CourseType = 
  | 'course' 
  | 'module';

export type CourseStatus = 'draft' | 'active' | 'archived';

export interface CategoryFormData {
  code: string;
  name: string;
}

export interface TopicFormData {
  id?: string;
  name: string;
  duration: number;
}

export interface ModuleFormData {
  id?: string;
  name: string;
  duration: number;
  hasTopics: boolean;
  topics: TopicFormData[];
}

export interface CourseFormData {
  name: string;
  categoryId: string;
  type: CourseType;
  totalDuration: number;
  modules: ModuleFormData[];
}

export interface DurationValidation {
  isValid: boolean;
  courseAllocated: number;
  courseRemaining: number;
  moduleValidations: ModuleValidation[];
}

export interface ModuleValidation {
  moduleId: string;
  moduleName: string;
  isValid: boolean;
  allocated: number;
  remaining: number;
}

export interface CourseValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  message: string;
  type: 'governance' | 'duration' | 'dependency';
}
