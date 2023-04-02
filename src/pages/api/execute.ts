import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from 'next'
import { executeShellCommand } from "@/lib/executeShellCommand";
import { listFilesRecursively } from "@/lib/listFiles";

const basePath = "/Users/mav/stuff/gpt-dev";

const commands: any = {
  ListFiles: async () => {
    const files = await listFilesRecursively(basePath, ['node_modules', 'dist', '.git', '.next']);
    return files.join('\n')
  },
  ReadFile: async (filename: string) => {
    return fs.readFileSync(path.join(basePath, filename), "utf8")
  },
  MkDir: async (name: string) => {
    fs.mkdirSync(path.join(basePath, name))
    return `Directory ${name} created successfully.`
  },
  WriteFile: async (filename: string, body: string) => {
    fs.writeFileSync(path.join(basePath, filename), body);
    return `File ${filename} written successfully.`
  },
  InsertAt: async (filename: string, position: string, body: string) => {
    if (position !== 'start' && position !== 'end') {
      return 'Position argument must be either "start" or "end".'
    } else if (position === 'start') {      
      const contents = fs.readFileSync(path.join(basePath, filename), "utf8")
      fs.writeFileSync(path.join(basePath, filename), body + "\n" + contents);
    } else {
      fs.appendFileSync(path.join(basePath, filename), "\n" + body);
    }
  },
  NpmInstall: async (packages: string[]) => {
    try {
      await executeShellCommand(`npm i -S ${packages.join(" ")}`, basePath);
      return `Packages ${packages.join(", ")} installed successfully.`
    } catch(e) {
      return 'Error installing packages: ' + e;
    }
  }
}

type ExecuteRequest = {
  command: string,
  parameters: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const params = req.body as ExecuteRequest
  console.log("PARAMS", params)
  const result = await commands[params.command](...Object.values(params.parameters || {}))
  res.status(200).end(result)
}
