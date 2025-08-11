"use client";

import { useRef } from "react";

export default function ResumeUpload({ onUpload, loading }: { onUpload: (file: File) => void; loading: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-indigo-500 bg-gray-800 rounded-lg p-10 cursor-pointer hover:bg-gray-700 transition"
      >
        <p className="text-gray-300">Click or drag & drop to upload your resume</p>
        <p className="text-sm text-gray-500 mt-2">PDF, DOCX, TXT supported</p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
      {loading && <p className="mt-4 text-indigo-400 animate-pulse">Analyzing...</p>}
    </div>
  );
}
