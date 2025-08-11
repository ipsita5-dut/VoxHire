"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface InterviewSection {
  category: string;
  questions: {
    question: string;
    sampleAnswer: string;
    tips: string;
  }[];
}

export default function RoleInterviewPage() {
  const { resumeId, role } = useParams<{ resumeId: string; role: string }>();
  const [sections, setSections] = useState<InterviewSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resumeId || !role) return;
    fetch(`/api/interview/full?resumeId=${resumeId}&role=${role}`)
      .then((res) => res.json())
      .then((data) => {
        setSections(data.sections || []);
        setLoading(false);
      });
  }, [resumeId, role]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-gray-400">
        Generating full interview...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-indigo-400">
        {role} – Mock Interview Guide
      </h1>

      {sections.map((section, idx) => (
        <div key={idx} className="bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
            {section.category} Questions
          </h2>
          {section.questions.map((q, i) => (
            <div key={i} className="mb-6">
              <p className="font-medium text-white">
                Q{i + 1}: {q.question}
              </p>
              <p className="mt-2 text-green-400 text-sm">
                💡 Sample Answer:{" "}
                <span className="text-gray-300">{q.sampleAnswer}</span>
              </p>
              <p className="mt-1 text-blue-400 text-xs">
                🎯 Tip: {q.tips}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
