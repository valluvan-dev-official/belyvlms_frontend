// Mock Data for Enterprise Batch Management API
// Strictly aligned with backend models

import { 
  BatchAPI, 
  CourseCategory, 
  CourseWithCategory, 
  TrainerAPI, 
  StudentAPI 
} from '../types/batch-api';

// Course Categories
export const mockCourseCategories: CourseCategory[] = [
  { id: 'cat-1', code: 'PROG', name: 'Programming', initial: 'P' },
  { id: 'cat-2', code: 'DATA', name: 'Data Science', initial: 'D' },
  { id: 'cat-3', code: 'DESIGN', name: 'Design', initial: 'S' }, // S for Design
  { id: 'cat-4', code: 'CLOUD', name: 'Cloud Computing', initial: 'C' },
  { id: 'cat-5', code: 'DEVOPS', name: 'DevOps', initial: 'O' },
];

// Courses with Category Info
export const mockCoursesWithCategory: CourseWithCategory[] = [
  {
    id: 'course-1',
    code: 'C2005',
    name: 'Full Stack Web Development',
    category_id: 'cat-1',
    category_name: 'Programming',
    category_code: 'PROG',
    duration: 480, // hours
    is_active: true
  },
  {
    id: 'course-2',
    code: 'C2012',
    name: 'Python Programming',
    category_id: 'cat-1',
    category_name: 'Programming',
    category_code: 'PROG',
    duration: 320,
    is_active: true
  },
  {
    id: 'course-3',
    code: 'DS101',
    name: 'Data Science Fundamentals',
    category_id: 'cat-2',
    category_name: 'Data Science',
    category_code: 'DATA',
    duration: 400,
    is_active: true
  },
  {
    id: 'course-4',
    code: 'DS205',
    name: 'Machine Learning Advanced',
    category_id: 'cat-2',
    category_name: 'Data Science',
    category_code: 'DATA',
    duration: 360,
    is_active: true
  },
  {
    id: 'course-5',
    code: 'UX301',
    name: 'UI/UX Design Masterclass',
    category_id: 'cat-3',
    category_name: 'Design',
    category_code: 'DESIGN',
    duration: 280,
    is_active: true
  },
  {
    id: 'course-6',
    code: 'AWS101',
    name: 'AWS Cloud Practitioner',
    category_id: 'cat-4',
    category_name: 'Cloud Computing',
    category_code: 'CLOUD',
    duration: 240,
    is_active: true
  },
  {
    id: 'course-7',
    code: 'DOP501',
    name: 'DevOps Engineering',
    category_id: 'cat-5',
    category_name: 'DevOps',
    category_code: 'DEVOPS',
    duration: 320,
    is_active: true
  },
];

// Trainers with Stack
export const mockTrainersAPI: TrainerAPI[] = [
  {
    id: 'trainer-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@belyv.com',
    stack: ['Full Stack Web Development', 'Python Programming'],
    rating: 4.8,
    active_batches: 2,
    is_available: true
  },
  {
    id: 'trainer-2',
    name: 'Michael Chen',
    email: 'michael.chen@belyv.com',
    stack: ['Data Science Fundamentals', 'Machine Learning Advanced', 'Python Programming'],
    rating: 4.9,
    active_batches: 1,
    is_available: true
  },
  {
    id: 'trainer-3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@belyv.com',
    stack: ['UI/UX Design Masterclass'],
    rating: 4.7,
    active_batches: 2,
    is_available: true
  },
  {
    id: 'trainer-4',
    name: 'David Park',
    email: 'david.park@belyv.com',
    stack: ['AWS Cloud Practitioner', 'Full Stack Web Development'],
    rating: 4.6,
    active_batches: 1,
    is_available: true
  },
  {
    id: 'trainer-5',
    name: 'Lisa Martinez',
    email: 'lisa.martinez@belyv.com',
    stack: ['DevOps Engineering', 'AWS Cloud Practitioner'],
    rating: 4.8,
    active_batches: 2,
    is_available: true
  },
  {
    id: 'trainer-6',
    name: 'James Wilson',
    email: 'james.wilson@belyv.com',
    stack: ['Full Stack Web Development', 'DevOps Engineering'],
    rating: 4.5,
    active_batches: 3,
    is_available: false
  },
];

