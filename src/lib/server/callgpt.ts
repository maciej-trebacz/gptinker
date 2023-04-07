import { AssistantResponse, Message } from '@/types'

interface OpenAIResponse {
  choices: {
    message: {
      content: string
    }
  }[]
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
  console.log("CALLING GPT WITH MESSAGES:", messages.slice(1))

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
  });


  const responseJson = await response.json() as OpenAIResponse;
  console.log("GPT RESPONSE:", responseJson.choices[0].message.content)
  const content = JSON.parse(responseJson.choices[0].message.content)
  // TODO: Check if the content object matches AssistantResponse
  return content
}

export async function callGPT(messages: Message[]): Promise<AssistantResponse> {
  return await tryTimes(async () => await request(messages), 3)
}
