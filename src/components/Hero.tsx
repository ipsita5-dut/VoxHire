'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 text-white px-6">
      <motion.div
        className="text-center max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Prepare Smarter with Voice-Assisted AI Interviews
        </h1>
        <p className="text-xl mb-8">
          Practice real-time interviews with AI that listens, responds, and guides you toward success.
        </p>
        <button className="bg-white text-indigo-800 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
          Start Practicing
        </button>
      </motion.div>
    </section>
  );
}