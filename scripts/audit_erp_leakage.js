const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\srika\\OneDrive\\Desktop\\octis-website';

const keywords = [
  'useAuth',
  'AuthProvider',
  'supabase',
  'firebase',
  'localhost:5000',
  'localhost:5001',
  '/api/v1',
  'postgres',
  'DATABASE_URL',
  'JWT_SECRET',
  'lib/api',
  '../lib/api',
  '../../lib/api',
];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
      scanDir(fullPath);
    } else if (entry.isFile()) {
      if (entry.name === 'package-lock.json') continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      keywords.forEach(kw => {
        if (content.includes(kw)) {
          // find lines
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.includes(kw)) {
              console.log(`MATCH: [${kw}] in ${path.relative(rootDir, fullPath)}:${idx + 1} -> ${line.trim()}`);
            }
          });
        }
      });
    }
  }
}

console.log('Scanning octis-website for ERP keywords...');
scanDir(rootDir);
console.log('Scan completed.');

