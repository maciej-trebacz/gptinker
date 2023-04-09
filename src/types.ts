type Command = (this: { basePath: string }, ...args: string[]) => Promise<string>;

type CommandObject = {
  description: string;
  parameters: string[];
  example?: string;
  function: Command;
};

export interface Commands {
  [key: string]: CommandObject;
}

export enum MessageRole {
  user = "user",
  assistant = "assistant",
  system = "system",
}

export interface Message {
  role: MessageRole;
  content: string;
}

export interface OpenAIError {
  message: string
  type: string
  param: string
  code: string
}

export interface AssistantResponse {
  thought: string;
  options?: string[];
  command?: string;
  parameters?: Record<string, string>;
  answer?: string;
  error?: OpenAIError;
}

export enum ConversationType {
  prompt = "prompt",
  assistant = "assistant",
}

interface ConversationCommand {
  command: string;
  parameters: Record<string, string>;
  result: string;
}

export interface ConversationItem {
  type: ConversationType;
  text: string;
  options?: string[];
  command?: ConversationCommand; 
  error?: OpenAIError;
}