import { api } from "../AuthenticationService/AuthenticationService";

export interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code?: string;
  alternative_phone?: string;
  location?: string;
  course_name?: string;
  course_id?: number;
  course_status?: string; // e.g., 'YTS', 'D'
  enrollment_date?: string;
  start_date?: string;
  end_date?: string;
  course_percentage?: number;
  pl_required?: boolean;
  mode_of_class?: string; // 'ON', 'OFF'
  week_type?: string; // 'WD'
  working_status?: string; // 'NO'
  profile_picture?: string | null;
  // Add other fields as needed based on the JSON response
  [key: string]: any;
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

export const getStudentStats = async (): Promise<StudentStats> => {
  try {
    // Parallel requests for counts
    const [
      totalRes, 
      completedRes, 
      ytsRes, 
      ipRes, 
      discontinuedRes,
      refundRes,
      holdRes,
      placedRes,
      allStudentsRes
    ] = await Promise.all([
      getStudents({ page: 1 }), // Just to get total count
      getStudents({ course_status: 'C', page: 1 }), // Count of Completed
      getStudents({ course_status: 'YTS', page: 1 }), // Count of Yet to Start
      getStudents({ course_status: 'IP', page: 1 }), // Count of In Progress
      getStudents({ course_status: 'D', page: 1 }), // Count of Discontinued
      getStudents({ course_status: 'R', page: 1 }), // Count of Refund
      getStudents({ course_status: 'H', page: 1 }), // Count of Hold
      getStudents({ course_status: 'P', page: 1 }), // Count of Placed
      // Try to fetch a large batch for percentage calculation. 
      api.get<StudentListResponse>(`${ENDPOINT}?page_size=1000`)
    ]);

    const allStudents = allStudentsRes.data.results;
    
    let above80 = 0;
    let below80 = 0;
    let below50 = 0;

    allStudents.forEach(student => {
      const p = student.course_percentage || 0;
      if (p > 80) above80++;
      else if (p >= 50) below80++; // "below 80" usually implies 50-80 range in this context
      else below50++;
    });

    return {
      total: totalRes.count,
      completed: completedRes.count,
      yetToStart: ytsRes.count,
      inProgress: ipRes.count,
      discontinued: discontinuedRes.count,
      refund: refundRes.count,
      hold: holdRes.count,
      placed: placedRes.count,
      percentageBreakdown: {
        above80,
        below80,
        below50
      }
    };
  } catch (error) {
    console.error("Failed to fetch student stats", error);
    return {
      total: 0,
      completed: 0,
      yetToStart: 0,
      inProgress: 0,
      discontinued: 0,
      refund: 0,
      hold: 0,
      placed: 0,
      percentageBreakdown: { above80: 0, below80: 0, below50: 0 }
    };
  }
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
  } catch (error) {
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

export const updateStudent = async (id: number, data: Partial<Student>): Promise<Student> => {
  const response = await api.patch<Student>(`${ENDPOINT}${id}/`, data);
  return response.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`${ENDPOINT}${id}/`);
};
