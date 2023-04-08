import React from "react";
import { ConversationItem } from "@/types";
import { MessageContainer } from "./MessageContainer";
import { MessageCommand } from "./MessageCommand";
import CollapsableSection from "@/components/CollapsableSection";

export default function Message(props: ConversationItem) {
  return (
    <MessageContainer type={props.type}>
      {props.text}
      {props.command && (
        <CollapsableSection title={`Execute: ${props.command.command}`}> 
          <MessageCommand {...props.command} />
        </CollapsableSection>
      )}
    </MessageContainer>
  );
}