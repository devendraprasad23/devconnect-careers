export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  skillsRequired: string[];
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  location: string;
  status: string;
  viewsCount: number;
  applicationsCount: number;
  recruiterEmail: string;
  createdAt: string;
  expiresAt: string;
  remote: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  jobLocation: string;
  candidateEmail: string;
  coverLetter: string;
  matchScore: number;
  status:
    | "APPLIED"
    | "REVIEWED"
    | "SHORTLISTED"
    | "INTERVIEW"
    | "OFFERED"
    | "REJECTED"
    | "WITHDRAWN";
  statusNote: string;
  appliedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
