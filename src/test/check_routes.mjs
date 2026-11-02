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

const appText = fs.readFileSync('src/App.tsx', 'utf8');
const routeMatches = [...appText.matchAll(/path=["']([^"']+)["']/g)].map(m => m[1]);

const allFiles = getFiles('src');
const linkSet = new Set();
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/to=["'](\/[^"']*)["']/g)];
  for (const m of matches) {
    const clean = m[1].split('?')[0].split('#')[0];
    if (clean) linkSet.add(clean);
  }
}

const unhandled = [];
for (const link of linkSet) {
  const match = routeMatches.some(r => {
    if (r === link) return true;
    if (r.endsWith('/*') && (link === r.slice(0, -2) || link.startsWith(r.slice(0, -1)))) return true;
    if (r.includes(':')) {
      const regexStr = '^' + r.replace(/:[^/]+/g, '[^/]+') + '$';
      if (new RegExp(regexStr).test(link)) return true;
    }
    return false;
  });
  if (!match) unhandled.push(link);
}

console.log('Total routes registered in App.tsx:', routeMatches.length);
console.log('Total unique internal links checked across src/:', linkSet.size);
console.log('Unmatched internal links:', unhandled);
