// Mock Data for Course Management System

import { Category, Course, Module, Topic } from '@/app/features/course-management/types/course';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    code: 'C2',
    name: 'Technical Training',
    courseCount: 12,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
  },
  {
    id: 'cat-2',
    code: 'SOFT',
    name: 'Soft Skills Development',
    courseCount: 8,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-02-08T11:20:00Z',
  },
  {
    id: 'cat-3',
    code: 'LEAD',
    name: 'Leadership & Management',
    courseCount: 6,
    createdAt: '2024-01-25T08:30:00Z',
    updatedAt: '2024-02-05T16:45:00Z',
  },
  {
    id: 'cat-4',
    code: 'COMP',
    name: 'Compliance & Regulations',
    courseCount: 4,
    createdAt: '2024-02-01T10:15:00Z',
    updatedAt: '2024-02-09T13:00:00Z',
  },
  {
    id: 'cat-5',
    code: 'CERT',
    name: 'Professional Certification',
    courseCount: 10,
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-02-11T15:30:00Z',
  },
];

export const mockTopics: Topic[] = [
  { id: 'topic-1', name: 'React Fundamentals', duration: 8, moduleId: 'mod-1', order: 1 },
  { id: 'topic-2', name: 'Component Lifecycle', duration: 6, moduleId: 'mod-1', order: 2 },
  { id: 'topic-3', name: 'State Management', duration: 6, moduleId: 'mod-1', order: 3 },
  { id: 'topic-4', name: 'Hooks Overview', duration: 5, moduleId: 'mod-2', order: 1 },
  { id: 'topic-5', name: 'Custom Hooks', duration: 5, moduleId: 'mod-2', order: 2 },
  { id: 'topic-6', name: 'Performance Optimization', duration: 5, moduleId: 'mod-2', order: 3 },
  { id: 'topic-7', name: 'TypeScript Basics', duration: 7, moduleId: 'mod-3', order: 1 },
  { id: 'topic-8', name: 'Advanced Types', duration: 8, moduleId: 'mod-3', order: 2 },
];

export const mockModules: Module[] = [
  {
    id: 'mod-1',
    name: 'React Fundamentals',
    duration: 20,
    courseId: 'course-1',
    hasTopics: true,
    topics: mockTopics.filter(t => t.moduleId === 'mod-1'),
    order: 1,
  },
  {
    id: 'mod-2',
    name: 'Advanced React Patterns',
    duration: 15,
    courseId: 'course-1',
    hasTopics: true,
    topics: mockTopics.filter(t => t.moduleId === 'mod-2'),
    order: 2,
  },
  {
    id: 'mod-3',
    name: 'TypeScript Integration',
    duration: 15,
    courseId: 'course-1',
    hasTopics: true,
    topics: mockTopics.filter(t => t.moduleId === 'mod-3'),
    order: 3,
  },
  {
    id: 'mod-4',
    name: 'Project Development',
    duration: 30,
    courseId: 'course-1',
    hasTopics: false,
    topics: [],
    order: 4,
  },
  {
    id: 'mod-5',
    name: 'Communication Fundamentals',
    duration: 12,
    courseId: 'course-2',
    hasTopics: false,
    topics: [],
    order: 1,
  },
  {
    id: 'mod-6',
    name: 'Professional Writing',
    duration: 10,
    courseId: 'course-2',
    hasTopics: false,
    topics: [],
    order: 2,
  },
  {
    id: 'mod-7',
    name: 'Presentation Skills',
    duration: 8,
    courseId: 'course-2',
    hasTopics: false,
    topics: [],
    order: 3,
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    code: 'C2007',
    name: 'Full Stack React Development',
    categoryId: 'cat-1',
    categoryName: 'Technical Training',
    categoryCode: 'C2',
    type: 'course',
    totalDuration: 80,
    modules: mockModules.filter(m => m.courseId === 'course-1'),
    moduleCount: 4,
    topicCount: 8,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
    linkedBatchCount: 3,
  },
  {
    id: 'course-2',
    code: 'SOFT001',
    name: 'Effective Communication Skills',
    categoryId: 'cat-2',
    categoryName: 'Soft Skills Development',
    categoryCode: 'SOFT',
    type: 'course',
    totalDuration: 30,
    modules: mockModules.filter(m => m.courseId === 'course-2'),
    moduleCount: 3,
    topicCount: 0,
    status: 'active',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-02-08T11:20:00Z',
    linkedBatchCount: 5,
  },
  {
    id: 'course-3',
    code: 'LEAD005',
    name: 'Strategic Leadership Program',
    categoryId: 'cat-3',
    categoryName: 'Leadership & Management',
    categoryCode: 'LEAD',
    type: 'module',
    totalDuration: 60,
    modules: [],
    moduleCount: 0,
    topicCount: 0,
    status: 'draft',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-11T10:15:00Z',
    linkedBatchCount: 0,
  },
  {
    id: 'course-4',
    code: 'C2012',
    name: 'Cloud Computing Essentials',
    categoryId: 'cat-1',
    categoryName: 'Technical Training',
    categoryCode: 'C2',
    type: 'course',
    totalDuration: 50,
    modules: [],
    moduleCount: 0,
    topicCount: 0,
    status: 'active',
    createdAt: '2024-02-03T11:30:00Z',
    updatedAt: '2024-02-10T16:00:00Z',
    linkedBatchCount: 2,
  },
  {
    id: 'course-5',
    code: 'COMP002',
    name: 'Data Protection & GDPR Compliance',
    categoryId: 'cat-4',
    categoryName: 'Compliance & Regulations',
    categoryCode: 'COMP',
    type: 'course',
    totalDuration: 20,
    modules: [],
    moduleCount: 0,
    topicCount: 0,
    status: 'active',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-02-09T14:20:00Z',
    linkedBatchCount: 8,
  },
  {
    id: 'course-6',
    code: 'CERT008',
    name: 'AWS Solutions Architect Preparation',
    categoryId: 'cat-5',
    categoryName: 'Professional Certification',
    categoryCode: 'CERT',
    type: 'module',
    totalDuration: 120,
    modules: [],
    moduleCount: 0,
    topicCount: 0,
    status: 'active',
    createdAt: '2024-02-08T10:00:00Z',
    updatedAt: '2024-02-11T13:45:00Z',
    linkedBatchCount: 1,
  },
];

export function generateCourseCode(categoryCode: string, existingCourses: Course[]): string {
  const coursesInCategory = existingCourses.filter(
    c => c.categoryCode === categoryCode
  );
  const numbers = coursesInCategory
    .map(c => {
      const match = c.code.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter(n => !isNaN(n));
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
  return `${categoryCode}${nextNumber}`;
}

export function isCategoryCodeUnique(code: string, existingCategories: Category[], excludeId?: string): boolean {
  return !existingCategories.some(
    cat => cat.code.toLowerCase() === code.toLowerCase() && cat.id !== excludeId
  );
}
