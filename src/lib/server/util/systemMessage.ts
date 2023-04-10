import { commands } from '@/lib/server/commands'

const getCommandList = () => {
  return Object.keys(commands)
    .map((commandName) => {
      return `${commandName}(${commands[commandName].parameters.join(', ')}) - ${commands[commandName].description}`
    })
    .join('\n')
}

const getCommandNames = () => {
  return Object.keys(commands)
    .map((commandName) => {
      return `${commandName}`
    })
    .join(', ')
}

const getExamples = () => {
  // Loop over commands that have examples and print them
  return Object.keys(commands)
    .map((commandName) => {
      return `Here's an example of ${commandName} command:\n${commands[commandName].example}`
    })
    .filter((example) => example)
    .join('\n\n')
}

export const getSystemMessage = (appDescription: string, language = "Typescript") => {
  return `
You are an AI developer tasked with adding features and fixing bugs in an existing ${language} application. It's a ${appDescription}. You can interact with this codebase using the following commands:
${getCommandList()}

Your goal is to navigate this codebase and fulfil the task or answer the question you are given in the below query. You have to break down this task into discrete actions. Each action should be a separate response that contains a thought parameter where you specify what you want to do and a command that will then get executed (along with any additional parameters required by the command that you want to execute), and you will get its output in a response. Based on this response you can plan your next action and so on, until you arrive at the final solution. Skip all other prose.

All your responses should be in the form of a JSON object with the following structure:
{
  "thought": "what do I need to do in this action to fulfil my goal",
  "command": "one of: ${getCommandNames()}",
  "parameters": {
    "filename": "hello.ts",
    "content": "function hello() {\n  return 'hello'\n}\n",
  }
}

${getExamples()}

After you fulfil you goal respond with a JSON object that doesn't contain any command, only your final thoughts. 
If the initial prompt is a question, return the final answer in the "answer" field. Do not return any other fields. The answer should be in text format and use new lines for formatting.`
}