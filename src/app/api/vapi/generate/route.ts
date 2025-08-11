// import { generateText } from "ai";
// import { google } from "@ai-sdk/google";

// import { db } from "@/admin";
// import { getRandomInterviewCover } from "@/lib/utils";

// export async function POST(request: Request) {
//   const { type, role, level, techstack, amount, userid,templateId } = await request.json();

//   try {
//     const { text: rawQuestions  } = await generateText({
//       model: google("gemini-1.5-flash"),
//       prompt: `Prepare questions for a job interview.
//         The job role is ${role}.
//         The job experience level is ${level}.
//         The tech stack used in the job is: ${techstack}.
//         The focus between behavioural and technical questions should lean towards: ${type}.
//         The amount of questions required is: ${amount}.
//         Please return only the questions, without any additional text.
//         The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
//         Return the questions formatted like this:
//         ["Question 1", "Question 2", "Question 3"]
        
//         Thank you! <3
//     `,
//     });

//     // const interview = {
//     //   role: role,
//     //   type: type,
//     //   level: level,
//     //   techstack: techstack.split(","),
//     //   questions: JSON.parse(questions),
//     //   userId: userid,
//     //   finalized: true,
//     //   coverImage: getRandomInterviewCover(),
//     //   createdAt: new Date().toISOString(),
//     // };

//     // Build per-user interview object
//      let parsedQuestions: string[] = [];
//     try {
//       parsedQuestions = JSON.parse(rawQuestions);
//       if (!Array.isArray(parsedQuestions) || !parsedQuestions.length) {
//         throw new Error("Parsed questions are invalid");
//       }
//     } catch (err) {
//       console.error("Error parsing questions from Gemini:", err);
//       return Response.json(
//         { success: false, error: "Failed to parse generated questions." },
//         { status: 500 }
//       );
//     }
//     const userInterview = {
//       userId: userid,
//       templateId: templateId || null,
//       role,
//       type,
//       level,
//       techstack: techstack.split(",").map((t: string) => t.trim()),
//       questions: parsedQuestions.map((q, i) => ({
//         id: `q-${i}`,
//         question: q,
//       })),
//       createdAt: new Date().toISOString(),
//       finalized: true,
//       coverImage: getRandomInterviewCover(),
//     };

//     // await db.collection("interviews").add(interview);
//         await db.collection("userInterviews").add(userInterview);


//     return Response.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error:", error);
//     return Response.json({ success: false, error: error }, { status: 500 });
//   }
// }

// export async function GET() {
//   return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
// }

// app/api/generate/interview/route.ts
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, userId, templateId } = await request.json();

  if (!userId || !templateId) {
    return Response.json({ success: false, error: "Missing userId or templateId" }, { status: 400 });
  }

  try {
    const { text: rawQuestions } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: at least 6 to 7.
        Please return only the questions, without any additional text.
        Format: ["Question 1", "Question 2", "Question 3"]
        Do NOT use *, /, or special characters.`
    });

    // Parse the generated questions
    let parsedQuestions: string[] = [];
    try {
      parsedQuestions = JSON.parse(rawQuestions);
      if (!Array.isArray(parsedQuestions) || !parsedQuestions.length) {
        throw new Error("Parsed questions are invalid");
      }
            console.log("✅ Gemini Questions:", parsedQuestions); // ✅ Log to console

    } catch (err) {
      console.error("Error parsing questions from Gemini:", err);
      return Response.json({ success: false, error: "Failed to parse generated questions." }, { status: 500 });
    }

    // Find existing non-finalized userInterview for this user/template
    const snap = await db.collection("userInterviews")
      .where("userId", "==", userId)
      .where("templateId", "==", templateId)
      .where("finalized", "==", false)
      .limit(1)
      .get();

    if (snap.empty) {
      return Response.json({ success: false, error: "No matching userInterview found to update." }, { status: 404 });
    }

    const docRef = snap.docs[0].ref;
    const interviewId = docRef.id;

    // 🔹 Build questions with metadata
    const formattedQuestions = parsedQuestions.map((q, i) => ({
      id: `q-${i + 1}`,
      question: q,
      followUp: "",
    }));

    // 🔹 Update parent doc
    await docRef.update({
      questions: formattedQuestions,
      finalized: true,
      createdAt: new Date().toISOString(),
      coverImage: getRandomInterviewCover(),
    });
  // 🔹 Add to subcollection `interviewQuestions`
    const questionsRef = db.collection("userInterviews").doc(interviewId).collection("interviewQuestions");
    const batch = db.batch();

    formattedQuestions.forEach((q) => {
      const qDoc = questionsRef.doc(q.id);
      batch.set(qDoc, q);
    });

    await batch.commit();
        console.log("✅ Interview updated with questions and subcollection");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
