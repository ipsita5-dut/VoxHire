"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/mappings";
import { updateUserAnswer,finalizeUserInterview ,createFeedback } from "@/lib/actions/general.actions"; // ✅ import server action

type InterviewQuestion = {
  id: string;
  question: string;
  answer?: string;
  followUp?: string;
};

type AgentProps = {
  userName: string;
  userId: string;
  interviewId?: string;  // <-- make this optional
  type: "generate" | "interview";
  questions?: InterviewQuestion[];
    profileImage?: string;  // <-- Add this line

};

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface Message {
  type: string;
  role: "user" | "system" | "assistant";
  transcript?: string;
  transcriptType?: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  type,
  questions=[],
  profileImage
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [questionIndex, setQuestionIndex] = useState(0); // ✅ for tracking answer mapping

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = async(message: Message) => {
      if (message.type === "transcript" && 
        message.transcriptType === "final" && 
        message.transcript) {
        setMessages((prev) => [...prev, { role: message.role, content: message.transcript! }]);
      if (type === "interview" && message.role === "user" && questions[questionIndex]) {
          // ✅ Save answer to backend
        if (!interviewId) {
    console.error("Missing interviewId, cannot update answer");
    return;
  }
          try {
            await updateUserAnswer({
              userInterviewId: interviewId,
              questionIndex,
              answer: message.transcript,
            });
            setQuestionIndex((prev) => prev + 1); // move to next question
          } catch (err) {
            console.error("Failed to update answer:", err);
          }
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);


 

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      const formattedQuestions = questions
        .map((q) => `Q: ${q.question}${q.followUp ? `\nFollow-up: ${q.followUp}` : ""}`)
        .join("\n");
        
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

const handleDisconnect = async () => {
  setCallStatus(CallStatus.FINISHED);
  vapi.stop();

  if (type === "interview") {
    try {
      // 1. Finalize user interview
      await finalizeUserInterview(interviewId);
      console.log("✅ Interview finalized");

      // 2. Wait until messages exist
      if (!messages.length) {
        console.warn("❌ No messages available for feedback");
        router.push("/dashboard");
        return;
      }

      // 3. Generate feedback
      const { success, feedbackId } = await createFeedback({
        interviewId,
        userId,
        transcript: messages,
      });

      if (success && feedbackId) {
        console.log("✅ Feedback created with ID:", feedbackId);
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.error("❌ Failed to generate feedback");
        router.push("/dashboard");
      }

    } catch (err) {
      console.error("⚠️ Error during disconnect:", err);
      router.push("/dashboard");
    }
  } else {
    router.push("/");
  }
};


  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai.jpg"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};


export default Agent;


