import fs from 'fs';
import path from 'path';

// Recursively find all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
}

const srcDir = path.join(process.cwd(), 'src');
const allFiles = getAllFiles(srcDir);

const targetFiles = allFiles.filter(
  (file) => file.endsWith('.ts') || file.endsWith('.tsx')
);

console.log(`Found ${targetFiles.length} files to process.`);

targetFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf-8');
  const fileName = path.basename(file);

  // 1. Remove JSX comments { /* ... */ }
  content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

  // 2. Remove full-line single-line comments // ...
  content = content.replace(/^\s*\/\/.*$/gm, '');

  // 3. Remove existing JSDoc blocks at the top of the file
  if (content.startsWith('/**')) {
    content = content.replace(/^\/\*\*[\s\S]*?\*\/\s*/, '');
  }

  // Ensure no multiple blank lines resulted from deletion
  content = content.replace(/\n\s*\n/g, '\n\n');

  // 4. Add the standard header
  const header = `/**\n * ${fileName}\n * \n * Core component/utility for the TechHub application.\n */\n\n`;
  content = header + content.trimStart();

  fs.writeFileSync(file, content, 'utf-8');
});

console.log('Cleanup complete!');
