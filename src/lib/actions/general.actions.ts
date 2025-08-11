'use server';

import { db } from '@/admin';
import { InterviewTemplate, UserInterview, Feedback ,InterviewQuestion,  CreateFeedbackParams,
  GetFeedbackByInterviewIdParams,} from '@/types';
import { getDocs, collection } from 'firebase/firestore'; // Only if needed for client SDK (delete if using only admin)
import { Timestamp } from 'firebase-admin/firestore'; // Admin SDK Timestamp
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from '@/mappings'; // Make sure this exists

// ✅ Fetch finalized interviews for a specific user
export async function getLatestInterviews({ userId, limit: max = 10 }: { userId: string, limit?: number }): Promise<UserInterview[]> {
  try {
    const ref = db.collection("userInterviews");
    const q = ref
      .where("userId", "==", userId)
      .where("finalized", "==", true)
      .orderBy("createdAt", "desc")
      .limit(max);

    const snapshot = await q.get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserInterview[];
  } catch (err) {
    console.error("Error fetching latest interviews:", err);
    return [];
  }
}


// ✅ Get explore templates (excluding finalized ones by current user)
export async function getExploreInterviews(userId: string): Promise<InterviewTemplate[]> {
  try {
    const templatesSnap = await db.collection("interviewTemplates").get();
    const templates = templatesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as InterviewTemplate[];

    const userInterviewsSnap = await db.collection("userInterviews")
      .where("userId", "==", userId)
      .where("finalized", "==", true)
      .get();

// Extract attempted templateIds
    const attemptedTemplateIds = userInterviewsSnap.docs.map(doc => {
      const data = doc.data() as UserInterview;
      return data.templateId;
    });
    const filtered = templates.filter(template => !attemptedTemplateIds.includes(template.id));

    return filtered;
  } catch (err) {
    console.error("Error in getExploreInterviews:", err);
    return [];
  }
}

// ✅ 3. Get a template by its ID
export async function getInterviewById(id: string): Promise<InterviewTemplate | null> {
  try {
    const doc = await db.collection('userInterviews').doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as InterviewTemplate) : null;
  } catch (err) {
    console.error('Error getting interview template:', err);
    return null;
  }
}

// ✅ Get UserInterview by user + templateId (not finalized)
export async function getUserInterview(userId: string, templateId: string): Promise<UserInterview | null> {
  const snap = await db.collection("userInterviews")
    .where("userId", "==", userId)
    .where("templateId", "==", templateId)
    .where("finalized", "==", false)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as UserInterview;
}

// ✅ Create a new UserInterview
export async function createUserInterview(
  interview: Omit<UserInterview, 'id'>
): Promise<string | null> {
  try {
    const ref = await db.collection('userInterviews').add(interview);
    return ref.id;
  } catch (err) {
    console.error("Error creating user interview:", err);
    return null;
  }
}


// ✅ Get interview questions from separate subcollection
export async function getInterviewQuestions(interviewId: string): Promise<InterviewQuestion[]> {
  try {
    const snap = await db.collection('userInterviews').doc(interviewId).collection('interviewQuestions').get();
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as InterviewQuestion[];
  } catch (err) {
    console.error('Error fetching interview questions:', err);
    return [];
  }
}

export async function updateUserAnswer({
  userInterviewId,
  questionIndex,
  answer,
}: {
  userInterviewId: string;
  questionIndex: number;
  answer: string;
}) {
const interviewRef = db.collection('userInterviews').doc(userInterviewId);
const snapshot = await interviewRef.get();

  if (!snapshot.exists) throw new Error('Interview not found');

  const data = snapshot.data() as UserInterview;
  const updatedQuestions = [...data.questions];
  const question = updatedQuestions[questionIndex];

  // Update in main array
  updatedQuestions[questionIndex] = {
    ...question,
  };


  const subRef = interviewRef.collection("interviewQuestions").doc(String(questionIndex));
  await subRef.set({
    question: question.question,
    followUp: question.followUp || null,
    answer,
    index: questionIndex,
  });
}

// ✅ Finalize interview
export async function finalizeUserInterview(interviewId: string) {
  const interviewRef = db.collection("userInterviews").doc(interviewId);
  await interviewRef.update({
    finalized: true,
    createdAt: new Date().toISOString(),
  });
}


// export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
//   const snapshot = await db
//     .collection('interviews')
//     .where('userId', '==', userId)
//     .orderBy('createdAt', 'desc')
//     .get();

// return snapshot.docs.map(doc => {
//   const data = doc.data();

//   const createdAt = (() => {
//     const value = data.createdAt;
//     if (!value) return null;

//     // Real Firestore Timestamp
//     if (typeof value.toDate === "function") {
//       return value.toDate().toISOString();
//     }

//     // Manually inserted timestamp object
//     if (value._seconds) {
//       const millis = value._seconds * 1000 + Math.floor((value._nanoseconds || 0) / 1_000_000);
//       return new Date(millis).toISOString();
//     }

//     return null;
//   })();

//   return {
//     id: doc.id,
//     ...data,
//     createdAt,
//   };
// }) as Interview[];

// }

// export async function getLatestInterviews(params: {
//   userId?: string;
//   limit?: number;
// }): Promise<Interview[] | null> {
//   const { userId, limit = 20 } = params;

//   const snapshot = await db
//     .collection('interviews')
//     .where('finalized', '==', true)
//     .orderBy('createdAt', 'desc')
//     .limit(limit * 2) // fetch extra to compensate for client-side filtering
//     .get();

    
// const interviews = snapshot.docs.map(doc => {
//   const data = doc.data();
//   const createdAt = (() => {
//   const value = data.createdAt;
//   if (!value) return null;

//   if (typeof value.toDate === 'function') {
//     return value.toDate().toISOString();
//   }

//   if (value._seconds) {
//     const millis = value._seconds * 1000 + Math.floor((value._nanoseconds || 0) / 1_000_000);
//     return new Date(millis).toISOString();
//   }

//   return null;
// })();

//   return {
//   id: doc.id,
//   ...data,
//   createdAt,
// };

// }) as Interview[];


//   const filtered = interviews.filter(interview => interview.userId !== userId).slice(0, limit);


//   return filtered;
// }

export async function getFeedbackByInterviewId(params: {
  interviewId: string;
  userId: string;
}): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const snapshot = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '==', userId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Feedback;
}

// export async function getInterviewById(id: string): Promise<Interview | null> {
//   const doc = await db.collection('interviews').doc(id).get();
//   return doc.exists ? ({ id: doc.id, ...doc.data() } as Interview) : null;
// }

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    // 🧠 Generate feedback using Gemini
    const result = await generateObject({
      model: google("gemini-1.5-flash", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.

        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
      `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories.",
    });

    // ❌ Handle generation failure
    if (!result || !result.object) {
      console.error("❌ Failed to generate feedback object from Gemini", result);
      return { success: false };
    }

    const object = result.object;

    // 📝 Construct feedback object
const feedback: Omit<Feedback, 'id'> = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    // 📥 Save to Firestore
    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("🚨 Error saving feedback:", error);
    return { success: false };
  }
}
