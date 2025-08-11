'use client';

import { motion } from 'framer-motion';
import { PlayCircle, HelpCircle, Mic, BarChart } from 'lucide-react';

const steps = [
  {
    title: 'Get Started',
    icon: PlayCircle,
    description: 'Login and select your interview domain.',
  },
  {
    title: 'Questions',
    icon: HelpCircle,
    description: 'AI asks you curated voice-based questions.',
  },
  {
    title: 'Answers',
    icon: Mic,
    description: 'You answer live through your mic.',
  },
  {
    title: 'Report',
    icon: BarChart,
    description: 'Receive AI-powered feedback instantly.',
  },
];

export default function Work() {
  return (
    <section className="py-20 bg-gray-900 text-gray-100 px-4 md:px-12">
      <motion.div
        className="max-w-7xl mx-auto text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-bold mb-16 text-white">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl hover:shadow-indigo-500/30 transition w-full md:w-1/4"
              whileHover={{ scale: 1.07 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6, ease: 'easeOut' }}
            >
              <step.icon size={40} className="text-indigo-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}