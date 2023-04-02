import LoadingSpinner from "@/components/LoadingSpinner";
import Message from "@/components/message";
import Prompt from "@/components/prompt";
import { useAssistant } from "../hooks/useAssistant";

export default function Assistant() {
  const { messages, loading, sendPrompt } = useAssistant();

  return (
    <>
      {messages.length === 0 ? (
        <Prompt onSubmit={(value) => sendPrompt(value)} />
      ) : (
        <>
          {messages.map((message, index) => (
            <Message key={index} message={message.text} type={message.type} />
          ))}
        </>
      )}

      {loading && <LoadingSpinner />}
    </>
  );
}
