// File: app/dashboard/profile/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getUserDocument } from '@/lib/firestore'; // Adjust path as needed
import { UserProfile } from '@/types/user'; // Adjust path as needed

export default function Profile() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const data = await getUserDocument(user.uid);
if (data) {
          setUserData(data as UserProfile); // ✅ cast to UserProfile
        }      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-red-400 text-lg">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">👤 User Profile</h1>

        <div className="space-y-4 text-base">
          <div>
            <span className="font-semibold text-gray-400">Name:</span>{' '}
            <span className="text-white">{userData.name}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-400">Email:</span>{' '}
            <span className="text-white">{userData.email}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-400">Interviews Attended:</span>{' '}
            <span className="text-white">{userData.interviewsAttended}</span>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">📈 Progress</h2>
            <div className="bg-gray-700 rounded-md p-4 overflow-x-auto text-sm">
              <pre className="whitespace-pre-wrap text-green-300">
                {JSON.stringify(userData.progress, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
