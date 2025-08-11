export interface InterviewProgress {
  interviewId: string;
  title: string;
  company: string;
  topics: string[];
  date: string;
  performance: string;
}

export interface UserProfile {
  name: string;
  email: string;
  interviewsAttended: number;
  progress: InterviewProgress[];
}


