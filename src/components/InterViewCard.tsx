'use client';

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { Badge } from "./ui/badge";

import { cn, getRandomInterviewCover } from "@/lib/utils";

interface Interview {
  interviewId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface InterviewCardProps {
  interview: Interview;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  const { interviewId, role, type, techstack, createdAt } = interview;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeGradient =
    {
      Behavioral: "from-orange-500 to-pink-500",
      Mixed: "from-purple-600 to-indigo-500",
      Technical: "from-blue-500 to-cyan-500",
    }[normalizedType] || "from-slate-500 to-slate-700";

  const formattedDate = dayjs(createdAt || Date.now()).format("MMM D, YYYY");

  return (
    <div className="bg-gray rounded-2xl shadow-md w-[360px] max-sm:w-full min-h-96 overflow-hidden relative border border-gray-200">
      <div className="relative p-5 flex flex-col justify-between h-full gap-4">

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
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px]"
          />

          {/* Interview Role */}
          <h3 className="mt-5 capitalize">{role} Interview</h3>

          {/* Date */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
              <p>{formattedDate}</p>
            </div>
          </div>

          {/* Placeholder Text */}
          <p className="line-clamp-2 mt-5">
            Practice this interview to assess your skills and get better prepared.
          </p>

        <div className="flex flex-row justify-between items-center mt-5">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary text-xs px-4 py-2">
            <Link href={`/interview/${interviewId}`}>
              View Interview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
