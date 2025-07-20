'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How does the AI conduct the interview?',
    answer: 'The AI uses curated domain-specific questions and listens to your voice answers using speech recognition.',
  },
  {
    question: 'Can I choose my interview domain?',
    answer: 'Yes, you can select a domain during login or setup, such as Web Development, Data Science, etc.',
  },
  {
    question: 'Is the feedback instant?',
    answer: 'Yes, after each response, the AI evaluates and provides insights instantly.',
  },
  {
    question: 'Do I need a mic and camera?',
    answer: 'Only a mic is required for answering questions. No camera access is needed.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gray-950 text-white px-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                layout
                initial={{ borderRadius: 10 }}
                transition={{ layout: { duration: 0.5, type: 'spring' } }}
                className="bg-gray-800 p-4 rounded-xl cursor-pointer shadow hover:shadow-xl transition"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  layout="position"
                  className="flex justify-between items-center"
                >
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl"
                  >
                    +
                  </motion.span>
                </motion.div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mt-3 text-gray-300 text-sm"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}