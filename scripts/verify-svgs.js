import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const subfolders = [
  'public/logos/square/dark',
  'public/logos/square/light',
  'public/logos/banner/dark',
  'public/logos/banner/light'
];

let totalFiles = 0;
let errors = 0;

subfolders.forEach(sub => {
  const dirPath = path.join(rootDir, sub);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.svg'));
  
  files.forEach(file => {
    totalFiles++;
    const fullPath = path.join(dirPath, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Basic XML check
    if (!content.startsWith('<?xml') || !content.includes('<svg') || !content.includes('</svg>')) {
      console.error(`Invalid SVG structure in ${sub}/${file}`);
      errors++;
    }

    // Check opening and closing tags balance simple check
    const openTags = (content.match(/<[a-zA-Z]/g) || []).length;
    const closeTags = (content.match(/\/>|<\/[a-zA-Z]/g) || []).length;
    
    if (openTags !== closeTags) {
      console.error(`Tag mismatch in ${sub}/${file}: open=${openTags}, close=${closeTags}`);
      errors++;
    }
  });
});

console.log(`Verified ${totalFiles} SVG files. Errors: ${errors}`);
if (errors > 0) process.exit(1);
