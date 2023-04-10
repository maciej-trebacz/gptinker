import React from "react";
import { ConversationItem } from "@/types";
import { MessageContainer } from "./MessageContainer";
import { MessageCommand } from "./MessageCommand";
import CollapsableSection from "@/components/CollapsableSection";

export default function Message(props: ConversationItem) {
  return (
    <MessageContainer type={props.type} error={props.error}>
      {props.text}
      {props.command && (
        <CollapsableSection title={`Execute: ${props.command.command}`}>
          <MessageCommand {...props.command} />
        </CollapsableSection>
      )}
      <div>{props.error && JSON.stringify(props.error, null, 2)}</div>
    </MessageContainer>
  );
}
