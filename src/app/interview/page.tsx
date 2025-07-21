import { getCurrentUser } from "@/lib/actions/auth.action";
import Agent from "@/components/Agent";

const InterviewGeneratePage = async () => {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Interview Generator</h3>

      <Agent
        userName={user.name}
        userId={user.id}
        profileImage="/user-avatar.png"
        type="generate"
      />
    </div>
  );
};

export default InterviewGeneratePage;
