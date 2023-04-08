import React from "react";
import { ConversationItem } from "@/types";
import { MessageContainer } from "./MessageContainer";
import { MessageCommand } from "./MessageCommand";

export default function Message(props: ConversationItem) {
  const [showCommand, setShowCommand] = React.useState(false);

  return (
    <MessageContainer type={props.type}>
      {props.text}
      {props.command && (
        <div className="mt-2">
          <div
            className="flex cursor-pointer items-center"
            onClick={() => setShowCommand(!showCommand)}
          >
            <svg
              className={
                "w-[24px] fill-white transition-transform " +
                (showCommand ? "rotate-90" : "rotate-0")
              }
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="m10 17 5-5-5-5v10z"></path>
            </svg>
            <span className="font-bold text-gray-400 mr-2">Execute:</span>
            <span className="">{props.command.command}</span>
          </div>
          {showCommand && <MessageCommand {...props.command} />}
        </div>
      )}
    </MessageContainer>
  );
}
