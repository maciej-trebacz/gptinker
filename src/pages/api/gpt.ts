import type { NextApiRequest, NextApiResponse } from 'next'

import { ChatGPTAPI } from "chatgpt";

const appDescription = `It's a Next.js application written in Typescript called GPT-Dev - an AI developer assistant that helps you navigate and modify codebases`

const getSystemMessage = (appDescription: string) => {
  return `
You are an AI developer tasked with adding features and fixing bugs in an existing Typescript application. ${appDescription}. You can interact with this codebase using the following commands:
ListFiles - will produce a tree of directories and files in the repository)
ReadFile - reads the contents of the specified filename
MkDir - creates a new directory with the specified name
InsertAt - adds the code either at the start or at the end of the specified file
WriteFile - writes the specified contents to the specified filename (creating the file if it doesn't exist)
NpmInstall - installs specified npm packages (equivalent to running npm install <package>)

Your goal is to navigate this codebase and fulfil the task you are given below. You have to break down this task into discrete actions. Each action should be a separate response that contains a thought parameter where you specify what you want to do and a command that will then get executed (along with any additional parameters required by the command that you want to execute), and you will get its output in a response. Based on this response you can plan your next action and so on, until you arrive at the final solution. Skip all other prose.

All your responses should be in the form of a JSON object with the following structure:
{
  "thought": "I need to list all the files in the repository",
  "command": "ListFiles",
  "parameters": {}
}

Here's an example of a ReadFile command:
{
  "thought": "...",
  "command": "ReadFile",
  "parameters": {
    "filename": "auth.ts"
  }
}

Here's an example of a MkDir command:
{
  "thought": "...",
  "command": "MkDir",
  "parameters": {
    "name": "src/hooks"
  }
}

Here's an example of a NpmInstall command:
{
  "thought": "...",
  "command": "NpmInstall",
  "parameters": {
    "packages": ["react", "react-dom"]
  }
}

Here's an example of a WriteFile command:
{
  "thought": "...",
  "command": "InsertAt",
  "parameters": {
    "filename": "hello.ts",
    "position": "start", // or "end"
    "body": "fuction hello() {\n  return 'hello'\n}\n",
  }
}

Here's an example of a WriteFile command:
{
  "thought": "...",
  "command": "WriteFile",
  "parameters": {
    "filename": "hello.ts",
    "body": "fuction hello() {\n  return 'hello'\n}\n",
  }
}

After you fulfil you goal respond with a JSON object that doesn't contain any command, only your final thoughts.`
}

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY || "",
  debug: true,
  systemMessage: getSystemMessage(appDescription),
  completionParams: {
    model: 'gpt-4'
  }
})

export async function tryTimes(promiseFn: any, maxTries=10): Promise<any> {
  try {
      return await promiseFn();
  } catch (e) {
      if (maxTries > 0) {
          console.log("API call failed, retry " + maxTries)
          return tryTimes(promiseFn, maxTries - 1);
      }
      throw e;
  }
}

type SendMessageRequest = {
  prompt: string
  parentMessageId?: string
}

type SendMessageResponse = {
  text: string
  parentMessageId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendMessageResponse>
) {
  const params = req.body as SendMessageRequest
  const response = await tryTimes(async () => await api.sendMessage(params.prompt, { parentMessageId: params.parentMessageId }), 3)

  res.status(200).json({ 
    text: response.text,
    parentMessageId: response.id
  })
}
