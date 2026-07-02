export type ApplicationStatus =
  | "draft"
  | "approved"
  | "sent"
  | "replied"
  | "rejected"
  | "failed";

export type JobType = "remote" | "hybrid" | "onsite";

export type ParsingStatus =
  | "idle"
  | "uploading"
  | "parsing"
  | "matching"
  | "generating"
  | "complete"
  | "failed";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface CVData {
  id: string;
  user_id: string;
  raw_file_url: string;
  parsed_json: ParsedCV;
  created_at: string;
}

export interface ParsedCV {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  certifications: string[];
}

export interface Experience {
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  description: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
}

export interface UserPreferences {
  target_role: string;
  location: string;
  job_type: JobType;
  remote_preferred: boolean;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry?: string;
  location?: string;
  description?: string;
  logo_url?: string;
  source: "google_maps" | "google_search" | "manual" | "open_directory";
  contact_email?: string;
  contact_form_url?: string;
  created_at: string;
}

export interface CompanyMatch {
  company: Company;
  match_score: number;
  match_reason: string;
  relevance_factors: string[];
}

export interface Application {
  id: string;
  user_id: string;
  company_id: string;
  company?: Company;
  email_subject: string;
  email_body: string;
  status: ApplicationStatus;
  sent_at?: string;
  replied_at?: string;
  created_at: string;
  notes?: string;
}

export interface ApplicationLog {
  id: string;
  application_id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DashboardMetrics {
  total_cvs: number;
  total_companies: number;
  total_emails_generated: number;
  total_emails_sent: number;
  total_replies: number;
  response_rate: number;
  avg_response_time?: number;
}

export interface AIAgentState {
  status: ParsingStatus;
  progress: number;
  message: string;
}
