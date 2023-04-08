// components/LoadingSpinner.js
import React from "react";
import { MessageContainer } from "@/components/message/MessageContainer";
import { ConversationType } from "@/types";

export default function Loading() {
  return (
    <MessageContainer type={ConversationType.assistant}>
      <div className="mt-4 mb-2 flex justify-center items-center text-gray-300">
        <div className="dot bg-slate-400" style={{ animationDelay: "0s" }}></div>
        <div className="dot bg-slate-400" style={{ animationDelay: ".2s" }}></div>
        <div className="dot bg-slate-400" style={{ animationDelay: ".4s" }}></div>
        <style jsx>{`
          .dot {
            border-radius: 50%;
            width: 0.5rem;
            height: 0.5rem;
            margin: 0 0.25rem;
            animation: typing 1s infinite;
          }

          @keyframes typing {
            0%,
            100% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </MessageContainer>
  );
}
