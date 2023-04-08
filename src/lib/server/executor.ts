import { commands } from "@/lib/server/commands";

export const execute = async (
  basePath: string,
  command: string,
  parameters: Record<string, string> = {}
) => {
  return await commands[command].function.call(
    { basePath },
    ...Object.values(parameters)
  );
};
