const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Categorization rules: order matters (first match wins)
const categories = [
  {
    name: 'set-01-logos',
    test: (f) => /-logo\.[a-z]+$/i.test(f) || ['logo.png', 'react.svg'].includes(f),
  },
  {
    name: 'set-02-pilot-gap',
    test: (f) =>
      /pilot-gap|instructor|shortage|saturation|recruiter|financial-drain|unclogging|low-timer|universal-pilot|hourglass|dream-paradox|hopeful-news|expect\.|fallen\.|candidates-|instructor-trap|bridging-the-gap|banker-vs-casino/i.test(f),
  },
  {
    name: 'set-03-recognition',
    test: (f) =>
      /^recog|^recognition|^recognizeme|^recogntion|PR\d*\.|^pr\.|prm-|Recognition\+unlock/i.test(f),
  },
  {
    name: 'set-04-screenshots',
    test: (f) =>
      /screenshot|terminal|mock\d|w1000\.|examination|wingmentor|pathwaysplatform|pilotcenter|atlascv|atlas_profile|verified\.|photo\d|image_4c913bfc|WhatsApp|Screenshot 2026|New Note|Silhouette|W1000 application| modules |Captain-Paperwork|Adobe Express/i.test(f),
  },
  {
    name: 'set-05-generated',
    test: (f) => /^Gemini_/i.test(f),
  },
  {
    name: 'set-06-pathways',
    test: (f) =>
      /pathway|type.rating|typerating|what-is-a-type|flight-bond|type\s+ratings\.png$|^type\.png$/i.test(f),
  },
  {
    name: 'set-07-ui-graphics',
    test: (f) =>
      /box\d*|building|construct|databases|crew\d|groundcrew|event\d*|search\.|phone\d?\.|worker\.|insurance-|theintervew|trailer\d|inquiry\.|foundation|foundationprogram|fp1\.|^ep\.|^dp\.|^ae\.|PASS\.|Networking|CHROME\.|icon-logo|123\.|img\d|images\.jpeg|networking/i.test(f),
  },
  {
    name: 'set-08-website',
    test: (f) => true, // catch-all
  },
];

function cleanFilename(filename) {
  // Handle corrupted multi-name files like "bridging-the-gap.png 19-03-19-143.png 07-32-03-681.png"
  // Extract the first valid filename (something.png)
  const parts = filename.split(' ');
  if (parts.length > 1) {
    // Try to find the first part that looks like a real filename
    for (let i = 0; i < parts.length; i++) {
      const p = parts.slice(0, i + 1).join(' ');
      if (/\.[a-zA-Z0-9]+$/.test(p) && !/^\d{2}-\d{2}-\d{2}-\d{3}/.test(parts[i])) {
        return p;
      }
    }
  }
  return filename;
}

function getCategory(filename) {
  for (const cat of categories) {
    if (cat.test(filename)) return cat.name;
  }
  return 'set-08-website';
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function main() {
  const files = fs.readdirSync(PUBLIC_DIR).filter((f) => /\.(png|jpe?g|webp|svg|gif)$/i.test(f));

  const referenceMap = new Map(); // reference string -> new relative path

  for (const file of files) {
    const cleanName = cleanFilename(file);
    const cat = getCategory(cleanName);
    const targetDir = path.join(IMAGES_DIR, cat);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const oldPath = path.join(PUBLIC_DIR, file);
    const newPath = path.join(targetDir, cleanName);

    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`Moved: ${file} -> images/${cat}/${cleanName}`);
    }

    const newRelative = `/images/${cat}/${cleanName}`;
    // Map both the exact old filename and the clean name as possible references
    referenceMap.set(`/${file}`, newRelative);
    if (cleanName !== file) {
      referenceMap.set(`/${cleanName}`, newRelative);
    }
  }

  // Update references in source files
  const srcDirs = ['app', 'components', 'data', 'lib', 'portal', 'public', 'scripts', 'services', 'hooks', 'routes'];
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.html', '.json', '.cjs', '.mjs'];

  const filesToScan = [];
  for (const dir of srcDirs) {
    const dirPath = path.resolve(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) continue;
    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const fullPath = path.join(d, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === '.git') continue;
          walk(fullPath);
        } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
          filesToScan.push(fullPath);
        }
      }
    };
    walk(dirPath);
  }

  // Sort by longest key first to prevent partial replacements
  const sortedRefs = [...referenceMap.entries()].sort((a, b) => b[0].length - a[0].length);

  let totalReplacements = 0;

  for (const filePath of filesToScan) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    for (const [oldRef, newRef] of sortedRefs) {
      const escaped = escapeRegex(oldRef);
      // Only replace exact references (quoted or in JSX src=, url(), etc.)
      // Use a regex that ensures we're matching a full path reference
      const regex = new RegExp(`(?<=["'\\(])${escaped}(?=["'\\)])|${escaped}`, 'g');
      content = content.replace(regex, newRef);
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated: ${path.relative(process.cwd(), filePath)}`);
      totalReplacements++;
    }
  }

  console.log(`\nDone. Moved ${files.length} files, updated ${totalReplacements} source files.`);

  // Write a manifest for reference
  const manifest = Object.fromEntries(referenceMap);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'images', 'IMAGE_RELOCATIONS.json'), JSON.stringify(manifest, null, 2));
  console.log('Manifest written to public/images/IMAGE_RELOCATIONS.json');
}

main();
