export type OnboardRequestStatus =
  | "INVITED"
  | "PENDING_APPROVAL"
  | "ONBOARDED"
  | "DROPPED"
  | "ERROR"
  | string;

export interface OnboardRequestListItem {
  code: string;
  email: string;
  role_code: string;
  role_name?: string;
  status: OnboardRequestStatus;
  created_at?: string;
  submitted_at?: string | null;
  expires_at?: string;
}

export interface OnboardRequestDetail extends OnboardRequestListItem {
  first_name?: string | null;
  last_name?: string | null;
  user_payload?: {
    first_name?: string | null;
    last_name?: string | null;
    profile?: Record<string, any> | null;
  } | null;
  admin_payload?: {
    first_name?: string | null;
    last_name?: string | null;
    profile?: Record<string, any> | null;
  } | null;
  final_payload_preview?: any;
  last_error?: any;
}

export interface CreateOnboardRequestBody {
  email: string;
  role_code: string;
}

export interface CreateOnboardRequestResponse {
  registration_url: string;
  request_id?: string | number;
  request_code?: string;
  code?: string;
  expires_at?: string;
}

export interface ListOnboardRequestsParams {
  status?: string;
  role_code?: string;
  search?: string;
}

export interface PaginatedResult<T> {
  count: number;
  results: T[];
}

export type SchemaFieldType = "TEXT" | "NUMBER" | "BOOLEAN" | "DATE" | "CHOICE" | "JSON";

export type SchemaChoiceOption =
  | string
  | number
  | { label: string; value: string | number }
  | { id: string | number; name: string };

export interface PublicSchemaField {
  key: string;
  type: SchemaFieldType;
  required: boolean;
  options?: SchemaChoiceOption[];
}

export interface PublicOnboardSchemaResponse {
  request_code: string;
  email: string;
  role_code: string;
  role_name?: string;
  expires_at?: string;
  fields: PublicSchemaField[];
  initial_data?: Record<string, any>;
}

export interface PublicOnboardSubmitBody {
  first_name?: string;
  last_name?: string;
  profile: Record<string, any>;
}

export interface OnboardingOption {
  code: string;
  label: string;
}

export interface OnboardingOptionsResponse {
  status_choices: OnboardingOption[];
  [key: string]: any;
}

