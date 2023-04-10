import GPT4Tokenizer from 'gpt4-tokenizer';
import { execute } from "@/lib/server/executor";
import { callGPT } from "@/lib/server/callgpt";
import {
  ConversationItem,
  ConversationType,
  Message,
  MessageRole,
} from "@/types";
import { getSummarySystemMessage, getSystemMessage } from "@/lib/server/util/systemMessage";

// Implements the main agent thought-action loop
export class Assistant {
  private basePath: string;
  private description: string;
  private messages: Message[];
  private systemMessage: string;
  private tokenizer: GPT4Tokenizer;
  private addToConversation: (item: ConversationItem) => void;

  constructor(
    basePath: string,
    description: string,
    messages: Message[] = [],
    addToConversation: (item: ConversationItem) => void
  ) {
    this.basePath = basePath;
    this.description = description;
    this.systemMessage = getSystemMessage(description);
    this.addToConversation = addToConversation;
    this.messages = messages;
    this.tokenizer = new GPT4Tokenizer({ type: 'gpt3' });
  }

  private getMessages() {
    // TODO: In future we might want to make system message configurable
    const systemMessage: Message = {
      role: MessageRole.system,
      content: this.systemMessage,
    };

    // TODO: Optimization: Parse messages and remove/trim the content that's not required anymore
    return [systemMessage, ...this.messages];
  }

  private getEstimatedTokenLength() {
    return this.getMessages().reduce((acc, message) => {
      return acc + this.tokenizer.estimateTokenCount(message.content);
    }, 0);
  }

  private getMaxTokenLength() {
    const model = process.env.OPENAI_MODEL || '';
    const maxTokens: Record<string, number> = {
      'gpt-3.5-turbo': 4096,
      'gpt-4': 8192,
      'gpt-4-32k': 32768,
    }
    return maxTokens[model] || 4096;
  }

  private getMessagesForSummary() {
    const summaryMessages: Message[] = [];
    const query = this.messages[0].content;
    summaryMessages.push({
      role: MessageRole.system,
      content: getSummarySystemMessage(query, this.description),
    })
    summaryMessages.push({
      role: MessageRole.user,
      content: this.messages.map(message => `${message.role}: ${message.content}`).join('\n'),
    })
    return summaryMessages
  }

  public async ask(text: string): Promise<void> {
    this.messages.push({
      role: MessageRole.user,
      content: text,
    });

    if (this.getEstimatedTokenLength() > this.getMaxTokenLength()) {
      if (this.tokenizer.estimateTokenCount(text) + this.tokenizer.estimateTokenCount(this.systemMessage) + 512 > this.getMaxTokenLength()) {
        // We're trying to send too much, return an error
        this.addToConversation({
          type: ConversationType.assistant,
          text: '',
          error: {
            message: 'Your request would go over max token length, aborting',
            code: 'context_length_exceeded',
            type: 'invalid_request_error'
          },
        });
        return;
      }
      else {
        // Request would go over max token length, we need to summarize the conversation
        this.addToConversation({
          type: ConversationType.assistant,
          text: 'Conversation is approaching token limit, summarizing conversation to continue...',
        });        
        const response = await callGPT(this.getMessagesForSummary());

        // Remove all messages except the prompt and the last two messages
        this.messages.splice(1, this.messages.length - 1, {
          role: MessageRole.assistant,
          content: JSON.stringify(response),
        })
        this.messages.push({
          role: MessageRole.user,
          content: `Given the above list of actions taken is there any other action remaining? If not, please respond with "Task complete.". If the task is not complete yet please state your next action and command using the JSON format we agreed upon earlier.` 
        })
      }
    }

    const response = await callGPT(this.getMessages());

    this.messages.push({
      role: MessageRole.assistant,
      content: JSON.stringify(response),
    });

    if (!response.command) {
      this.addToConversation({
        type: ConversationType.assistant,
        text: response.answer || response.thought,
        options: response.options,
        error: response.error,
      });
      return;
    }

    const result = await execute(
      this.basePath,
      response.command,
      response.parameters
    );

    this.addToConversation({
      type: ConversationType.assistant,
      text: response.thought,
      command: {
        command: response.command,
        parameters: response.parameters || {},
        result,
      },
    });

    return this.ask(result);
  }

  public async prompt(text: string): Promise<void> {
    this.addToConversation({
      type: ConversationType.prompt,
      text,
    });

    return this.ask(text);
  }
}
