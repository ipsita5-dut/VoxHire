"use client";

import { useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import RoleCard from "@/components/RoleCard";
import { useRouter } from "next/navigation";


export default function ResumePage() {
  const [loading, setLoading] = useState(false);
   const [roles, setRoles] = useState<string[]>([]);
  const [previews, setPreviews] = useState<Record<string, string[]>>({});
  const [resumeId, setResumeId] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/resume/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setRoles(data.roles);
      setPreviews(data.previews);
      setResumeId(data.resumeId);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Resume</h1>
      <ResumeUpload onUpload={handleUpload} loading={loading} />
     {!loading && roles.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <RoleCard
              key={role}
              role={role}
              preview={previews[role] || []}
              onViewFull={() => router.push(`/resume/${resumeId}/${encodeURIComponent(role)}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
