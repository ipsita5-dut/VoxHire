import { NextRequest, NextResponse } from "next/server";
import { db } from "@/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");
    const role = searchParams.get("role");
    if (!resumeId || !role) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    const docRef = db.collection("users").doc(currentUser.id).collection("resumes").doc(resumeId);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    const data = doc.data();
    if (!data) {
    return NextResponse.json({ error: "No resume data found" }, { status: 404 });
    }

    if (data.fullInterviews && data.fullInterviews[role]) {
    return NextResponse.json({ sections: data.fullInterviews[role] });
    }

     // 🧠 Gemini prompt
    const prompt = `
      Candidate Resume Details: ${JSON.stringify(data.extracted, null, 2)}
      Target Role: ${role}

      Generate a full realistic interview in JSON format with:
      {
        "sections": [
          {
            "category": "Technical",
            "questions": [
              {
                "question": "string",
                "sampleAnswer": "string",
                "tips": "string"
              }
            ]
          },
          {
            "category": "Behavioral",
            "questions": [
              { "question": "...", "sampleAnswer": "...", "tips": "..." }
            ]
          },
          {
            "category": "HR",
            "questions": [
              { "question": "...", "sampleAnswer": "...", "tips": "..." }
            ]
          },
          {
            "category": "Project/Portfolio Questions",
            "questions": [
              { "question": "...", "sampleAnswer": "...", "tips": "..." }
            ]
          },
          {
            "category": "Situational/Problem-solving Questions",
            "questions": [
              { "question": "...", "sampleAnswer": "...", "tips": "..." }
            ]
          }
        ]
      }

      Rules:
      - All questions must be relevant to BOTH the candidate's resume & the given role.
      - Sample answers should be concise yet strong — ideal model answers.
      - Tips should describe what the interviewer is looking for.
      - Output valid JSON only. No markdown, no commentary.
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let raw = (await model.generateContent(prompt)).response.text();
  // 🧹 Clean up Gemini output
    raw = raw.replace(/```json|```/g, "").trim();
    raw = raw.substring(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    raw = raw.replace(/,\s*([}\]])/g, "$1"); // Remove trailing commas


    let parsed: { sections?: any[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("❌ JSON parse error from Gemini:", raw);
      return NextResponse.json({ error: "Invalid JSON from Gemini", raw }, { status: 500 });
    }

    // Validate sections
    if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
      return NextResponse.json({ error: "No valid interview sections" }, { status: 500 });
    }

    // Save to Firestore
    await docRef.update({
      [`fullInterviews.${role}`]: parsed.sections,
    });

    return NextResponse.json({ sections: parsed.sections });
  } catch (error) {
    console.error("Full interview gen error:", error);
    return NextResponse.json({ error: "Failed to generate interview" }, { status: 500 });
  }
}
