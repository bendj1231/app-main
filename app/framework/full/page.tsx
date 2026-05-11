'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Generate ID from text
const generateId = (text: string) => {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
};

export default function FullFrameworkPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [tocItems, setTocItems] = useState<Array<{level: number; text: string; id: string}>>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/docs/universal-commercial-framework-expanded.md')
      .then(res => res.text())
      .then(text => {
        setContent(text);
        // Extract TOC items
        const items: Array<{level: number; text: string; id: string}> = [];
        const seenIds = new Set<string>();
        
        text.split('\n').forEach(line => {
          if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
            const level = line.startsWith('### ') ? 3 : line.startsWith('## ') ? 2 : 1;
            const text = line.replace(/^#+\s/, '');
            let id = generateId(text);
            // Ensure unique IDs
            let counter = 1;
            const baseId = id;
            while (seenIds.has(id)) {
              id = `${baseId}-${counter}`;
              counter++;
            }
            seenIds.add(id);
            items.push({ level, text, id });
          }
        });
        setTocItems(items);
        setLoading(false);
      })
      .catch(() => {
        setContent('# Error loading document');
        setLoading(false);
      });
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Simple markdown renderer with anchor IDs
  const renderMarkdown = (text: string) => {
    const seenIds = new Set<string>();
    let inTocSection = false;
    let tocSectionEnd = false;
    
    const lines = text.split('\n');
    
    return lines.map((line, i) => {
        // Headers with IDs
        if (line.startsWith('# ')) {
          const headingText = line.replace('# ', '');
          let id = generateId(headingText);
          let counter = 1;
          const baseId = id;
          while (seenIds.has(id)) {
            id = `${baseId}-${counter}`;
            counter++;
          }
          seenIds.add(id);
          return <h1 key={i} id={id} className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900 scroll-mt-24">{headingText}</h1>;
        }
        if (line.startsWith('## ')) {
          const headingText = line.replace('## ', '');
          let id = generateId(headingText);
          let counter = 1;
          const baseId = id;
          while (seenIds.has(id)) {
            id = `${baseId}-${counter}`;
            counter++;
          }
          seenIds.add(id);
          return <h2 key={i} id={id} className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-300 scroll-mt-24">{headingText}</h2>;
        }
        if (line.startsWith('### ')) {
          const headingText = line.replace('### ', '');
          let id = generateId(headingText);
          let counter = 1;
          const baseId = id;
          while (seenIds.has(id)) {
            id = `${baseId}-${counter}`;
            counter++;
          }
          seenIds.add(id);
          return <h3 key={i} id={id} className="text-xl font-bold text-slate-800 mt-6 mb-3 scroll-mt-24">{headingText}</h3>;
        }
        if (line.startsWith('#### ')) {
          const headingText = line.replace('#### ', '');
          let id = generateId(headingText);
          let counter = 1;
          const baseId = id;
          while (seenIds.has(id)) {
            id = `${baseId}-${counter}`;
            counter++;
          }
          seenIds.add(id);
          return <h4 key={i} id={id} className="text-lg font-bold text-slate-800 mt-4 mb-2 scroll-mt-24">{headingText}</h4>;
        }
        
        // Empty line
        if (line.trim() === '') {
          return <div key={i} className="h-4" />;
        }
        
        // Horizontal rule
        if (line.startsWith('---')) {
          return <hr key={i} className="my-8 border-slate-300" />;
        }
        
        // Track if we're in the TOC section (before first main heading)
        if (line.startsWith('# ') && !tocSectionEnd) {
          tocSectionEnd = true;
        }
        if (line.toLowerCase().includes('table of contents')) {
          inTocSection = true;
        }
        
        // Bullet points - make clickable if in TOC section
        if (line.startsWith('- ') || line.startsWith('• ')) {
          const bulletText = line.replace(/^- /, '').replace(/^• /, '');
          
          // In TOC section - try to find matching header
          if (inTocSection && tocItems.length > 0) {
            // Find matching header by comparing text (case insensitive, partial match)
            const matchingItem = tocItems.find(item => {
              const itemLower = item.text.toLowerCase();
              const bulletLower = bulletText.toLowerCase();
              // Check if bullet contains item text or vice versa
              return bulletLower.includes(itemLower) || 
                     itemLower.includes(bulletLower) ||
                     // Also check first 30 chars for partial match
                     (bulletLower.substring(0, 30).trim() === itemLower.substring(0, 30).trim()) ||
                     // Check without spaces/punctuation
                     bulletLower.replace(/[^a-z0-9]/g, '').includes(itemLower.replace(/[^a-z0-9]/g, '').substring(0, 20));
            });
            
            if (matchingItem) {
              return (
                <li key={i} className="ml-6 leading-relaxed">
                  <button 
                    onClick={() => scrollToSection(matchingItem.id)}
                    className="text-slate-700 hover:text-red-600 hover:underline transition-colors text-left cursor-pointer"
                  >
                    {bulletText}
                  </button>
                </li>
              );
            }
          }
          
          return <li key={i} className="ml-6 text-slate-700 leading-relaxed">{bulletText}</li>;
        }
        
        // Numbered lists - make clickable if in TOC section
        if (/^\d+\.\s/.test(line)) {
          const itemText = line.replace(/^\d+\.\s/, '');
          
          // In TOC section - try to find matching header
          if (inTocSection && tocItems.length > 0) {
            const matchingItem = tocItems.find(item => {
              const itemLower = item.text.toLowerCase();
              const textLower = itemText.toLowerCase();
              // Check multiple matching strategies
              return textLower.includes(itemLower) || 
                     itemLower.includes(textLower) ||
                     (textLower.substring(0, 30).trim() === itemLower.substring(0, 30).trim()) ||
                     textLower.replace(/[^a-z0-9]/g, '').includes(itemLower.replace(/[^a-z0-9]/g, '').substring(0, 20));
            });
            
            if (matchingItem) {
              return (
                <li key={i} className="ml-6 leading-relaxed">
                  <button 
                    onClick={() => scrollToSection(matchingItem.id)}
                    className="text-slate-700 hover:text-red-600 hover:underline transition-colors text-left cursor-pointer"
                  >
                    {itemText}
                  </button>
                </li>
              );
            }
          }
          
          return <li key={i} className="ml-6 text-slate-700 leading-relaxed">{itemText}</li>;
        }
        
        // Bold text
        let processedLine = line;
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Table rows
        if (line.startsWith('|')) {
          const cells = line.split('|').filter(c => c.trim());
          if (cells.length > 0 && !line.includes('---')) {
            return (
              <div key={i} className="grid grid-cols-2 gap-4 py-2 border-b border-slate-100">
                {cells.map((cell, j) => (
                  <span key={j} className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: cell.trim() }} />
                ))}
              </div>
            );
          }
          return null;
        }
        
        // Regular paragraph
        return <p key={i} className="text-slate-700 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: processedLine }} />;
      })
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading 90+ page framework...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/framework" className="text-slate-900 font-semibold hover:text-red-600 transition-colors">
              ← Back to Summary
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 text-sm">90+ Pages</span>
          </div>
          <div className="flex gap-3">
            <a 
              href="/docs/universal-commercial-framework-expanded.md"
              download
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Download .md
            </a>
            <a 
              href="/docs/universal-commercial-framework.tex"
              download
              className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
            >
              Download .tex
            </a>
          </div>
        </div>
      </nav>

      {/* Document */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12 pb-8 border-b-2 border-slate-900">
          <p className="text-sm text-slate-500 font-mono mb-2">Aviation Industry Operating System</p>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Universal Commercial Framework</h1>
          <p className="text-xl text-slate-600 italic mb-4">The Master Blueprint for the Aviation Industry Operating System</p>
          <p className="text-sm text-slate-500">Document Revision: 10.0-Expanded | 90+ Pages | May 2026</p>
        </header>

        {/* TOC Instruction */}
        <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
          <p className="text-amber-800 text-sm">
            <strong>📖 Navigation Tip:</strong> Click any item in the Table of Contents below to jump directly to that section.
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="prose prose-slate max-w-none">
          {renderMarkdown(content)}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t-2 border-slate-900 text-center">
          <p className="text-slate-600 mb-4">End of Universal Commercial Framework</p>
          <Link 
            to="/framework"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
          >
            ← Back to Framework Summary
          </Link>
        </footer>
      </article>
    </div>
  );
}
