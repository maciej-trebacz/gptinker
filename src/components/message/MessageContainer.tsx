import { ConversationType } from "@/types";

export function MessageContainer(props: {
  type: ConversationType;
  children: React.ReactNode;
}) {
  const isPrompt = props.type === ConversationType.prompt;
  const position = isPrompt ? "justify-end" : "";
  const boxColors = isPrompt
    ? "border-blue-800 bg-blue-900"
    : "border-gray-800 bg-gray-900";
  const typeClass = isPrompt ? "text-blue-300 text-right" : "text-gray-400";
  return (
    <div className={`flex ${position}`}>
      <div
        className={`mt-4 p-2 max-w-[80%] border rounded-md whitespace-pre-wrap ${boxColors}`}
      >
        <div className={`uppercase font-bold text-sm mb-2 ${typeClass}`}>
          {props.type}
        </div>
        {props.children}
      </div>
    </div>
  );
}