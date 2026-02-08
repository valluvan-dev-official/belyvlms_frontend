import { api } from "../AuthenticationService/AuthenticationService";
import { getAccessToken, getActiveRoleCode } from "../AuthenticationService/AuthenticationService";

export interface DropdownOption {
  id: number | string;
  name: string;
}

const extractResults = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const authHeaders = () => {
  const token = getAccessToken();
  const role = getActiveRoleCode();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (role) headers["X-Active-Role"] = role;
  return headers;
};

const getCourseDbUrl = (endpoint: string) => {
  const baseUrl = api.defaults.baseURL || "";
  const rootUrl = baseUrl.replace(/\/api\/?$/, "/");
  return `${rootUrl}coursedb/api/${endpoint}`;
};

export const getCourseCategories = async (): Promise<DropdownOption[]> => {
  try {
    const url = getCourseDbUrl("categories/");
    const response = await api.get(url);
    const results = extractResults(response.data);
    return results.map((cat: any) => ({
      id: cat.id || cat.code || cat.category_id,
      name: cat.name || cat.title || cat.category_name || "Unknown Category",
    }));
  } catch (error) {
    console.warn("Failed to fetch course categories", error);
    return [];
  }
};

export const fetchCoursesByCategory = async (categoryId: string | number): Promise<DropdownOption[]> => {
  try {
    const url = getCourseDbUrl(`courses-by-category/${categoryId}/`);
    const response = await api.get(url, { headers: authHeaders() });
    const results = extractResults(response.data);
    return results.map((c: any) => ({
      id: c.id,
      name: c.course_name || c.title || c.name || "Unknown Course",
    }));
  } catch (error) {
    console.warn("Failed to fetch courses by category", error);
    return [];
  }
};

export const fetchTrainersByCourse = async (courseId: string | number): Promise<DropdownOption[]> => {
  try {
    const response = await api.get(`trainers-by-course/${courseId}/`, { headers: authHeaders() });
    const results = extractResults(response.data);
    return results.map((t: any) => ({
      id: t.id,
      name: `${t.name || "Unknown"} (${t.trainer_id || t.code || t.id})`,
    }));
  } catch (error) {
    console.warn("Failed to fetch trainers by course, attempting fallback", error);
    try {
      const resp2 = await api.get(`trainers/?stack=${courseId}`, { headers: authHeaders() });
      const res2 = extractResults(resp2.data);
      return res2.map((t: any) => ({
        id: t.id,
        name: `${t.name || "Unknown"} (${t.trainer_id || t.code || t.id})`,
      }));
    } catch (err2) {
      console.warn("Fallback trainers/?stack failed", err2);
      return [];
    }
  }
};

export const getBatches = async (): Promise<DropdownOption[]> => {
  try {
    const response = await api.get("batches/"); 
    console.log("Batches response:", response.data);
    const results = extractResults(response.data);
    return results.map((b: any) => ({ 
      id: b.batch_id, 
      name: b.batch_id ? `${b.batch_id} (${b.slot_time || 'No slot'})` : "Unknown Batch" 
    }));
  } catch (error) {
    console.warn("Failed to fetch batches", error);
    return [];
  }
};

export const getCourses = async (): Promise<DropdownOption[]> => {
  try {
    const url = getCourseDbUrl("course-list/");
    const response = await api.get(url);
    console.log("Courses response:", response.data);
    const results = extractResults(response.data);
    return results.map((c: any) => {
      const title =
        c.course_name ||
        c.title ||
        c.name ||
        c.course_title ||
        c.stack_title ||
        c.display_name ||
        "";
      return {
        id: c.id,
        name: title && String(title).trim().length ? String(title) : "Unknown Course",
      };
    });
  } catch (error) {
    console.warn("Failed to fetch courses", error);
    return [];
  }
};

export const getConsultants = async (): Promise<DropdownOption[]> => {
  try {
    const response = await api.get("consultants/");
    console.log("Consultants response:", response.data);
    const results = extractResults(response.data);
    return results.map((c: any) => {
      const code = c.consultant_id || c.code || c.id;
      const name = c.name || "";
      const label =
        `${code ?? ""} - ${name || "Unknown Consultant"}`.replace(/^undefined - /, "").trim();
      return {
        id: name || c.id,
        name: label,
      };
    });
  } catch (error) {
    console.warn("Failed to fetch consultants", error);
    return [];
  }
};

export const getSources = async (): Promise<DropdownOption[]> => {
  try {
    const response = await api.get("sources/");
    console.log("Sources response:", response.data);
    const results = extractResults(response.data);
    return results.map((s: any) => {
      const code = s.source_id || s.code || s.id;
      const name = s.name || "";
      const label =
        `${code ?? ""} - ${name || "Unknown Source"}`.replace(/^undefined - /, "").trim();
      return {
        id: name || s.id,
        name: label,
      };
    });
  } catch (error) {
    console.warn("Failed to fetch sources", error);
    return [];
  }
};

export const getTrainersList = async (): Promise<DropdownOption[]> => {
  try {
    const response = await api.get("trainers/");
    console.log("Trainers response:", response.data);
    const results = extractResults(response.data);
    return results.map((t: any) => {
      const code = t.trainer_id || t.code || t.id;
      const name = t.name || "Unknown Trainer";
      return {
        id: t.id,
        name: `${code} - ${name}`,
      };
    });
  } catch (error) {
    console.warn("Failed to fetch trainers", error);
    return [];
  }
};
