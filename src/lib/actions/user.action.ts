import { auth } from "@/admin";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies(); // ✅ await cookies()

  const session = cookieStore.get("__session")?.value; // ✅ now works
  if (!session) return null;

  try {
    const decoded = await auth.verifySessionCookie(session, true);
    return decoded;
  } catch {
    return null;
  }
}
