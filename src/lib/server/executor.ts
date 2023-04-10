import { commands } from "@/lib/server/commands";
import { sanitize } from "@/lib/server/util/sanitize";
import { getErrorPrompt } from "@/lib/server/util/errorPrompt";

export const execute = async (
  basePath: string,
  command: string,
  parameters: Record<string, string> = {}
) => {
  try {
    return await commands[command].function.call(
      { basePath },
      ...Object.values(parameters)
    );
  } catch (e) {
    return `${sanitize((e as Error).stack || (e as Error).message)}\n\n${getErrorPrompt(command)}`;
  }
};
