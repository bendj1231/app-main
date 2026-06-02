'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Shield, Database, Lock, Globe, Cpu, Server, Layers } from 'lucide-react';

const architectureDocs = [
  {
    id: '01-multi-domain-architecture',
    title: 'Multi-Domain Architecture',
    description: 'Three-domain platform architecture: pilotrecognition.com, pilotcareerpathways.com, pilotshortage.org',
    icon: Globe,
    category: 'Domain Infrastructure',
  },
  {
    id: '02-domain-routing-detection',
    title: 'Domain Routing & Detection',
    description: 'Hostname-based routing, middleware implementation, and domain detection logic',
    icon: Server,
    category: 'Domain Infrastructure',
  },
  {
    id: '03-wallet-system-architecture',
    title: 'Wallet System Architecture',
    description: 'Four-tier secure wallet infrastructure: Enclave, Storage, Status List, and Audit layers',
    icon: Layers,
    category: 'Wallet & Credentials',
  },
  {
    id: '04-credential-issuance-flow',
    title: 'Credential Issuance Flow',
    description: 'W3C Verifiable Credentials pipeline from document upload to wallet storage',
    icon: Cpu,
    category: 'Wallet & Credentials',
  },
  {
    id: '05-credential-status-management',
    title: 'Credential Status Management',
    description: 'Bitstring Status List v2021 implementation for real-time revocation checking',
    icon: Shield,
    category: 'Wallet & Credentials',
  },
  {
    id: '06-data-custody-model',
    title: 'Data Custody Model',
    description: 'Zero-knowledge data architecture, pilot sovereignty, and legal custody framework',
    icon: Database,
    category: 'Data & Security',
  },
  {
    id: '07-secure-enclave-architecture',
    title: 'Secure Enclave Architecture',
    description: 'Tier 1 hardware-backed key storage with non-extractable WebCrypto keys',
    icon: Lock,
    category: 'Data & Security',
  },
  {
    id: '08-key-management-rotation',
    title: 'Key Management & Rotation',
    description: 'Cryptographic key lifecycle for platform issuers and pilot wallets',
    icon: Shield,
    category: 'Data & Security',
  },
  {
    id: '09-domain-wallet-implementation',
    title: 'Domain Wallet Implementation',
    description: 'Domain-specific wallet deployment: Anonymous, Career, and Full wallet variants',
    icon: Layers,
    category: 'Implementation',
  },
  {
    id: '10-infrastructure-summary',
    title: 'Technical Infrastructure Summary',
    description: 'Complete platform architecture overview, deployment status, and system checklist',
    icon: Book,
    category: 'Implementation',
  },
];

const categories = Array.from(new Set(architectureDocs.map(d => d.category)));

export default function TechnicalArchitecturePage() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/ucf/official-release" className="text-slate-900 font-semibold hover:text-red-600 transition-colors">
              ← UCF Official Release
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 text-sm">Technical Architecture</span>
          </div>
          <div className="flex gap-2">
            <a
              href="https://github.com/pilotrecognition/docs/tree/main/technical-architecture"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Server className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Technical Architecture</h1>
              <p className="text-slate-600">Complete specification for domains, wallet, and data custody</p>
            </div>
          </div>
          <p className="text-slate-700 max-w-3xl leading-relaxed">
            This documentation covers the complete technical architecture of the PilotRecognition platform, 
            including multi-domain infrastructure, four-tier secure wallet systems, W3C Verifiable Credentials 
            implementation, and zero-knowledge data custody models. All documentation is publicly accessible 
            for transparency and third-party audit.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedDoc(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedDoc ? 'bg-red-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Documents
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedDoc(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedDoc === cat ? 'bg-red-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(category => {
            const docs = architectureDocs.filter(d => d.category === category);
            if (selectedDoc && selectedDoc !== category) return null;

            return (
              <div key={category} className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  {category}
                </h2>
                {docs.map(doc => {
                  const Icon = doc.icon;
                  return (
                    <a
                      key={doc.id}
                      href={`/docs/technical-architecture/${doc.id}.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-red-200 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-red-50 transition-colors">
                          <Icon className="w-5 h-5 text-slate-600 group-hover:text-red-600 transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {doc.description}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-slate-400 font-mono">{doc.id}.md</span>
                            <span className="text-xs text-slate-300">•</span>
                            <span className="text-xs text-red-500 font-medium">View Document →</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Quick Reference */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-white">
          <h2 className="text-xl font-bold mb-6">Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-red-400 mb-2">Domain Infrastructure</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• pilotrecognition.com (Main)</li>
                <li>• pilotcareerpathways.com (Career)</li>
                <li>• pilotshortage.org (Advocacy)</li>
                <li>• wallet.pilotrecognition.com (Public)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-400 mb-2">Wallet Tiers</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Tier 1: Secure Enclave (HSM)</li>
                <li>• Tier 2: AES-256-GCM Storage</li>
                <li>• Tier 3: Status List (60s poll)</li>
                <li>• Tier 4: Immutable Audit Log</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-400 mb-2">Key Technologies</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• W3C Verifiable Credentials</li>
                <li>• did:web / did:key</li>
                <li>• ECDSA P-256 (non-extractable)</li>
                <li>• Bitstring Status List v2021</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            Technical Architecture Documentation v1.0 • Last Updated June 2, 2026
          </p>
          <p className="text-xs text-slate-400 mt-2">
            All documentation is open source and available on GitHub for transparency and third-party audit.
          </p>
        </div>
      </div>
    </div>
  );
}
