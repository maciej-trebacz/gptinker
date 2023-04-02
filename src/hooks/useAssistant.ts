import { useState } from 'react'

type MessageTypes = 'system' | 'assistant' | 'prompt' | 'command' | 'result'

interface Message {
  text: string
  type: MessageTypes
}

interface AssistantResponse {
  thought: string
  command: string
  parameters: Record<string, any>
}

export const useAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const executeCommand = async (command: string, parameters: Record<string, any>) => {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command,
        parameters
      }),
    })    
    const text = await response.text()
    addMessage(text, 'result')
    return text
  }

  const parseResponse = async (response: AssistantResponse, parentMessageId: string) => {
    addMessage(response.thought, 'assistant')
    if (!response.command) {
      setLoading(false)
      return
    }

    addMessage(response.command + "\n" + JSON.stringify(response.parameters, null, 2), 'command')
    const result = await executeCommand(response.command, response.parameters)
    await askAssistant(result, parentMessageId)
  }

  const addMessage = (text: string, type: MessageTypes) => {
    setMessages((messages) => [...messages, { text, type }])
  }

  const askAssistant = async (text: string, parentMessageId?: string) => {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: text,
        parentMessageId,
      }),
    })

    // FIXME: Implement error handling and retry logic
    const responseJson = await response.json()
    console.log("Assistant response", responseJson)
    const parsedResponse = JSON.parse(responseJson.text)
    await parseResponse(parsedResponse, responseJson.parentMessageId)
  }

  const sendPrompt = async (text: string) => {
    setLoading(true)
    addMessage(text, 'prompt')
    await askAssistant(text)
  }

  const reset = () => {
    setMessages([])
  }

  return {
    reset,
    loading,
    messages,
    sendPrompt,
  }
}