import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = getFiles('src');
const imgSet = new Set();
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/['"](\/[a-zA-Z0-9_\-.]+\.(jpg|jpeg|png|webp|svg))['"]/g)];
  for (const m of matches) {
    imgSet.add(m[1]);
  }
}

const missing = [];
for (const img of imgSet) {
  const localPath = path.join('public', img.replace('/', ''));
  if (!fs.existsSync(localPath)) {
    missing.push(img);
  }
}

console.log('Total public images referenced:', imgSet.size);
console.log('Missing images:', missing);
