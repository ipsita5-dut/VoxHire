export type ExperienceLevel = "Junior" | "Mid" | "Senior";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface InterviewTemplate {
  id: string;
  role: string;
  techstack: string[];
  type: "Technical" | "Behavioral" | "Mixed";
  level: ExperienceLevel;
  cover: string;
}
export interface NormalizedInterview {
  interviewId: string;
  role: string;
  type: "Technical" | "Behavioral" | "Mixed";
  techstack: string[];
  createdAt: string;
}

export interface RouteParams {
  params: Promise<{ id: string }>;
  searchParams?: Record<string, string>;
}


export interface InterviewQuestion {
  id: string; // unique per question (can use uuid or index string)
  question: string;
  // answer?: string; // User's response (optional, filled later)
  followUp?: string; // AI follow-up if any
}

export interface UserInterview {
  id: string;
  templateId: string;
  userId: string;
  role: string;
  level: string;
  techstack: string[];
  type: "Technical" | "Behavioral" | "Mixed";
  questions: InterviewQuestion[]; // Gemini-generated questions
  finalized: boolean;
  createdAt: string;
    limit?: number;
// ISO string or Firestore Timestamp.toDate().toISOString()
}

export interface InterviewCardProps {
  interview: NormalizedInterview;
}

export interface TranscriptMessage {
  role: "agent" | "user";
  content: string;
}

export interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
    userId: string; // ✅ Add this

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


export interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
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
  profileImage?: string;
  type: 'generate' | 'interview';
  interviewId?: string;
  questions?: InterviewQuestion[];
  feedbackId?: string;
}

export interface ResumeAnalysis {
  id: string; // Firestore doc ID
  userId: string;
  extracted: {
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: string;
    education?: string[];
    projects?: string[];
    certifications?: string[];
    summary?: string;
  };
  roles: string[];
  resumeText: string;
  createdAt: string;
}


// export interface Feedback {
//   id: string;
//   interviewId: string;
//   totalScore: number;
//   categoryScores: Array<{
//     name: string;
//     score: number;
//     comment: string;
//   }>;
//   strengths: string[];
//   areasForImprovement: string[];
//   finalAssessment: string;
//   createdAt: string;
// }

// export interface Interview {
//   id: string;
//   role: string;
//   level: string;
//   questions: string[];
//   techstack: string[];
//   createdAt: string;
//   userId: string;
//   type: "Technical" | "Behavioral" | "Mixed";
//   finalized: boolean;
// }

// export interface CreateFeedbackParams {
//   interviewId: string;
//   userId: string;
//   transcript: { role: string; content: string }[];
//   feedbackId?: string;
// }

// export interface User {
//   name: string;
//   email: string;
//   id: string;
// }

// export interface InterviewCardProps {
//     interview: Interview;

// }

// export interface GetFeedbackByInterviewIdParams {
//   interviewId: string;
//   userId: string;
// }

// export interface GetLatestInterviewsParams {
//   userId: string;
//   limit?: number;
// }


// export interface AgentProps {
//   userName: string
//   userId: string
//   profileImage?: string
//   type: 'generate' | 'interview'
//   interviewId?: string
//   questions?: string[]
//   feedbackId?: string
// }
















