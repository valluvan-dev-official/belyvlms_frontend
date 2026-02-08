import { api } from "../services/AuthenticationService/AuthenticationService";
import type {
  CreateOnboardRequestBody,
  CreateOnboardRequestResponse,
  ListOnboardRequestsParams,
  OnboardRequestDetail,
  OnboardRequestListItem,
  PaginatedResult,
  PublicOnboardSchemaResponse,
  PublicOnboardSubmitBody,
} from "./types";

const extractPaginated = <T,>(data: any): PaginatedResult<T> => {
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return {
      count: typeof data.count === "number" ? data.count : data.results.length,
      results: data.results as T[],
    };
  }
  if (Array.isArray(data)) {
    return { count: data.length, results: data as T[] };
  }
  return { count: 0, results: [] };
};

export const createOnboardRequest = async (
  body: CreateOnboardRequestBody,
): Promise<CreateOnboardRequestResponse> => {
  const res = await api.post("rbac/onboard-requests/create/", body);
  return res.data;
};

export const listOnboardRequests = async (
  params: ListOnboardRequestsParams,
): Promise<PaginatedResult<OnboardRequestListItem>> => {
  const res = await api.get("rbac/onboard-requests/", { params });
  return extractPaginated<OnboardRequestListItem>(res.data);
};

export const getOnboardRequest = async (code: string): Promise<OnboardRequestDetail> => {
  const res = await api.get(`rbac/onboard-requests/${encodeURIComponent(code)}/`);
  return res.data;
};

export const patchOnboardRequest = async (
  code: string,
  body: { first_name?: string; last_name?: string; profile?: Record<string, any> },
): Promise<OnboardRequestDetail> => {
  const res = await api.patch(`rbac/onboard-requests/${encodeURIComponent(code)}/`, body);
  return res.data;
};

export const onboardRequest = async (
  code: string,
  body: { send_welcome_email: boolean },
): Promise<any> => {
  const res = await api.post(`rbac/onboard-requests/${encodeURIComponent(code)}/onboard/`, body);
  return res.data;
};

export const getPublicOnboardSchema = async (token: string): Promise<PublicOnboardSchemaResponse> => {
  const res = await api.get("rbac/public/onboard/schema/", {
    params: { token },
    headers: {
      "X-Skip-Auth-Logout": "true",
    },
  });
  return res.data;
};

export const submitPublicOnboard = async (
  token: string,
  body: PublicOnboardSubmitBody,
): Promise<any> => {
  const res = await api.post("rbac/public/onboard/submit/", body, {
    params: { token },
    headers: {
      "X-Skip-Auth-Logout": "true",
    },
  });
  return res.data;
};

export const performOnboardRequestAction = async (
  code: string,
  body: { action: "send_back" | "drop"; reason: string },
): Promise<OnboardRequestDetail> => {
  const res = await api.post(`rbac/onboard-requests/${encodeURIComponent(code)}/action/`, body);
  return res.data;
};

export const getOnboardingOptions = async (): Promise<OnboardingOptionsResponse> => {
  const res = await api.get("rbac/onboarding/options/");
  return res.data;
};

