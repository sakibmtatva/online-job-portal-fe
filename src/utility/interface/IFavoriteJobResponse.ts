import { Job } from "./IJobResponse";

export interface FavoriteJobApplication {
  _id: string;
  jobDetails: Job;
  profile_url: string;
  isBookmarked: boolean;
  bookmarkId: string;
  hasApplied: boolean;
}
