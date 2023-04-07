import type { NextApiRequest, NextApiResponse } from 'next'
import { Assistant } from '@/lib/server/assistant'
import { Message } from '@/types'

interface AskRequest {
  description: string
  text: string
  messages: Message[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed: " + req.method);
    return;
  }

  const params = req.body as AskRequest;
  const assistant = new Assistant(params.description, params.messages, (message) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    await assistant.prompt(params.text);
    res.write("event: close\n\n");
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

