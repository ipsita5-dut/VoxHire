import { NextRequest, NextResponse } from "next/server";
import { db } from "@/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");
    if (!resumeId) {
      return NextResponse.json({ error: "Missing resumeId" }, { status: 400 });
    }

    const doc = await db.collection("users")
      .doc(currentUser.id)
      .collection("resumes")
      .doc(resumeId)
      .get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const data = doc.data();
    return NextResponse.json({ roles: data?.roles || [], resumeId });
  } catch (error) {
    console.error("Get roles error:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}
