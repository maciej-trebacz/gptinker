import fs from 'fs';
import path from 'path';

const srcDir = path.join(__dirname, '..', 'src');

function countLines(file: string): number {
  const content = fs.readFileSync(file, 'utf-8');
  return content.split('\n').length;
}

function processDirectory(dir: string): number {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;
  entries.forEach((entry: fs.Dirent) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      count += countLines(fullPath);
    }
  });
  return count;
}

const loc = processDirectory(srcDir);
console.log('Total lines of code:', loc);
