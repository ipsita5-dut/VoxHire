'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import InterviewCard from './InterViewCard';
import { Interview, User } from '@/types';

interface DashboardProps {
  user: User;
  userInterviews: Interview[];
  allInterviews: Interview[];
}

export default function Dashboard({ user, userInterviews, allInterviews }: DashboardProps) {
  const [myInterviews, setMyInterviews] = useState<Interview[]>([]);
  const [otherInterviews, setOtherInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    if (userInterviews) setMyInterviews(userInterviews);
    if (allInterviews) setOtherInterviews(allInterviews);
  }, [userInterviews, allInterviews]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-10">
        <h1 className="text-3xl font-bold">Welcome, {user.name.split(' ')[0]}</h1>

        {/* My Interviews Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Interviews</h2>
          {myInterviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't done any interviews yet.</p>
          )}
        </section>

        {/* Explore Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Explore Mock Interviews</h2>
          {otherInterviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No mock interviews available right now.</p>
          )}
        </section>
      </main>
    </div>
  );
}
