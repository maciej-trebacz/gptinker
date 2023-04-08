import { useState } from 'react'
import APICaller from '@/lib/api';
import { ConversationItem, ConversationType, Message, MessageRole } from '@/types';

export const useAssistant = () => {
  const [conversationItems, setConversationItems] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const api = new APICaller();

  const reset = () => {
    setConversationItems([]);
  };

  const addConversationItem = (item: ConversationItem) => {
    setConversationItems((prev) => [...prev, item]);
  };

  const convertToMessages = (): Message[] => {
    const messages: Message[] = [];
    conversationItems.forEach((item) => {
      if (item.type === ConversationType.prompt) {
        messages.push({
          role: MessageRole.user,
          content: item.text,
        });
      } else {
        const content = JSON.stringify({
          thought: item.text,
          command: item.command?.command,
          parameters: item.command?.parameters,
        });

        messages.push({
          role: MessageRole.assistant,
          content,
        });

        if (item.command?.result) {
          messages.push({
            role: MessageRole.assistant,
            content: item.command.result,
          });
        }
      }
    });
    return messages;
  };

  const ask = async (description: string, text: string, basePath: string) => {
    setLoading(true);

    const callbacks = {
      onMessage: ((message: ConversationItem) => {
        console.log("Received message:", message);
        addConversationItem(message);
      }),
    
      onClose: (() => {
        setLoading(false);
      }),
    
      onError: ((error: Error) => {
        console.error("EventSource error:", error);
        setLoading(false);
      })
    };

    try {
      const messages = convertToMessages();
      await api.ask(description, text, callbacks, messages, basePath);
    } catch (error) {
      console.error("API call error:", error);
      setLoading(false);
    }    
  };

  return {
    loading,
    ask,
    conversationItems,
    reset
  }
}
