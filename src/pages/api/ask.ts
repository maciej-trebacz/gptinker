import type { NextApiRequest, NextApiResponse } from 'next';
import { Assistant } from '@/lib/server/assistant';
import { Message } from '@/types';
import { ServerResponse } from 'http';

interface AskRequest {
  basePath: string;
  description: string;
  text: string;
  messages: Message[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed: ' + req.method);
    return;
  }

  const params = req.body as AskRequest;
  const sseRes = new ServerResponse(req); // Create a new ServerResponse object for SSE

  // Set up error event listener
  sseRes.on('error', (error) => {
    console.error(error);
    res.status(500).send('Internal Server Error'); // Use the original 'res' object to send an error response
  });

  const assistant = new Assistant(params.basePath, params.description, params.messages, (item) => {
    // Sends conversation items via Server-Sent Events back to the client
    sseRes.write(`data: ${JSON.stringify(item)}\n\n`);
  });

  sseRes.setHeader('Content-Type', 'text/event-stream');
  sseRes.setHeader('Cache-Control', 'no-cache');
  sseRes.setHeader('Connection', 'keep-alive');
  sseRes.flushHeaders();

  try {
    await assistant.prompt(params.text);
    sseRes.write('event: close\n\n');
    sseRes.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'); // Use the original 'res' object to send an error response
  }
}
