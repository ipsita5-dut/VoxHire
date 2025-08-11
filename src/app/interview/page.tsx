// import { getCurrentUser } from "@/lib/actions/auth.action";
// import Agent from "@/components/Agent";

// const InterviewGeneratePage = async () => {
//   const user = await getCurrentUser();

//   if (!user) return null;

//   return (
//     <div className="p-6">
//       <h3 className="text-2xl font-semibold mb-4">Interview Generator</h3>

//       <Agent
//         userName={user.name}
//         userId={user.id}
//         profileImage="/user-avatar.png"
//         type="generate"
//       />
//     </div>
//   );
// };

// export default InterviewGeneratePage;

// app/interview/page.tsx
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3 className="text-2xl font-semibold">Interview Generation</h3>

      <Agent
        userName={user?.name!}
userId={user?.id!}
        profileImage="/user-avatar.png"
        type="generate"
      />
    </>
  );
};

export default Page;


