import { NextRequest, NextResponse } from "next/server";
import { db } from "@/admin";
import { extractTextFromFile } from "@/lib/resume";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/actions/auth.action";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
     // 1️⃣ Get logged-in user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Get file from formData
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    

    // Extract text from resume
    const resumeText = await extractTextFromFile(file);

    // Gemini prompt — only return existing fields
    const prompt = `
      You are a resume parsing AI.
      Analyze the following resume and return JSON with:
      - extracted: {
          name (if present),
          email (if present),
          phone (if present),
          skills[] (if present),
          experience (if present),
          education[] (if present),
          projects[] (if present),
          certifications[] (if present),
          summary (if present)
        }
      - roles: array of possible job roles (based on details)

      Resume:
      ${resumeText}

      IMPORTANT:
      Only include fields that actually exist in the resume.
      Do not create placeholder or null fields.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const result = await model.generateContent(prompt);

    let raw = result.response.text();
    raw = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
    parsed = JSON.parse(raw);
    } catch (err) {
    console.error("❌ JSON parse error from Gemini:", raw);
    throw err;
    }

    // Step 2: Generate preview questions for each role
    const previews: Record<string, string[]> = {};
    for (const role of parsed.roles) {
      const previewPrompt = `
        Candidate resume: ${JSON.stringify(parsed.extracted)}
        Role: ${role}
        Generate 3 realistic interview questions that could be asked in a real interview.
        Return JSON: { "questions": ["q1", "q2", "q3"] }
      `;
          const previewModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

      // const previewModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      let rawPreview = (await previewModel.generateContent(previewPrompt)).response.text();
      rawPreview = rawPreview.replace(/```json|```/g, "").trim();
      const parsedPreview = JSON.parse(rawPreview);
      previews[role] = parsedPreview.questions;
    }

    const docId = uuidv4();
    await db.collection("users")
      .doc(currentUser.id)
      .collection("resumes")
      .doc(docId)
      .set({
        ...parsed,
        resumeText,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
      });

    return NextResponse.json({ success: true, roles: parsed.roles, resumeId: docId,previews  });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
