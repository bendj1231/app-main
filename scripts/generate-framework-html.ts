import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

// Simple markdown to HTML converter
function markdownToHTML(markdown: string): string {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^# (.*$)/gim, '<h1 id="$1">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 id="$1">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4 id="$1">$1</h4>');
  html = html.replace(/^##### (.*$)/gim, '<h5 id="$1">$1</h5>');
  
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // Convert bullet points
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
  
  // Convert numbered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // Convert tables (basic)
  const tableRegex = /\|(.+)\|/g;
  if (html.match(tableRegex)) {
    html = html.replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map((c: string) => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    });
  }
  
  // Wrap paragraphs
  html = html.replace(/^(?!<[hlu])(.*$)/gim, '<p>$1</p>');
  
  // Remove HTML comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  
  return html;
}

function generateId(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function generateFrameworkHTML() {
  const markdownPath = join(process.cwd(), 'docs', 'universal-commercial-framework-expanded.md');
  const outputPath = join(process.cwd(), 'dist', 'framework', 'full', 'index.html');
  
  // Create output directory if it doesn't exist
  const outputDir = dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
    console.log('Created directory:', outputDir);
  }
  
  console.log('Reading markdown from:', markdownPath);
  const markdown = readFileSync(markdownPath, 'utf-8');
  
  // Process markdown to extract content with IDs
  const lines = markdown.split('\n');
  let processedContent = '';
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '');
      const id = generateId(text);
      processedContent += `<h1 id="${id}">${text}</h1>\n`;
    } else if (line.startsWith('## ')) {
      const text = line.replace('## ', '');
      const id = generateId(text);
      processedContent += `<h2 id="${id}">${text}</h2>\n`;
    } else if (line.startsWith('### ')) {
      const text = line.replace('### ', '');
      const id = generateId(text);
      processedContent += `<h3 id="${id}">${text}</h3>\n`;
    } else if (line.startsWith('#### ')) {
      const text = line.replace('#### ', '');
      const id = generateId(text);
      processedContent += `<h4 id="${id}">${text}</h4>\n`;
    } else if (line.startsWith('- ')) {
      processedContent += `<li>${line.replace('- ', '')}</li>\n`;
    } else if (line.trim() === '') {
      processedContent += '<br/>\n';
    } else if (line.startsWith('---')) {
      processedContent += '<hr/>\n';
    } else {
      // Regular text with bold
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/<span style="color:red">(.*?)<\/span>/g, '<span style="color:red">$1</span>')
        .replace(/<span style="color:#0066cc">(.*?)<\/span>/g, '<span style="color:#0066cc">$1</span>');
      processedContent += `<p>${formatted}</p>\n`;
    }
  }
  
  // Group consecutive li elements into ul
  processedContent = processedContent.replace(/(<li>.*?<\/li>\n)+/g, '<ul>$&</ul>\n');
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Universal Commercial Framework | PilotRecognition.com - Aviation Industry Operating System</title>
  <meta name="description" content="The Master Blueprint for the Aviation Industry Operating System. 21 Pillars covering Commercial Airlines, Cargo & Freight, Charter Aviation, Flight Training, Background Checks, Government Authorities, and Humanitarian Missions.">
  <meta name="keywords" content="aviation industry framework, pilot recognition system, commercial aviation framework, flight training organizations, aviation verification, pilot career pathways, aviation ecosystem">
  <link rel="canonical" href="https://pilotrecognition.com/framework/full">
  <meta property="og:title" content="Universal Commercial Framework | PilotRecognition.com">
  <meta property="og:description" content="The Master Blueprint for the Aviation Industry Operating System - 21 Pillars covering the complete aviation ecosystem.">
  <meta property="og:url" content="https://pilotrecognition.com/framework/full">
  <meta property="og:type" content="website">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #1e293b; }
    h1 { font-size: 2.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 2px solid #1e293b; padding-bottom: 0.5rem; }
    h2 { font-size: 1.8rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.5rem; color: #334155; }
    h3 { font-size: 1.4rem; font-weight: bold; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #475569; }
    h4 { font-size: 1.2rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; color: #64748b; }
    p { margin-bottom: 1rem; }
    ul { margin-bottom: 1rem; padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    strong { font-weight: 600; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 2rem 0; }
    a { color: #2563eb; text-decoration: underline; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    td, th { border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; }
    .header { text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 2px solid #1e293b; }
    .header h1 { border: none; margin-top: 0; }
    .subtitle { font-size: 1.25rem; color: #64748b; font-style: italic; margin-bottom: 1rem; }
    .meta { color: #94a3b8; font-size: 0.875rem; }
    .loading { text-align: center; padding: 3rem; }
    .client-note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin: 1rem 0; }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">
      <span style="color: #1e293b;">Pilot</span><span style="color: #dc2626;">Recognition</span><span style="color: #64748b;">.com</span>
    </div>
    <p class="meta">Aviation Industry Operating System</p>
    <h1>Universal Commercial Framework</h1>
    <p class="subtitle">The Master Blueprint for the Aviation Industry Operating System</p>
    <p class="meta">Document Revision: 10.0-Expanded | 90+ Pages | 21 Pillars | May 2026</p>
  </div>
  
  <div class="client-note">
    <strong>For the interactive version:</strong> Visit <a href="/framework/full">/framework/full</a> to access the full interactive framework with navigation, collapsible sections, and search.
  </div>
  
  <article>
${processedContent}
  </article>
  
  <footer style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #1e293b;">
    <p>End of Universal Commercial Framework</p>
    <p><a href="/framework">← Back to Framework Summary</a></p>
  </footer>
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Universal Commercial Framework",
    "description": "The Master Blueprint for the Aviation Industry Operating System",
    "url": "https://pilotrecognition.com/framework/full",
    "publisher": {
      "@type": "Organization",
      "name": "PilotRecognition.com",
      "url": "https://pilotrecognition.com"
    }
  }
  </script>
</body>
</html>`;
  
  writeFileSync(outputPath, html);
  console.log('Generated static HTML at:', outputPath);
}

generateFrameworkHTML();
