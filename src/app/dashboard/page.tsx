import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.actions";

import Dashboard from "@/components/Dashboard"; // The main dashboard component

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

  const [userInterviews, allInterviews] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  return (
    <Dashboard
      user={user}
      userInterviews={userInterviews || []}
      allInterviews={allInterviews || []}
    />
  );
}
