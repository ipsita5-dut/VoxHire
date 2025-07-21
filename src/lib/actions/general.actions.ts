'use server';

import { db } from '@/admin';
import { InterviewTemplate, UserInterview, Feedback } from '@/types';
import { getDocs, collection } from 'firebase/firestore'; // Only if needed for client SDK (delete if using only admin)
import { Timestamp } from 'firebase-admin/firestore'; // Admin SDK Timestamp

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
    const doc = await db.collection('interviewTemplates').doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as InterviewTemplate) : null;
  } catch (err) {
    console.error('Error getting interview template:', err);
    return null;
  }
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

export async function createFeedback(params: {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(entry => `- ${entry.role}: ${entry.content}`)
      .join('\n');

    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001'),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer evaluating a mock interview transcript. Be objective and strict.

        Transcript:
        ${formattedTranscript}

        Score the candidate (0-100) in:
        - Communication Skills
        - Technical Knowledge
        - Problem Solving
        - Cultural Fit
        - Confidence and Clarity
      `,
      system:
        'You are an expert interviewer AI scoring a candidate. Be honest, fair, and precise.',
    });

    const feedbackData = {
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    const ref = feedbackId
      ? db.collection('feedback').doc(feedbackId)
      : db.collection('feedback').doc();

    await ref.set(feedbackData);

    return { success: true, feedbackId: ref.id };
  } catch (error) {
    console.error('createFeedback error:', error);
    return { success: false };
  }
}
