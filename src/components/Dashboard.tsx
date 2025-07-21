'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import InterviewCard from './InterViewCard';
import { NormalizedInterview, User } from '@/types';
import { motion } from 'framer-motion';

interface DashboardProps {
  user: User;
  userInterviews: NormalizedInterview[];
  allInterviews: NormalizedInterview[];
}

export default function Dashboard({ user, userInterviews, allInterviews }: DashboardProps) {
  const [myInterviews, setMyInterviews] = useState<NormalizedInterview[]>([]);
const [otherInterviews, setOtherInterviews] = useState<NormalizedInterview[]>([]);

  useEffect(() => {
    if (userInterviews) setMyInterviews(userInterviews);
    if (allInterviews) setOtherInterviews(allInterviews);
  }, [userInterviews, allInterviews]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1d1d49] via-[#0b1736] to-[#033254] font-sans text-white">
<aside className="w-64 min-h-screen">
    <Sidebar />
  </aside>
        <main className="flex-1 p-8 space-y-12">
      <motion.h1
          className="text-4xl font-semibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, {user.name.split(' ')[0]}
        </motion.h1>

        {/* My Interviews Section */}
        <section className="space-y-5">
          <motion.h2
            className="text-2xl font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Your Interviews
          </motion.h2>
          {myInterviews.length > 0 ? (
            <motion.div
              className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
               {myInterviews.map((interview) => (
                <motion.div
                  key={interview.interviewId}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <InterviewCard interview={interview} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-500">You haven't done any interviews yet.</p>
          )}
        </section>

        {/* Explore Section */}
        <section className="space-y-5">
          <motion.h2
            className="text-2xl font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Explore Mock Interviews
          </motion.h2>

          {otherInterviews.length > 0 ? (
            <motion.div
              className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {otherInterviews.map((interview) => (
                <motion.div
                  key={interview.interviewId}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <InterviewCard interview={interview} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-500">No mock interviews available right now.</p>
          )}
        </section>
      </main>
    </div>
  );
}
