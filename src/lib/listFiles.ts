import fs from "fs";
import path from "path";

export async function listFilesRecursively(dirPath: string, excludeDirs: string[] = []) {
  const resolvedDirPath = path.resolve(dirPath);
  const excludedDirsSet = new Set(excludeDirs.map((dir) => path.join(resolvedDirPath, dir)));

  async function _listFilesRecursively(currentDir: string, prefix = ''): Promise<string[]> {
    const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    const fileNames = [];

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.join(prefix, entry.name);

      if (entry.isDirectory()) {
        if (!excludedDirsSet.has(fullPath)) {
          const subFileNames = await _listFilesRecursively(fullPath, relativePath);
          fileNames.push(...subFileNames);
        }
      } else {
        fileNames.push(relativePath);
      }
    }

    return fileNames;
  }

  return _listFilesRecursively(path.resolve(dirPath));
}
