// // app/interview/[id]/page.tsx

// import { redirect } from "next/navigation";
// import { getCurrentUser } from "@/lib/actions/auth.action";
// import { getInterviewById } from "@/lib/actions/general.actions";
// import Agent from "@/components/Agent";
// import DisplayTechIcons from "@/components/DisplayTechIcons";
// import Image from "next/image";
// import { getRandomInterviewCover } from "@/lib/utils";

// interface RouteParams {
//   params: {
//     id: string;
//   };
// }

// const InterviewDetails = async ({ params }: RouteParams) => {
//   const { id } = params;

//   const user = await getCurrentUser();
//   if (!user) redirect("/");

//   const interview = await getInterviewById(id);

//   if (!interview) return <p>Interview not found</p>;

//   return (
//     <>
//     <div className="flex flex-row gap-4 justify-between">
//         <div className="flex flex-row gap-4 items-center max-sm:flex-col">
//           <div className="flex flex-row gap-4 items-center">
//             <Image
//               src={getRandomInterviewCover()}
//               alt="cover-image"
//               width={40}
//               height={40}
//               className="rounded-full object-cover size-[40px]"
//             />
//             <h3 className="capitalize">{interview.role} Interview</h3>
//           </div>

//           <DisplayTechIcons techStack={interview.techstack} />
//         </div>

//         <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
//           {interview.type}
//         </p>
//       </div>

//       <Agent
//         role={interview.role}
//         type="interview"
//         level={interview.level}
//         techstack={interview.techstack}
//         userId={user.id}
//         templateId={id}
//       />
//     </>
//   );
// };

// export default InterviewDetails;
import Image from "next/image";
import { redirect } from "next/navigation";
import { db } from "@/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById,getUserInterview,createUserInterview, getInterviewQuestions ,getFeedbackByInterviewId} from "@/lib/actions/general.actions";
import { getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Agent from "@/components/Agent";
import { v4 as uuidv4 } from "uuid";
import { Metadata } from "next";

interface RouteParams {
  params: {
    id: string;
  };
}

export default async function InterviewDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const template  = await getInterviewById(id);
  if (!template ) return <p>Interview not found</p>;

  let userInterview = await getUserInterview(user.id, id);


  // ✅ If user interview doesn't exist, create it and generate questions
  if (!userInterview) {
    // const questions = await getInterviewQuestions(id);

    const newInterview = {
      userId: user.id,
      templateId: id,
      role: template.role,
      level: template.level,
      techstack: template.techstack,
      type: template.type,
      questions:[],
      finalized: false,
      createdAt: new Date().toISOString(),
    };

    const newInterviewId = await createUserInterview(newInterview);
    if (!newInterviewId) return <p>Failed to create interview session</p>;

     // ✅ Call the question generation API
     fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        templateId: id,        
        role: template.role,
        level: template.level,
        type:template.type,
        techstack: template.techstack,
      }),
    });
        userInterview = { ...newInterview, id: newInterviewId };
  }
    // userInterview = await getUserInterview(user.id, id);
    // if (!userInterview) return <p>Failed to load generated interview</p>;  }

    //   const questions = await getInterviewQuestions(userInterview.id);
const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });
  return (
    <section className="w-full px-4 py-10 sm:px-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={getRandomInterviewCover()}
            alt="interview-logo"
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {userInterview.role} Interview
            </h1>
            <DisplayTechIcons techStack={userInterview.techstack} />
          </div>
        </div>
        <span className="bg-dark-200 text-white text-sm px-4 py-2 rounded-lg">
          {userInterview.type}
        </span>
      </div>

      {/* Main Interview View */}
      <Agent
        userName={user.name}
        userId={user.id}
        interviewId={userInterview.id}
        type="interview"
        questions={[]} // ✅ pass full objects
      />
    </section>
  );
}

// export default InterviewDetails