// Students
export const mockStudentsAPI: StudentAPI[] = [
  {
    id: 'BTR0007',
    name: 'Dhanoop L',
    email: 'dhanoop.l@student.com',
    phone: '+91-98765-43210',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0019',
    name: 'Sanjay Kumar',
    email: 'sanjay.kumar@student.com',
    phone: '+91-98765-43211',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0012',
    name: 'Prakash',
    email: 'prakash@student.com',
    phone: '+91-98765-43212',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0018',
    name: 'Dilli babu',
    email: 'dilli.babu@student.com',
    phone: '+91-98765-43213',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0015',
    name: 'Nandini',
    email: 'nandini@student.com',
    phone: '+91-98765-43214',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0023',
    name: 'Lakshmi A',
    email: 'lakshmi.a@student.com',
    phone: '+91-98765-43215',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0031',
    name: 'Balaji Krishnamoorthy',
    email: 'balaji.k@student.com',
    phone: '+91-98765-43216',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0042',
    name: 'Moharaj El',
    email: 'moharaj.el@student.com',
    phone: '+91-98765-43217',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0055',
    name: 'Ravivarma Manimaran',
    email: 'ravivarma.m@student.com',
    phone: '+91-98765-43218',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0068',
    name: 'Jagath B',
    email: 'jagath.b@student.com',
    phone: '+91-98765-43219',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0074',
    name: 'Mullaivendhan Saravanan',
    email: 'mullaivendhan.s@student.com',
    phone: '+91-98765-43220',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0081',
    name: 'Balaji Nag',
    email: 'balaji.nag@student.com',
    phone: '+91-98765-43221',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0092',
    name: 'Visvakumar Sreekumar',
    email: 'visvakumar.s@student.com',
    phone: '+91-98765-43222',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0105',
    name: 'Thiyagarajan Palanisam',
    email: 'thiyagarajan.p@student.com',
    phone: '+91-98765-43223',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0116',
    name: 'Vijaya Sathish',
    email: 'vijaya.s@student.com',
    phone: '+91-98765-43224',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0127',
    name: 'Harinee Manoharan',
    email: 'harinee.m@student.com',
    phone: '+91-98765-43225',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0138',
    name: 'Aarthi Panneerselvam',
    email: 'aarthi.p@student.com',
    phone: '+91-98765-43226',
    enrollment_status: 'active'
  },
  {
    id: 'BTR0149',
    name: 'Jayachandran Kabalaamoorthi',
    email: 'jayachandran.k@student.com',
    phone: '+91-98765-43227',
    enrollment_status: 'active'
  },
];

