import { signUp } from '@/lib/actions/auth.action';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { uid, name, email } = await req.json();
  const result = await signUp({ uid, name, email });

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: result.message });
}
