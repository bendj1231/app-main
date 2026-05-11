'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FullFrameworkPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/docs/universal-commercial-framework-expanded.md')
      .then(res => res.text())
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setContent('# Error loading document');
        setLoading(false);
      });
  }, []);

  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-4xl font-bold text-slate-900 mt-12 mb-6 pb-4 border-b-2 border-slate-900">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-300">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={i} className="text-lg font-bold text-slate-800 mt-4 mb-2">{line.replace('#### ', '')}</h4>;
        }
        
        // Empty line
        if (line.trim() === '') {
          return <div key={i} className="h-4" />;
        }
        
        // Horizontal rule
        if (line.startsWith('---')) {
          return <hr key={i} className="my-8 border-slate-300" />;
        }
        
        // Bullet points
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <li key={i} className="ml-6 text-slate-700 leading-relaxed">{line.replace(/^- /, '').replace(/^• /, '')}</li>;
        }
        
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          return <li key={i} className="ml-6 text-slate-700 leading-relaxed">{line.replace(/^\d+\.\s/, '')}</li>;
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

        {/* Content */}
        <div className="prose prose-slate max-w-none">
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
