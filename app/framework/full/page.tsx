'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Navigation Section Component (separate to avoid hooks in map)
function NavSection({ section, scrollToSection }: { 
  section: { id: string; label: string; level: number; children?: Array<{id: string; label: string; level: number}> },
  scrollToSection: (id: string) => void 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  console.log('NavSection rendering:', section.label, 'has children:', !!section.children, 'id:', section.id);
  
  return (
    <div className="mb-1">
      <button
        onClick={() => {
          console.log('Sidebar CLICK:', section.label, 'id:', section.id, 'has children:', !!section.children);
          if (section.children) {
            console.log('→ Toggling expand');
            setIsExpanded(!isExpanded);
          } else {
            console.log('→ Scrolling to section');
            scrollToSection(section.id);
          }
        }}
        className={`w-full text-left px-2 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-200 flex items-center justify-between ${
          section.level === 1 ? 'text-slate-900 bg-slate-100' : 'text-slate-600 pl-4'
        }`}
      >
        <span className="flex items-center">
          {section.children && (
            <span className={`text-red-600 mr-1.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>▸</span>
          )}
          {!section.children && <span className="text-slate-400 mr-1.5">•</span>}
          <span className="text-xs leading-tight">{section.label}</span>
        </span>
      </button>
      {section.children && isExpanded && (
        <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-slate-200 pl-2 overflow-visible">
          {section.children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                console.log('Child CLICK:', child.label, 'id:', child.id);
                scrollToSection(child.id);
              }}
              className="w-full text-left px-2 py-1 rounded-md text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors flex items-start gap-1.5"
            >
              <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
              <span className="leading-tight">{child.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    console.log('scrollToSection called with id:', id);
    const element = document.getElementById(id);
    console.log('Found element:', element ? 'YES' : 'NO', 'for id:', id);
    if (element) {
      console.log('Scrolling to element:', element.tagName, element.textContent?.substring(0, 50));
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error('❌ Element not found for id:', id);
      // Try to find all IDs in the document for debugging
      const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      console.log('Available IDs in document:', allIds.slice(0, 20), '...');
    }
  };

  // Left navigation sections structure - IDs must match actual document heading IDs
  const navSections = [
    { id: 'document-information', label: 'Document Info', level: 1 },
    { id: 'table-of-contents', label: 'Table of Contents', level: 1 },
    { 
      id: 'part-i-foundation-vision-pages-1-15', 
      label: 'Part I: Foundation & Vision', 
      level: 1,
      children: [
        { id: 'page-1-executive-summary', label: 'Executive Summary', level: 2 },
        { id: 'page-2-the-founders-narrative---why-this-platform-', label: "Founder's Narrative", level: 2 },
        { id: 'page-3-4-the-universal-ecosystem-philosophy', label: 'Universal Ecosystem Philosophy', level: 2 },
        { id: 'page-4-6-the-12-core-industry-failures-we-solve', label: '12 Core Industry Failures', level: 2 },
        { id: 'page-7-10-infrastructure-architecture-overview', label: 'Infrastructure Architecture', level: 2 },
      ]
    },
    { 
      id: 'part-ii-hub-a---operations-recruitment-pages-16-35', 
      label: 'Part II: Hub A - Operations & Recruitment', 
      level: 1,
      children: [
        { id: 'pillar-1-commercial-airlines-detailed', label: 'Pillar 1: Commercial Airlines', level: 2 },
        { id: 'pillar-2-cargo-freight-operators', label: 'Pillar 2: Cargo & Freight', level: 2 },
        { id: 'pillar-3-charter-business-aviation', label: 'Pillar 3: Charter & Business Aviation', level: 2 },
        { id: 'pillar-4-emerging-aviation-sectors-evtol-air-taxi-', label: 'Pillar 4: Emerging Sectors', level: 2 },
        { id: 'pillar-5-flight-training-organizations-atos', label: 'Pillar 5: Flight Training (ATOs)', level: 2 },
      ]
    },
    { 
      id: 'part-iii-hub-b---training-transition-pages-36-50', 
      label: 'Part III: Hub B - Training & Transition', 
      level: 1,
      children: [
        { id: 'pillar-6-type-rating-simulator-centers', label: 'Pillar 6: Type Rating Centers', level: 2 },
        { id: 'pillar-7-military-defense-commands', label: 'Pillar 7: Military & Defense', level: 2 },
        { id: 'pillar-8-banking-financial-institutions', label: 'Pillar 8: Banking & Financial', level: 2 },
        { id: 'pillar-9-aviation-insurance-providers', label: 'Pillar 9: Aviation Insurance', level: 2 },
      ]
    },
    { 
      id: 'part-iv-hub-c---capital-risk-compliance-pages-51-6', 
      label: 'Part IV: Hub C - Capital, Risk & Compliance', 
      level: 1,
      children: [
        { id: 'pillar-10-legal-regulatory-bodies-caap-faa-easa', label: 'Pillar 10: Legal & Regulatory', level: 2 },
        { id: 'pillar-11-verification-apis-veremark-background-ch', label: 'Pillar 11: Verification APIs', level: 2 },
        { id: 'pillar-12-flight-data-navigation-apps-navigraph-fo', label: 'Pillar 12: Flight Data & Navigation', level: 2 },
        { id: 'pillar-13-aeromedical-examiners-ames', label: 'Pillar 13: Aeromedical (AMEs)', level: 2 },
      ]
    },
    { 
      id: 'part-v-hub-d---infrastructure-data-pages-66-80', 
      label: 'Part V: Hub D - Infrastructure & Data', 
      level: 1,
      children: [
        { id: 'pillar-14-pilot-contributors-mentors-unions', label: 'Pillar 14: Pilot Contributors', level: 2 },
        { id: 'pillar-15-aircraft-manufacturers-oems-airbus-boein', label: 'Pillar 15: Manufacturers & OEMs', level: 2 },
        { id: 'pillar-16-aviation-recruitment-agencies', label: 'Pillar 16: Recruitment Agencies', level: 2 },
        { id: 'pillar-17-aviation-universities-academies', label: 'Pillar 17: Aviation Universities', level: 2 },
      ]
    },
    { 
      id: 'part-vi-hub-e---community-culture-pages-81-90', 
      label: 'Part VI: Hub E - Community & Culture', 
      level: 1,
      children: [
        { id: 'pillar-18-aviation-media-publications', label: 'Pillar 18: Aviation Media', level: 2 },
      ]
    },
    { 
      id: 'part-vii-hub-f---growth-expansion-pages-91-95', 
      label: 'Part VII: Hub F - Growth & Expansion', 
      level: 1,
      children: [
        { id: 'pillar-19-aviation-events-career-fairs', label: 'Pillar 19: Aviation Events & Career Fairs', level: 2 },
        { id: 'pillar-20-government-aviation-authorities-caap-faa', label: 'Pillar 20: Government Aviation Authorities', level: 2 },
      ]
    },
    { 
      id: 'part-viii-technical-commercial-appendices-pages-96-1', 
      label: 'Part VIII: Appendices', 
      level: 1,
      children: [
        { id: 'appendix-a-technical-integration', label: 'Appendix A: Technical Integration', level: 2 },
        { id: 'appendix-b-data-governance', label: 'Appendix B: Data Governance', level: 2 },
        { id: 'appendix-c-commercial-framework', label: 'Appendix C: Commercial Framework', level: 2 },
        { id: 'appendix-d-implementation-timeline', label: 'Appendix D: Implementation', level: 2 },
      ]
    },
    { id: 'conclusion', label: 'Conclusion', level: 1 },
  ];

  // Simple markdown renderer with anchor IDs
  const renderMarkdown = (text: string) => {
    const seenIds = new Set<string>();
    let inTocSection = false;
    let tocSectionEnd = false;
    let debugTocFound = false;
    
    const lines = text.split('\n');
    
    console.log('TOC Items loaded:', tocItems.length);
    console.log('First few TOC items:', tocItems.slice(0, 5).map(i => i.text));
    
    return lines.map((line, i) => {
        // IMPORTANT: Track TOC section FIRST (before any early returns)
        const lineLower = line.toLowerCase();
        const hasTocText = lineLower.includes('table of contents');
        const isPartHeader = line.startsWith('# PART');
        
        if (hasTocText) {
          inTocSection = true;
          debugTocFound = true;
          console.log(`✓ Line ${i}: Found "table of contents", SETTING inToc = true`);
        }
        if (inTocSection && isPartHeader) {
          inTocSection = false;
          tocSectionEnd = true;
          console.log(`✓ Line ${i}: Found "# PART", SETTING inToc = false`);
        }
        
        // Debug log
        if (i < 100 || hasTocText || isPartHeader) {
          console.log(`Line ${i}:`, line.substring(0, 60), '| inToc:', inTocSection);
        }
        
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
          console.log(`✓ H2 ID generated: "${id}" from "${headingText.substring(0, 50)}"`);
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
        
        // Bullet points
        if (line.startsWith('- ') || line.startsWith('• ')) {
          const bulletText = line.replace(/^- /, '').replace(/^• /, '');
          
          // In TOC section - try to find matching header
          if (inTocSection && tocItems.length > 0) {
            const matchingItem = tocItems.find(item => {
              const itemLower = item.text.toLowerCase();
              const bulletLower = bulletText.toLowerCase();
              return bulletLower.includes(itemLower) || 
                     itemLower.includes(bulletLower) ||
                     (bulletLower.substring(0, 30).trim() === itemLower.substring(0, 30).trim()) ||
                     bulletLower.replace(/[^a-z0-9]/g, '').includes(itemLower.replace(/[^a-z0-9]/g, '').substring(0, 20));
            });
            
            if (matchingItem) {
              return (
                <li key={i} className="ml-6 leading-relaxed flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
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
              return textLower.includes(itemLower) || 
                     itemLower.includes(textLower) ||
                     (textLower.substring(0, 30).trim() === itemLower.substring(0, 30).trim()) ||
                     textLower.replace(/[^a-z0-9]/g, '').includes(itemLower.replace(/[^a-z0-9]/g, '').substring(0, 20));
            });
            
            if (matchingItem) {
              return (
                <li key={i} className="ml-6 leading-relaxed flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
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
          // Skip separator rows like |---|---|---|
          if (line.replace(/[\|\-\s:]/g, '').length === 0) return null;
          const cells = line.split('|').filter(c => c.trim());
          if (cells.length > 0) {
            const isHeader = lines[i + 1]?.replace(/[\|\-\s:]/g, '').length === 0;
            const colCount = cells.length;
            const gridClass = colCount === 4 ? 'grid-cols-4' : colCount === 3 ? 'grid-cols-3' : 'grid-cols-2';
            // Check if it's a section header row (all cols after first are empty)
            const isSectionRow = !isHeader && cells.length >= 3 && cells[1]?.trim() === '' && cells[2]?.trim() === '';
            // Process bold markdown in cell text
            const processCellText = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            if (isSectionRow) {
              const rawLabel = cells[0]?.trim() || '';
              const isSubSection = rawLabel.startsWith('—') || rawLabel.startsWith('-—') || rawLabel.startsWith('**—');
              const sectionLabel = processCellText(rawLabel);
              return (
                <div key={i} className={`col-span-full grid ${gridClass} border-y-2 ${isSubSection ? 'py-2 mt-1 border-slate-200 bg-slate-600' : 'py-3 mt-3 border-slate-300 bg-slate-800'}`}>
                  <span className={`col-span-full px-3 font-bold text-white tracking-wide ${isSubSection ? 'text-xs' : 'text-sm uppercase'}`} dangerouslySetInnerHTML={{ __html: sectionLabel }} />
                </div>
              );
            }
            return (
              <div key={i} className={`grid py-2 border-b border-slate-200 ${gridClass} ${isHeader ? 'bg-slate-100' : ''}`}>
                {cells.map((cell, j) => {
                  const cellText = processCellText(cell.trim());
                  const isCurrentState = !isHeader && j === 1;
                  const isDiscoverCol = !isHeader && j === 3;

                  // Parse discover link: [→ Label](#id)
                  if (isDiscoverCol && cellText) {
                    const linkMatch = cell.trim().match(/\[(.+?)\]\(#(.+?)\)/);
                    if (linkMatch) {
                      return (
                        <div key={j} className="px-3 py-1">
                          <button
                            onClick={() => scrollToSection(linkMatch[2])}
                            className="text-xs text-blue-600 hover:text-red-600 hover:underline font-medium transition-colors text-left"
                          >
                            {linkMatch[1]}
                          </button>
                        </div>
                      );
                    }
                  }

                  return (
                    <span
                      key={j}
                      className={`text-sm px-3 py-1 ${isHeader ? 'text-slate-800 font-semibold' : isCurrentState ? 'text-red-600 font-medium' : 'text-slate-700'}`}
                      dangerouslySetInnerHTML={{ __html: cellText }}
                    />
                  );
                })}
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
      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
          .print\\:w-full {
            width: 100% !important;
          }
          nav.sticky {
            position: static !important;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link to="/framework" className="text-slate-900 font-semibold hover:text-red-600 transition-colors">
              ← Back to Summary
            </Link>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-600 text-sm">90+ Pages</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden sm:inline">Print Document</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout with Left Sidebar */}
      <div className="w-full flex gap-6 pl-4 pr-6 py-8 relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Left Sidebar Navigation - Hidden on mobile, toggleable */}
        <aside className={`${sidebarOpen ? 'fixed left-0 top-0 z-50 h-full w-64 pt-20 px-4' : 'hidden'} md:block md:static md:w-64 md:flex-shrink-0 md:h-fit md:print:hidden`}>
          <div className="sticky top-24 bg-slate-50 rounded-xl border border-slate-200 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-lg md:shadow-none">
            <div className="p-3 border-b border-slate-200 bg-white rounded-t-xl">
              <h2 className="font-bold text-slate-900 text-sm">📑 Quick Navigation</h2>
              <p className="text-xs text-slate-500 mt-1">Jump to any section</p>
            </div>
            <nav className="p-2">
              {navSections.map((section) => (
                <NavSection key={section.id} section={section} scrollToSection={scrollToSection} />
              ))}
            </nav>
            <div className="p-3 border-t border-slate-200">
              <button
                onClick={() => scrollToSection('conclusion')}
                className="w-full text-center py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors"
              >
                Jump to Conclusion
              </button>
            </div>
          </div>
        </aside>

        {/* Document - Full width when printing */}
        <article className="max-w-4xl mx-auto print:max-w-none print:w-full">
        {/* Header */}
        <header className="text-center mb-12 pb-8 border-b-2 border-slate-900">
          <div className="mb-6">
            <span className="text-2xl font-bold text-slate-900">Pilot</span>
            <span className="text-2xl font-bold text-red-600">Recognition</span>
            <span className="text-lg text-slate-500">.com</span>
          </div>
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
  </div>
  );
}
