/**
 * Remove console.log / console.debug / console.info from production code
 * Preserves console.warn and console.error (allowed by ESLint)
 * Preserves console.log in .test files and scripts/
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const TARGET_DIRS = ['src', 'components', 'portal', 'app'];
const EXTENSIONS = ['.ts', '.tsx'];
const SKIP_DIRS = ['node_modules', 'dist', '.git', 'scripts'];

let removed = 0;
let files = 0;

function processFile(filePath: string) {
  if (basename(filePath).includes('.test.')) return;
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  
  const newLines = lines.map((line, idx) => {
    const trimmed = line.trim();
    // Match: console.log( or console.debug( or console.info(
    // But NOT console.warn or console.error
    const match = trimmed.match(/console\.(log|debug|info)\s*\(/);
    if (match) {
      removed++;
      modified = true;
      // Check if it's a standalone statement or part of an expression
      if (trimmed.startsWith('console.')) {
        return '// [AUDIT] Removed console.' + match[1] + ' // line ' + (idx + 1);
      }
      // Inline console.log within a statement — harder, skip for safety
      return line;
    }
    return line;
  });
  
  if (modified) {
    writeFileSync(filePath, newLines.join('\n'));
    files++;
  }
}

function walkDir(dir: string) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (SKIP_DIRS.includes(entry)) continue;
      walkDir(fullPath);
    } else if (stat.isFile() && EXTENSIONS.includes(extname(entry))) {
      processFile(fullPath);
    }
  }
}

for (const dir of TARGET_DIRS) {
  const fullDir = join(process.cwd(), dir);
  try {
    walkDir(fullDir);
  } catch (e) {
    console.error('Skipping', dir, e);
  }
}

console.log(`Removed ${removed} console.log/debug/info statements from ${files} files`);
