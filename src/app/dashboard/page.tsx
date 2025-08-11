import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLatestInterviews, getExploreInterviews } from "@/lib/actions/general.actions";


import Dashboard from "@/components/Dashboard"; // The main dashboard component
import { InterviewTemplate, UserInterview } from "@/types";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    // Show fallback if not logged in
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-white text-lg">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const [userInterviews, exploreTemplates] = await Promise.all([
    getLatestInterviews({ userId: user.id }),
    getExploreInterviews(user.id),
  ]);
// ✅ Normalize user interviews
  const normalizedUserInterviews = userInterviews.map((interview: any) => ({
    interviewId: interview.id,
    role: interview.role,
    type: interview.type,
    techstack: interview.techstack,
  createdAt: interview.createdAt ?? new Date().toISOString(),
  }));

  // ✅ Normalize templates (explore)
  const normalizedExplore = exploreTemplates.map((template: InterviewTemplate) => ({
    interviewId: template.id,
    role: template.role,
    type: template.type,
    techstack: template.techstack,
    createdAt: new Date().toISOString(), // optional fallback
  }));

  return (
    <Dashboard
      user={user}
      userInterviews={normalizedUserInterviews}
      allInterviews={normalizedExplore}
    />
  );
}


