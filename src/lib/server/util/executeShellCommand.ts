import { exec } from 'child_process';

export async function executeShellCommand(command: string, directory = '.'): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: directory }, (error, stdout, stderr) => {
      if (error && error.code !== 0) {
        reject(new Error(error.message));
        return;
      }
      
      const output = stdout + (stderr ? + "\nstderr: " + stderr : '');
      resolve(output);
    });
  });
}