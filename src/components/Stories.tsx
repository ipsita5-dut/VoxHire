// components/SuccessStories.tsx
"use client"
import { motion } from "framer-motion";
import Image from "next/image";

const users = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer @Google",
    imgSrc: "/users/2.jpg",
    story: "The voice-interview AI helped me gain confidence. I cracked 3 FAANG interviews after practicing here!"
  },
  {
    name: "Rohit Verma",
    role: "Backend Engineer @Amazon",
    imgSrc: "/users/1.jpg",
    story: "Super intuitive. The AI feedback made my answers more structured. Big thanks to this platform!"
  }
];

export default function SuccessStories() {
  return (
    <section className="bg-[#121212] text-white py-20 px-6 md:px-20">
      <h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
      <div className="grid md:grid-cols-2 gap-10">
        {users.map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg hover:shadow-purple-600/30 transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={user.imgSrc}
                alt={user.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-purple-500"
              />
              <div>
                <h4 className="font-semibold text-lg">{user.name}</h4>
                <p className="text-sm text-gray-400">{user.role}</p>
              </div>
            </div>
            <p className="text-gray-300">{user.story}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}