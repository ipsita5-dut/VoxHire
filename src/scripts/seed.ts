// scripts/seed.ts
import { db } from "@/admin";

async function seedInterviews() {
  const interviews = [
    {
      role: "Frontend Developer",
      type: "Technical",
      level: "Junior",
      techstack: ["React", "Next.js"],
      coverImage: "https://source.unsplash.com/random/400x200?frontend",
      createdAt: new Date().toISOString(),
      finalized: true,
      userId: null,
    },
    {
      role: "Backend Developer",
      type: "Behavioral",
      level: "Mid",
      techstack: ["Node.js", "MongoDB"],
      coverImage: "https://source.unsplash.com/random/400x200?backend",
      createdAt: new Date().toISOString(),
      finalized: true,
      userId: null,
    },
  ];

  for (const interview of interviews) {
    await db.collection("interviews").add(interview);
    console.log(`✅ Added: ${interview.role}`);
  }

  console.log("🔥 Interview seeding complete!");
}

seedInterviews().catch((err) => {
  console.error("❌ Error seeding interviews:", err);
});
