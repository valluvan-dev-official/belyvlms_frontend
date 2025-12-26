import { api } from "../AuthenticationService/AuthenticationService";

export interface StackDetail {
  id: number;
  code: string;
  title: string;
}

export interface TimingSlot {
  start_time: string;
  end_time: string;
  availability: string;
  mode: string;
}

export interface Commercial {
  commercial_type: string;
  payment?: string;
  first_student_payment?: string;
  second_student_payment?: string;
}

export interface Trainer {
  id: number;
  trainer_id: string;
  name: string;
  email: string;
  phone_number: string;
  country_code: string;
  location: string;
  other_location: string | null;
  years_of_experience: number;
  employment_type: string; // 'FL', 'FT', etc.
  date_of_joining: string;
  mode_of_delivery: string | null;
  availability: string | null;
  profile: string | null; // URL to resume/profile doc
  demo_link: string | null;
  is_active: boolean;
  stack_details: StackDetail[];
  timing_slots: TimingSlot[];
  commercials: Commercial[];
  extra_data: any;
  user: any;
  stack: number[];
}

export interface TrainerListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Trainer[];
}

export interface TrainerFilters {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  employment_type?: string;
  is_active?: boolean;
}

const ENDPOINT = "trainers/";

export interface TrainerStats {
  total: number;
  freelance: number;
  fullTime: number;
  active: number;
  inactive: number;
  ongoingBatch: number;
}

export const getTrainerStats = async (): Promise<TrainerStats> => {
  try {
    // Fetch all trainers to calculate stats client-side
    // Using a large page_size to get all records
    const response = await getTrainers({ page_size: 1000 });
    const trainers = response.results;

    const stats: TrainerStats = {
      total: response.count,
      freelance: 0,
      fullTime: 0,
      active: 0,
      inactive: 0,
      ongoingBatch: 0
    };

    trainers.forEach(trainer => {
      // Employment Type
      if (trainer.employment_type === 'FL') stats.freelance++;
      else if (trainer.employment_type === 'FT') stats.fullTime++;

      // Status
      if (trainer.is_active) stats.active++;
      else stats.inactive++;

      // Ongoing Batch (Based on timing_slots assignment)
      if (trainer.timing_slots && trainer.timing_slots.length > 0) {
        stats.ongoingBatch++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Failed to fetch trainer stats", error);
    return {
      total: 0,
      freelance: 0,
      fullTime: 0,
      active: 0,
      inactive: 0,
      ongoingBatch: 0
    };
  }
};

export const getTrainers = async (filters: TrainerFilters = {}): Promise<TrainerListResponse> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<TrainerListResponse>(`${ENDPOINT}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch trainers", error);
    throw error;
  }
};

export const getTrainer = async (id: number): Promise<Trainer> => {
  const response = await api.get<Trainer>(`${ENDPOINT}${id}/`);
  return response.data;
};

export const createTrainer = async (data: Partial<Trainer>): Promise<Trainer> => {
  const response = await api.post<Trainer>(`${ENDPOINT}`, data);
  return response.data;
};

export const updateTrainer = async (id: number, data: Partial<Trainer>): Promise<Trainer> => {
  const response = await api.patch<Trainer>(`${ENDPOINT}${id}/`, data);
  return response.data;
};

export const deleteTrainer = async (id: number): Promise<void> => {
  await api.delete(`${ENDPOINT}${id}/`);
};
