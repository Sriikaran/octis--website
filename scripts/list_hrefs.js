const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\srika\\OneDrive\\Desktop\\octis-website';

function findLinks(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'scripts') continue;
      findLinks(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hrefRegex = /href=["']([^"']+)["']/g;
      let match;
      while ((match = hrefRegex.exec(content)) !== null) {
        console.log(`${path.relative(rootDir, fullPath)}: href="${match[1]}"`);
      }
    }
  }
}

findLinks(rootDir);

