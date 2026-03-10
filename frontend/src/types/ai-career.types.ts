export interface CareerFitRequest {
  level?: string;
  description?: string;
  skills?: string[];
  preferredIndustries?: string[];
  socialLevel?: number;
  analyticalLevel?: number;
  creativityLevel?: number;
  stabilityPreference?: number;
}

export interface JobSuggestion {
  title: string;
  industry: string;
  matchScore: number;
  reason: string;
}

export interface CareerFitResponse {
  persona: string;
  summary: string;
  overallScore: number;
  recommendedIndustries: string[];
  topJobs: JobSuggestion[];
  strengths: string[];
  improvements: string[];
  roadmap30Days: string[];
  jobKeywords: string[];
}

