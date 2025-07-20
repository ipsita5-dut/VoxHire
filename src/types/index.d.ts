export interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: "Technical" | "Behavioral" | "Mixed";
  finalized: boolean;
}

export interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

export interface User {
  name: string;
  email: string;
  id: string;
}

export interface InterviewCardProps {
    interview: Interview;

}

export interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

export interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}


export interface AgentProps {
  userName: string;
  userId: string;
  interviewId: string;
  feedbackId?: string;
  type: "generate" | "replay";
  questions?: string[];
}
