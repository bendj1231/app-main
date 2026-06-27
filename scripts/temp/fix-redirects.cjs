const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Starting window.location.href replacements...');

// Track replacements
let replacements = 0;

// Replace onNavigate patterns
const beforeNavigate = content;
content = content.replace(
  /onNavigate=\{\(page\) => window\.location\.href = `\/\$\{page\}`\}/g,
  () => {
    replacements++;
    return 'onNavigate={(page) => safeRedirect(`/${page}`)}';
  }
);
if (content !== beforeNavigate) {
  console.log(`✓ Replaced onNavigate patterns: ${replacements}`);
}

// Replace onBack patterns
const beforeBack = content;
content = content.replace(
  /onBack=\(\) => window\.location\.href='\/'/g,
  () => {
    replacements++;
    return "onBack={() => safeRedirect('/')}";
  }
);
if (content !== beforeBack) {
  console.log(`✓ Replaced onBack('/') patterns`);
}

// Replace onBack('/about') patterns
content = content.replace(
  /onBack=\(\) => window\.location\.href='\/about'/g,
  () => {
    replacements++;
    return "onBack={() => safeRedirect('/about')}";
  }
);
if (content !== beforeBack) {
  console.log(`✓ Replaced onBack('/about') patterns`);
}

// Replace onBack('/pathways-modern') patterns
content = content.replace(
  /onBack=\(\) => window\.location\.href = '\/pathways-modern'/g,
  () => {
    replacements++;
    return "onBack={() => safeRedirect('/pathways-modern')}";
  }
);

// Replace standalone window.location.href assignments in other contexts
content = content.replace(
  /window\.location\.href = '\/'/g,
  () => {
    replacements++;
    return "safeRedirect('/')";
  }
);

content = content.replace(
  /window\.location\.href = '\/about'/g,
  () => {
    replacements++;
    return "safeRedirect('/about')";
  }
);

content = content.replace(
  /window\.location\.href = '\/recognition-plus'/g,
  () => {
    replacements++;
    return "safeRedirect('/recognition-plus')";
  }
);

// Replace auth callback patterns
content = content.replace(
  /window\.location\.href = `\/auth\/callback/g,
  () => {
    replacements++;
    return "safeRedirect(`/auth/callback";
  }
);

// Write the updated content
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n✅ Total replacements made: ${replacements}`);
console.log('File updated successfully!');
