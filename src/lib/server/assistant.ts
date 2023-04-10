import { execute } from "@/lib/server/executor";
import { callGPT } from "@/lib/server/callgpt";
import { ConversationItem, ConversationType, Message, MessageRole } from "@/types";
import { getSystemMessage } from "@/lib/server/util/systemMessage";

export class Assistant {
  private basePath: string;
  private messages: Message[];
  private systemMessage: string;
  private onMessage: (message: ConversationItem) => void;

  constructor(basePath: string, description: string, messages: Message[] = [], onMessage: (message: ConversationItem) => void) {
    this.basePath = basePath;
    this.systemMessage = getSystemMessage(description);
    this.onMessage = onMessage;
    this.messages = messages;
  }

  private getMessages() {
    // TODO: In future we might want to make system message configurable
    const systemMessage: Message = {
      role: MessageRole.system,
      content: this.systemMessage,
    }

    // TODO: Optimization: Parse messages and remove/trim the content that's not required anymore
    return [systemMessage, ...this.messages];
  }

  public async ask(text: string): Promise<void> {
    this.messages.push({
      role: MessageRole.user,
      content: text,
    })

    const response = await callGPT(this.getMessages());

    this.messages.push({
      role: MessageRole.assistant,
      content: JSON.stringify(response),
    });

    if (!response.command) {
      this.onMessage({
        type: ConversationType.assistant,
        text: response.answer || response.thought,
        options: response.options,
        error: response.error,
      })
      return;
    }

    const result = await execute(this.basePath, response.command, response.parameters);

    this.onMessage({
      type: ConversationType.assistant,
      text: response.thought,
      command: {
        command: response.command,
        parameters: response.parameters || {},
        result,
      }
    })

    return this.ask(result);
  }

  public async prompt(text: string): Promise<void> {
    this.onMessage({
      type: ConversationType.prompt,
      text,
    })    

    return this.ask(text);
  }
}