// Batches (with API structure)
export const mockBatchesAPI: BatchAPI[] = [
  {
    id: '1',
    batch_id: 'D02AI',
    course_id: 'course-3',
    course_name: 'Azure Data Engineering',
    course_category: 'Data Science',
    trainer_id: 'trainer-1',
    trainer_name: 'Yogeshwaran Rajapandian',
    trainer_type: 'Full Time',
    batch_type: 'WD',
    start_date: '13-02-2026',
    end_date: '04-06-2026',
    tentative_end_date: '04-06-2026',
    start_time: '10:00',
    end_time: '11:00',
    hours_per_day: 1,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    status: 'active',
    student_count: 30,
    batch_completion_percentage: 100,
    enrolled_students: ['Lakshmi A', 'Balaji Krishnamoorthy', 'Moharaj El'],
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2026-02-13T09:43:00Z',
    created_by: 'admin@belyv.com',
    updated_by: 'Elakiya V'
  },
  {
    id: '2',
    batch_id: 'C02AV',
    course_id: 'course-6',
    course_name: 'AWS & DevOps',
    course_category: 'Cloud Computing',
    trainer_id: 'trainer-2',
    trainer_name: 'Aasha d',
    trainer_type: 'Freelancer',
    batch_type: 'WE',
    start_date: '18-02-2026',
    end_date: '19-05-2026',
    tentative_end_date: '19-05-2026',
    start_time: '18:30',
    end_time: '20:00',
    hours_per_day: 1.5,
    days: ['Saturday', 'Sunday'],
    status: 'scheduled',
    student_count: 0,
    batch_completion_percentage: 0,
    enrolled_students: ['Ravivarma Manimaran'],
    created_at: '2024-02-05T10:00:00Z',
    updated_at: '2026-02-09T15:27:00Z',
    created_by: 'admin@belyv.com',
    updated_by: '-'
  },
  {
    id: '3',
    batch_id: 'C02AU',
    course_id: 'course-6',
    course_name: 'AWS & DevOps',
    course_category: 'Cloud Computing',
    trainer_id: 'trainer-3',
    trainer_name: 'Harsha Priyadharshini',
    trainer_type: 'Full Time',
    batch_type: 'WD',
    start_date: '05-02-2026',
    end_date: '28-05-2026',
    tentative_end_date: '28-05-2026',
    start_time: '16:30',
    end_time: '18:00',
    hours_per_day: 1.5,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    status: 'active',
    student_count: 30,
    batch_completion_percentage: 5,
    enrolled_students: ['Jagath B', 'Mullaivendhan Saravanan', 'Balaji Nag'],
    created_at: '2024-01-28T10:00:00Z',
    updated_at: '2026-02-12T14:59:00Z',
    created_by: 'admin@belyv.com',
    updated_by: 'Harsha'
  },
  {
    id: '4',
    batch_id: 'C02AT',
    course_id: 'course-6',
    course_name: 'AWS & DevOps',
    course_category: 'Cloud Computing',
    trainer_id: 'trainer-4',
    trainer_name: 'Vaishnavi J',
    trainer_type: 'Freelancer',
    batch_type: 'WD',
    start_date: '02-02-2026',
    end_date: '01-05-2026',
    tentative_end_date: '01-05-2026',
    start_time: '09:00',
    end_time: '20:00',
    hours_per_day: 11,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    status: 'active',
    student_count: 30,
    batch_completion_percentage: 20,
    enrolled_students: ['Visvakumar Sreekumar', 'Thiyagarajan Palanisam'],
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2026-02-09T10:45:00Z',
    created_by: 'admin@belyv.com',
    updated_by: 'Elakiya V'
  },
  {
    id: '5',
    batch_id: 'D02AH',
    course_id: 'course-3',
    course_name: 'Azure Data Engineering',
    course_category: 'Data Science',
    trainer_id: 'trainer-5',
    trainer_name: 'Joy Priyanka M',
    trainer_type: 'Freelancer',
    batch_type: 'WE',
    start_date: '24-01-2026',
    end_date: '15-05-2026',
    tentative_end_date: '15-05-2026',
    start_time: '18:00',
    end_time: '20:00',
    hours_per_day: 2,
    days: ['Saturday', 'Sunday'],
    status: 'active',
    student_count: 28,
    batch_completion_percentage: 25,
    enrolled_students: ['Vijaya Sathish'],
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2026-02-06T10:33:00Z',
    created_by: 'admin@belyv.com',
    updated_by: 'Elakiya V'
  },
  {
    id: '6',
    batch_id: 'D02AG',
    course_id: 'course-3',
    course_name: 'Azure Data Engineering',
    course_category: 'Data Science',
    trainer_id: 'trainer-6',
    trainer_name: 'Gokul Gururaj R',
    trainer_type: 'Freelancer',
    batch_type: 'WD',
    start_date: '21-02-2026',
    end_date: '07-06-2026',
    tentative_end_date: '07-06-2026',
    start_time: '10:00',
    end_time: '12:00',
    hours_per_day: 2,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    status: 'scheduled',
    student_count: 0,
    batch_completion_percentage: 0,
    enrolled_students: ['Harinee Manoharan'],
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2026-01-23T17:19:00Z',
    created_by: 'admin@belyv.com',
    updated_by: 'Elakiya V'
  },
  {
    id: '7',
    batch_id: 'D02AF',
    course_id: 'course-3',
    course_name: 'Azure Data Engineering',
    course_category: 'Data Science',
    trainer_id: 'trainer-1',
    trainer_name: 'Gokul Gururaj R',
    trainer_type: 'Freelancer',
    batch_type: 'WE',
    start_date: '23-01-2026',
    end_date: '14-05-2026',
    tentative_end_date: '14-05-2026',
    start_time: '18:00',
    end_time: '21:00',
    hours_per_day: 3,
    days: ['Saturday', 'Sunday'],
    status: 'active',
    student_count: 28,
    batch_completion_percentage: 25,
    enrolled_students: ['Aarthi Panneerselvam'],
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2026-02-06T11:41:00Z',
    created_by: 'admin@belyv.com',
    updated_by: 'Elakiya V'
  },
  {
    id: '8',
    batch_id: 'D02AE',
    course_id: 'course-3',
    course_name: 'Azure Data Engineering',
    course_category: 'Data Science',
    trainer_id: 'trainer-2',
    trainer_name: 'Gokul Gururaj R',
    trainer_type: 'Freelancer',
    batch_type: 'WDWE',
    start_date: '19-05-2026',
    end_date: '19-05-2026',
    tentative_end_date: '19-05-2026',
    start_time: '20:00',
    end_time: '22:00',
    hours_per_day: 2,
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    status: 'active',
    student_count: 25,
    batch_completion_percentage: 0,
    enrolled_students: ['Jayachandran Kabalaamoorthi'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2026-02-06T15:43:00Z',
    created_by: 'admin@belyv.com',
    updated_by: 'Elakiya V'
  },
];