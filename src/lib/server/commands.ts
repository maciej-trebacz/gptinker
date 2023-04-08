import fs from "fs";
import path from "path";
import { Commands } from "@/types";
import { executeShellCommand } from "@/lib/server/executeShellCommand";
import { listFilesRecursively } from "@/lib/server/listFiles";
import { applyPatch } from '@/lib/server/applyPatch';

const sanitize = (text: string) => {
  // Strip ANSI escape codes
  let result = text.replace(/\u001b\[[0-9]{1,2}m/g, "");

  // Strip non-ascii characters
  result = result.replace(/[^\x00-\x7F]/g, "");

  // Trim the error message to 1500 characters if its too long
  return result.length > 1500 ? result.slice(0, 1500) + "..." : result;
}

export const commands: Commands = {
  ListFiles: {
    description: "produce a tree of directories and files in the repository",
    parameters: [],
    function: async function () {
      const files = await listFilesRecursively(this.basePath, ['node_modules', 'dist', '.git', '.next']);
      return files.join('\n');
    },
  },
  ReadFile: {
    description: "read and return the content of a given file",
    parameters: ['filename'],
    function: async function (filename: string) {
      return fs.readFileSync(path.join(this.basePath, filename), "utf8");
    },
  },
  WriteFile: {
    description: "write content to a given file",
    parameters: ['filename', 'content'],
    function: async function (filename: string, content: string) {
      fs.writeFileSync(path.join(this.basePath, filename), content);
      // TODO: Run linter for this file
      return `File ${filename} written successfully.`;
    },
  },
  PatchFile: {
    description: "applies a single change to a file. Format the change using the diff format (with - and + signs at the beginning of changed lines) and 2-line context, omitting the lines that didn't change",
    parameters: ['filename', 'patch'],
    example: `{
  "thought": "I need to change the return value of the hello function to 'goodbye'",
  "command": "PatchFile",
  "parameters": {
    "filename": "hello.ts",
    "patch": "-  return 'hello'\n+  const text = 'goodbye'\n+  return text",
  }
}`,
    function: async function (filename: string, patch: string) {
      applyPatch(path.join(this.basePath, filename), {
        before: patch.split('\n').filter(line => line.startsWith('-')).map(line => line.slice(1)),
        after: patch.split('\n').filter(line => line.startsWith('+')).map(line => line.slice(1)),
      });
      return `Changes to file ${filename} written successfully.`;
    },
  },
  RunCommand: {
    description: "runs a command in the shell in the repository directory so you can install dependencies, create directories, run tests, etc.",
    parameters: ['command'],
    function: async function (command: string) {
      try {
        const response = await executeShellCommand(command, this.basePath);
        return sanitize(response);
      } catch (e: any) {
        const errorPrompt = `Command "${command}" failed to execute. Give the user up to three options on how to proceed in the 'options' field. Use the following format:
{
  "thought": "Running the tests failed because there is no test runner installed. Please choose one of the following options:",
  "options": [
    "Install Jest and React Testing Library and try again",
    "Install Mocha and try again"
  ]
}`;
        return `Error when executing command: ${sanitize(e.message)}\n\n${errorPrompt}`;
      }
    },
  },
};
