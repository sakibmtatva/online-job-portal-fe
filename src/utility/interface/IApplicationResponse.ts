export interface Application {
  _id: string;
  candidate: {
    _id: string;
    full_name: string;
    email: string;
    ["candidate-profile-info"]: {
      _id: string;
      certifications: string[];
      profile_url: string;
      total_experience: number;
      education: string;
      phone_number: string;
      bio: string;
      nationality: string;
      location: string;
      position: string;
    };
    id: string;
  };
  job: string;
  cover_letter: string;
  resume_url: string;
  applied_at: string;
  trello_name: string;
}

export interface Column {
  _id: string;
  name: string;
}
