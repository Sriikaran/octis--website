const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\srika\\OneDrive\\Desktop\\octis-website';
const publicDir = path.join(rootDir, 'public');

const imgSrcRegex = /(?:src|image|img|href)=["'](\/(?:landing\/|icons\/|)[^"']+\.(?:png|jpg|jpeg|svg|webp))["']/g;
const foundPaths = new Set();

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'scripts'].includes(entry.name)) continue;
      scan(full);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
      const content = fs.readFileSync(full, 'utf8');
      let m;
      while ((m = imgSrcRegex.exec(content)) !== null) {
        foundPaths.add(m[1]);
      }
    }
  }
}

scan(rootDir);

console.log('--- Image Asset Audit ---');
let allExist = true;
foundPaths.forEach((relPath) => {
  const diskPath = path.join(publicDir, relPath.replace(/^\//, ''));
  const exists = fs.existsSync(diskPath);
  if (!exists) {
    console.error(`[MISSING ASSET] ${relPath} -> NOT FOUND at ${diskPath}`);
    allExist = false;
  } else {
    console.log(`[FOUND ASSET] ${relPath} (OK)`);
  }
});

console.log(`\nAsset Check Result: ${allExist ? 'ALL ASSETS PRESENT ON DISK ✓' : 'SOME ASSETS MISSING'}`);

