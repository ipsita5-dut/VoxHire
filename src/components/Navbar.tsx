'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/client';

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-indigo-400 hover:text-indigo-300">
            VOXHire
          </Link>
          <Link href="/" className="hover:text-indigo-300 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-indigo-300 transition">
            About Us
          </Link>
          {user && (
            <Link href="/dashboard" className="hover:text-indigo-300 transition">
              Dashboard
            </Link>
          )}
          <Link href="/resume" className="hover:text-indigo-300 transition">
            Resume 
          </Link>
        </div>

        {/* Right: Auth Buttons */}
        {!loading && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth?mode=signin">
                  <button className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth?mode=signup">
                  <button className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 transition">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}