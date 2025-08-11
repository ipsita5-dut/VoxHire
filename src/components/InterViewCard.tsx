'use client';

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

import { cn, getRandomInterviewCover } from "@/lib/utils";

interface Interview {
  interviewId: string;
    userId?: string;

  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  questions: {
    question: string;
    category?: string;
    difficulty?: string;
  }[];
}


interface InterviewCardProps {
  interview: Interview;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  const { interviewId, role, type, techstack, createdAt } = interview;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeGradient =
    {
      Behavioral: "bg-gradient-to-r from-orange-500 to-pink-500",
    Mixed: "bg-gradient-to-r from-purple-600 to-indigo-500",
    Technical: "bg-gradient-to-r from-blue-500 to-cyan-500",
  }[normalizedType] || "bg-gradient-to-r from-gray-400 to-gray-600";

  const formattedDate = dayjs(createdAt || Date.now()).format("MMM D, YYYY");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 backdrop-blur-xl shadow-lg bg-white/5 text-white w-full max-w-sm p-6 space-y-5 hover:shadow-2xl transition-all"
    >
      <div className="relative p-6 flex flex-col justify-between h-full gap-4">

        {/* Badge */}
        <Badge
          className={cn(
            "absolute top-0 right-0 rounded-bl-xl rounded-tr-xl text-white px-3 py-1 text-xs z-10",
            `bg-gradient-to-r ${badgeGradient}`
          )}
        >
          {normalizedType}
        </Badge>


          {/* Cover Image */}
          <div className="flex justify-center">
        <Image
          src={getRandomInterviewCover()}
          alt="cover"
          width={80}
          height={80}
          className="rounded-full border-2 border-white shadow-lg"
        />
      </div>

          {/* Interview Role */}
<h3 className="text-center text-lg font-semibold capitalize leading-tight">
        {role} Interview
      </h3>
          {/* Date */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
          <Image src="/cal.png" width={18} height={18} alt="calendar" />
          <p>{formattedDate}</p>
        </div>

          {/* Placeholder Text */}
        <p className="text-sm text-gray-300 text-center px-2 mt-3 line-clamp-2">
            Practice this interview to assess your skills and get better prepared.
          </p>

<div className="flex justify-between items-center mt-6 gap-4">
  <div className="flex gap-2">
    <DisplayTechIcons techStack={techstack} size={26} />
  </div>

  <Link href={`/interview/${interviewId}`}>
  <Button className="btn-primary text-sm px-5 py-2.5 font-medium shadow-md hover:shadow-lg transition-all">
      View Interview
    </Button>
  </Link>
</div>
      </div>
    </motion.div>
  );
};

export default InterviewCard;
