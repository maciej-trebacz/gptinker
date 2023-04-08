import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { EOL } from 'os';

async function getExcludedDirs(): Promise<string[]> {
  try {
    const gitignoreContent = await fs.readFile('.gitignore', 'utf-8');
    const lines = gitignoreContent.split(EOL);
    return lines.filter(line => line.trim() !== '' && !line.startsWith('#') && line.startsWith('/')).map(line => line.substring(1));
  } catch (error) {
    console.error('Error reading .gitignore:', error);
    return [];
  }
}

export async function findFiles(text: string, directory = '.'): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const excludedDirs = await getExcludedDirs();
    const excludeFlags = excludedDirs.map(dir => `--exclude-dir=${dir}`).join(' ');
    const command = `grep -rI --exclude-dir=.git ${excludeFlags} '${text}'`
    console.log("Executing command:", command)

    exec(command, { cwd: directory }, (error, stdout) => {
      if (error) {
        reject(new Error('No files contain the specified text'));
      } else {
        const result = stdout.toString().trim();
        if (result === '') {
          reject(new Error('No files contain the specified text'));
        } else {
          resolve(result);
        }
      }
    });
  });
}