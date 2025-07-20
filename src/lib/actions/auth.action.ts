'use server';

import { auth, db } from '@/admin';
import { cookies } from 'next/headers';
import { User } from '@/types';

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  
  cookieStore.set('session', sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
    return { success: true }; // ✅ RETURN THIS OBJECT

}

export async function signUp(params: { uid: string; name: string; email: string }) {
  const { uid, name, email } = params;

  try {
    const existingUser = await db.collection('users').doc(uid).get();
    if (existingUser.exists) {
      return {
        success: false,
        message: 'User already exists. Please sign in instead.',
      };
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
    });

    return { success: true, message: 'Account created successfully.' };
  } catch (error: any) {
    console.error('Signup error:', error);

    if (error.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: 'Email already in use.',
      };
    }

    return { success: false, message: 'Signup failed. Please try again.' };
  }
}

export async function signIn(params: { email: string; idToken: string }) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: 'User not found.',
      };
    }

    await setSessionCookie(idToken);

    return { success: true };
  } catch (error: any) {
    console.error('SignIn error:', error);
    return { success: false, message: 'Sign in failed.' };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userDoc = await db.collection('users').doc(decodedClaims.uid).get();
    if (!userDoc.exists) return null;

    return {
      ...userDoc.data(),
      id: userDoc.id,
    } as User;
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
