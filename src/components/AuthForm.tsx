'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState ,useEffect} from 'react';
import { auth } from '../client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';


export default function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isSignup = mode === 'signup';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserEmail(user?.email || null);
    });

    return () => unsubscribe();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    try{
      if (isSignup) {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        // Firebase Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        const idToken = await userCredential.user.getIdToken();

        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        // Add to Firestore
        await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            name: formData.name,
            email: formData.email,
          }),
        });
        // Set Display Name
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });

        alert('Account created successfully!');
        router.push("/dashboard")
      } else {
        console.log("Email:", formData.email); // Add this
        console.log("Password:", formData.password); // Optional

        // Firebase Sign In
       const userCred = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const idToken = await userCred.user.getIdToken();

await fetch("/api/auth/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ idToken }),
});
        alert('Signed in successfully!');
        router.push("/dashboard")

      }
    } catch (error: any) {
      console.error('Firebase Auth Error:', error);

      let message = 'An unexpected error occurred. Please try again.';

      if (error.code === 'auth/invalid-email') {
        message = 'Invalid email format.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }

      alert(message);
    }
  };

   

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 text-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          {/* Email (Sign Up only) */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Confirm Password (Sign Up only) */}
          {isSignup && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold transition"
          >
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

         <p className="text-center mt-4 text-sm text-gray-400">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <a href="/auth?mode=signin" className="text-indigo-400">Sign in</a>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <a href="/auth?mode=signup" className="text-indigo-400">Sign up</a>
            </>
          )}
        </p>
      </div>
      </div>
  );
}