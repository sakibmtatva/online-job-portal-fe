export interface ICandidateProfileUpdateRequest {
  position: string;
  previous_experience: string;
  total_experience: number;
  current_sal: number;
  expected_sal: number;
  location: string;
  education: string;
  nationality: string;
  headline: string;
  resume_url: string;
  bio: string;
}

export interface ICandidateProfileDataResponse {
  _id: string;
  user: string;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
  bio: string;
  current_sal: number;
  isBookmarked: boolean;
  bookmarkId: string;
  education: string;
  expected_sal: number;
  headline: string;
  location: string;
  nationality: string;
  position: string;
  previous_experience: string;
  resume_url: string;
  profile_url: string;
  total_experience: number;
  phone_number?: string;
  full_name?: string;
  user_name?: string;
  email?: string;
  user_type?: string;
}
