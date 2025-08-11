// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/actions/auth.action";

export async function POST(req: Request) {
  const { idToken } = await req.json();

  const result = await setSessionCookie(idToken);

  if (!result.success) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
