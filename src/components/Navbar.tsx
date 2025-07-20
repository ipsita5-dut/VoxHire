'use client';

import Link from 'next/link';

export default function Navbar() {
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
          <Link href="/dashboard" className="hover:text-indigo-300 transition">
            Dashboard
          </Link>
          <Link href="/resume" className="hover:text-indigo-300 transition">
            Resume 
          </Link>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </nav>
  );
}