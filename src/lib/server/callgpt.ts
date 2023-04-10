import { AssistantResponse, Message, OpenAIError } from '@/types'

const TIMEOUT = 60000

interface OpenAIResponse {
  choices: {
    message: {
      content: string
    }
  }[],
  error?: OpenAIError
}

async function tryTimes<T>(promiseFn: () => T, maxTries=10): Promise<T> {
  try {
      return await promiseFn();
  } catch (e) {
      if (maxTries > 0) {
          console.error(e)
          console.error("API call failed, retry " + maxTries)
          return tryTimes(promiseFn, maxTries - 1);
      }
      throw e;
  }
}

async function request(messages: Message[]): Promise<AssistantResponse> {
  const stripFirstThreeLines = (str: string) => {
    const lines = str.split('\n')
    return lines.slice(0, 3).join('\n')
  }

  console.log("CALLING GPT WITH MESSAGES:", messages.map(m => ({role: m.role, content: stripFirstThreeLines(m.content.substring(0, 500))})))

  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), TIMEOUT);  
  const response = await fetch(process.env.OPENAI_API_URL + '', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL,
      messages
    }),
    signal: abortController.signal
  });
  clearTimeout(timeout);

  const responseJson = await response.json() as OpenAIResponse;
  console.log("GPT RESPONSE:", responseJson)

  if (responseJson.error) {
    return {
      thought: 'OpenAI API encountered an error.',
      error: responseJson.error
    }
  }

  const content = responseJson.choices?.[0]?.message?.content
  console.log("GPT RESPONSE CONTENT:\n", responseJson.choices?.[0]?.message?.content)

  // GPT can sometimes respond with plaintext, in which case we just return that
  if (content.trim()[0] !== '{') {
    return {
      thought: content
    }
  }

  return JSON.parse(responseJson.choices[0].message.content)
}

export async function callGPT(messages: Message[]): Promise<AssistantResponse> {
  return await tryTimes(async () => await request(messages), 3)
}
