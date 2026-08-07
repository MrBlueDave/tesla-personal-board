import fs from 'fs';

const filePath = 'src/data/default-catalog.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all "bgColor": "..." with "bgColor": "transparent"
content = content.replace(/"bgColor":\s*"[^"]*"/g, '"bgColor": "transparent"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully set bgColor to transparent across all default catalog items.');
