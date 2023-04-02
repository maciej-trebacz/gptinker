import { exec } from 'child_process';

export async function executeShellCommand(command: string, directory = '.') {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: directory }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error executing command: ${error.message}`));
        return;
      }

      if (stderr) {
        reject(new Error(`stderr: ${stderr}`));
        return;
      }

      resolve(stdout);
    });
  });
}