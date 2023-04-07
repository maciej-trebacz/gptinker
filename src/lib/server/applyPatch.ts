import { readFileSync, writeFileSync } from 'fs';

export interface Patch {
  before: string[];
  after: string[];
}

export function applyPatch(filePath: string, patch: Patch): boolean {
  try {
    const fileContent = readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    const beforeBlock = patch.before.join('\n');
    const beforeBlockOccurrences = fileContent.split(beforeBlock).length - 1;

    if (beforeBlockOccurrences === 0) {
      return false;
    }

    if (beforeBlockOccurrences > 1) {
      return false;
    }

    const index = lines.findIndex(
      (line, i) =>
        lines.slice(i, i + patch.before.length).join('\n') === beforeBlock
    );

    lines.splice(index, patch.before.length, ...patch.after);
    const updatedContent = lines.join('\n');
    writeFileSync(filePath, updatedContent, 'utf-8');

    return true;
  } catch (error: any) {
    return false;
  }
}
