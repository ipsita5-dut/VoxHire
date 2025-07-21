// app/interview/[id]/page.tsx

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.actions";
import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";

interface RouteParams {
  params: {
    id: string;
  };
}

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = params;

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const interview = await getInterviewById(id);

  if (!interview) return <p>Interview not found</p>;

  return (
    <>
    <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        role={interview.role}
        type="interview"
        level={interview.level}
        techstack={interview.techstack}
        userId={user.id}
        templateId={id}
      />
    </>
  );
};

export default InterviewDetails;
