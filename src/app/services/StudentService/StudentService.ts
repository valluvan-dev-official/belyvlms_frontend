import { api } from "../AuthenticationService/AuthenticationService";

export interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code?: string;
  alternative_country_code?: string;
  alternative_phone?: string | null;
  location?: string;
  
  // Academic Details
  ugdegree?: string | null;
  ugbranch?: string | null;
  ugpassout?: number | null;
  ugpercentage?: number | null;
  pgdegree?: string | null;
  pgbranch?: string | null;
  pgpassout?: number | null;
  pgpercentage?: number | null;
  
  // Work Details
  working_status?: string; // 'YES', 'NO'
  it_experience?: string | null;
  
  // Course Details
  course_name?: string;
  course_id?: number;
  course_status?: string; // 'IP', 'C', 'YTS', etc.
  enrollment_date?: string;
  start_date?: string;
  end_date?: string;
  course_percentage?: number;
  pl_required?: boolean;
  mode_of_class?: string; // 'ON', 'OFF'
  week_type?: string; // 'WD'
  
  // Placement & System Flags
  mock_interview_completed?: boolean;
  placement_session_completed?: boolean;
  certificate_issued?: boolean;
  onboardingcalldone?: boolean;
  interviewquestion_shared?: boolean;
  resume_template_shared?: boolean;
  
  // Relations
  user?: any | null;
  trainer?: any | null;
  source_of_joining?: number;
  consultant?: number;
  consultant_name?: string;
  
  trainer_name?: string;
  
  batch_details?: {
    student_name?: string;
    current_batch?: {
      batch_id: string;
      slot_time: string;
    };
    batch_history?: any[];
    transactions?: any[];
  };
  
  payment_details?: {
    total_fees: number;
    amount_paid: number;
    pending_amount: number;
    status: string;
  };
  
  placement_details?: {
    onboarding_call: string;
    placement_session?: string;
    interview_questions?: string;
    resume_templates?: string;
    mock_interview?: string;
    placed_status?: string;
    resume_link?: string | null;
  };
  
  interview_details?: Array<{
    company: string;
    status: string;
  }>;
  
  profile_picture?: string | null;
  extra_data?: any;
}

export interface StudentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[];
}

export interface StudentFilters {
  page?: number;
  search?: string;
  course_status?: string;
  location?: string;
  mode_of_class?: string;
  week_type?: string;
  working_status?: string;
  course_id?: string;
  consultant?: string;
  ordering?: string;
}

const ENDPOINT = "students/";

export interface StudentStats {
  total: number;
  completed: number;
  yetToStart: number;
  inProgress: number;
  discontinued: number;
  refund: number;
  hold: number;
  placed: number;
  percentageBreakdown: {
    above80: number;
    below80: number;
    below50: number;
  };
}

/**
 * Get student statistics
 */
export const getStudentStats = async (): Promise<StudentStats> => {
  // Mock implementation for now as the API endpoint wasn't provided for stats
  // In a real scenario, this would likely be a separate endpoint or derived from a list
  return {
    total: 856,
    completed: 45,
    yetToStart: 120,
    inProgress: 650,
    discontinued: 12,
    refund: 5,
    hold: 15,
    placed: 9,
    percentageBreakdown: {
      above80: 15,
      below80: 45,
      below50: 40
    }
  };
};

export const getStudents = async (filters: StudentFilters = {}): Promise<StudentListResponse> => {
  try {
    const params = new URLSearchParams();
    
    // Smart search logic: Check if search term looks like an ID
    if (filters.search) {
      // Pattern: Starts with letters, ends with numbers, no spaces (e.g., BTR658)
      const isIdPattern = /^[A-Za-z]+\d+$/.test(filters.search);
      
      if (isIdPattern) {
        params.append('student_id', filters.search);
      } else {
        params.append('search', filters.search);
      }
    }

    Object.entries(filters).forEach(([key, value]) => {
      // Skip search as we handled it above
      if (key === 'search') return;
      
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<StudentListResponse>(`${ENDPOINT}?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
       console.warn("Access denied to fetch students (403). Returning empty list.");
       return { count: 0, next: null, previous: null, results: [] };
    }
    console.error("Failed to fetch students", error);
    throw error;
  }
};

export const getStudent = async (id: number): Promise<Student> => {
  const response = await api.get<Student>(`${ENDPOINT}${id}/`);
  return response.data;
};

export const createStudent = async (data: Partial<Student>): Promise<Student> => {
  const response = await api.post<Student>(`${ENDPOINT}`, data);
  return response.data;
};
