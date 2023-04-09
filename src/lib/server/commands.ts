import fs from "fs";
import path from "path";
import { Commands } from "@/types";
import { executeShellCommand } from "@/lib/server/executeShellCommand";
import { listFilesRecursively } from "@/lib/server/listFiles";
import { findFiles } from "@/lib/server/findFiles";
import { sanitize } from "@/lib/server/sanitize";
import { getErrorPrompt } from "@/lib/server/errorPrompt";

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

      // TODO: Linting should be configurable
      try {
        await executeShellCommand("npm run lint", this.basePath);
        return `File ${filename} written successfully.`;
      } catch (error) {
        return `File ${filename} written successfully, but linting failed with the following error: ${sanitize((error as Error).message)}`;
      }
    },
  },
  /* TODO: Need to fix this command, GPT usually gets the diff syntax wrong
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
  */
  RunCommand: {
    description: "runs a command in the shell in the repository directory so you can install dependencies, create directories, run tests, etc.",
    parameters: ['command'],
    function: async function (command: string) {
      try {
        const response = await executeShellCommand(command, this.basePath);
        return sanitize(response);
      } catch (e) {
        return `Error when executing command: ${sanitize((e as Error).message)}\n\n${getErrorPrompt(command)}`;
      }
    },
  },
  FindFiles: {
    description: "finds all files in the repository that contain a given string, returns only partial results so you need to ReadFile to get the full content later",
    parameters: ['text'],
    function: async function (text: string) {
      return await findFiles(text, this.basePath) + "\n\nNote that these are only partial results so you need to ReadFile to get the full content later."
    }
  }
};
