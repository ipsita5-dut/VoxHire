// scripts/seed.ts
import { db } from "@/admin";

async function seedInterviews() {
  const interviews = [
    {
    "id": "template_frontend_junior_001",
    "role": "Frontend Developer",
    "level": "Junior",
    "techstack": ["React", "JavaScript", "HTML", "CSS"],
    "type": "Technical",
    "cover": "https://images.unsplash.com/photo-1618005198919-d3d4b2d2a9a5"
  },
  {
    "id": "template_backend_mid_001",
    "role": "Backend Developer",
    "level": "Mid",
    "techstack": ["Node.js", "Express", "MongoDB"],
    "type": "Technical",
    "cover": "https://images.unsplash.com/photo-1581091870622-5d94a5be8f57"
  },
  {
    "id": "template_fullstack_senior_001",
    "role": "Full Stack Developer",
    "level": "Senior",
    "techstack": ["React", "Node.js", "PostgreSQL"],
    "type": "Mixed",
    "cover": "https://images.unsplash.com/photo-1593642634367-d91a135587b5"
  },
  {
    "id": "template_datascientist_junior_001",
    "role": "Data Scientist",
    "level": "Junior",
    "techstack": ["Python", "Pandas", "NumPy"],
    "type": "Technical",
    "cover": "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
  },
  {
    "id": "template_devops_mid_001",
    "role": "DevOps Engineer",
    "level": "Mid",
    "techstack": ["AWS", "Docker", "Kubernetes"],
    "type": "Technical",
    "cover": "https://images.unsplash.com/photo-1605902711622-cfb43c4437d2"
  }
  ];

  for (const interview of interviews) {
    await db.collection("interviewTemplates").add(interview);
    console.log(`✅ Added: ${interview.role}`);
  }

  console.log("🔥 Interview seeding complete!");
}

seedInterviews().catch((err) => {
  console.error("❌ Error seeding interviews:", err);
});
