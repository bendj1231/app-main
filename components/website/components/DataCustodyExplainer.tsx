/**
 * DataCustodyExplainer - Visual explanation of who holds what data
 * 
 * Use this component in wallet pages, privacy settings, and upload flows
 * to clearly communicate the three-tier data architecture.
 */

import React, { useState } from 'react';
import { Shield, Database, FileText, Lock, Globe, ChevronDown, ChevronUp } from 'lucide-react';

interface DataCustodyExplainerProps {
  compact?: boolean; // Show minimal version for inline use
  showDocuments?: boolean; // Show the document custodian tier
}

export const DataCustodyExplainer: React.FC<DataCustodyExplainerProps> = ({ 
  compact = false,
  showDocuments = true 
}) => {
  const [expandedTier, setExpandedTier] = useState<number | null>(null);

  if (compact) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Shield className="w-4 h-4 text-cyan-600" />
          <span>Your wallet holds the credential.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 mt-1">
          <Database className="w-4 h-4 text-blue-600" />
          <span>We store text claims only (no documents).</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 mt-1">
          <FileText className="w-4 h-4 text-amber-600" />
          <span>Documents managed by local authorities.</span>
        </div>
      </div>
    );
  }

  const tiers = [
    {
      id: 1,
      title: "Your Pilot Wallet",
      subtitle: "Your Device • Your Control",
      icon: Shield,
      color: "cyan",
      items: [
        "✅ W3C Verifiable Credentials (VCs)",
        "✅ Cryptographic signatures",
        "✅ Private keys (P-256)",
        "✅ Decentralized ID (DID)",
      ],
      note: "🔐 We cannot access this. Only you control your private keys.",
      storage: "IndexedDB on your device",
    },
    {
      id: 2,
      title: "PilotRecognition Platform",
      subtitle: "Text Claims Only • No Documents",
      icon: Database,
      color: "blue",
      items: [
        "✅ License number (encrypted)",
        "✅ Medical class & expiry",
        "✅ Total flight hours",
        "✅ Credential status (active/revoked)",
      ],
      note: "📄 We do NOT store: license scans, medical images, passport copies",
      storage: "Supabase (Sydney) - AES-256-GCM encrypted",
    },
    {
      id: 3,
      title: "Regional Verification Provider",
      subtitle: "Document Custodian • Local Jurisdiction",
      icon: FileText,
      color: "amber",
      items: [
        "📄 Physical license scans",
        "📄 Medical certificates (PDF/images)",
        "📄 Logbook extracts",
        "📄 Verification reports",
      ],
      note: "🏛️ Stored by Veremark/CAAP/FAA per local law in your country",
      storage: "Country-specific (PH, US, EU, etc.)",
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    cyan: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-900", icon: "text-cyan-600" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", icon: "text-blue-600" },
    amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-900", icon: "text-amber-600" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">Where Your Data Lives</h3>
      </div>

      <p className="text-slate-600 text-sm mb-4">
        We use a three-tier architecture to protect your privacy and comply with aviation regulations worldwide:
      </p>

      {tiers.slice(0, showDocuments ? 3 : 2).map((tier) => {
        const colors = colorClasses[tier.color];
        const Icon = tier.icon;
        const isExpanded = expandedTier === tier.id;

        return (
          <div 
            key={tier.id}
            className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden`}
          >
            <button
              onClick={() => setExpandedTier(isExpanded ? null : tier.id)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`${colors.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-semibold ${colors.text}`}>{tier.title}</h4>
                  <p className="text-xs text-slate-500">{tier.subtitle}</p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-0">
                <div className="border-t border-slate-200/50 pt-3">
                  <ul className="space-y-1 text-sm">
                    {tier.items.map((item, idx) => (
                      <li key={idx} className="text-slate-700 flex items-start gap-2">
                        <span className="text-slate-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <div className={`mt-3 p-2 rounded-lg ${
                    tier.id === 1 ? 'bg-cyan-100/50' : 
                    tier.id === 2 ? 'bg-blue-100/50' : 'bg-amber-100/50'
                  }`}>
                    <p className="text-xs text-slate-600">{tier.note}</p>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <Lock className="w-3 h-3" />
                    <span>Storage: {tier.storage}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600">
        <p>
          <strong>Key Principle:</strong> Your wallet holds the cryptographic proof, 
          we store text claims for verification lookup, and regional authorities manage 
          physical documents per local aviation law.
        </p>
      </div>
    </div>
  );
};

// Simpler inline version for upload flows
export const DataCustodyNotice: React.FC = () => (
  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-3">
    <div className="flex items-start gap-2">
      <Shield className="w-4 h-4 text-cyan-600 mt-0.5" />
      <div className="text-xs text-slate-700">
        <p className="font-medium">Your document goes directly to our verification partner</p>
        <p className="mt-1">
          We never store the file. We only receive: verified / not verified + basic facts 
          (license number, expiry, class).
        </p>
      </div>
    </div>
  </div>
);

// Footer badge for wallet pages
export const PoweredByBadge: React.FC<{ domain?: string }> = ({ domain = 'pilotrecognition.com' }) => (
  <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
    <span>🔐 Secured by</span>
    <a 
      href={`https://${domain}/wallet`} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-cyan-600 hover:text-cyan-700 font-medium"
    >
      {domain} Pilot Wallet
    </a>
  </div>
);

export default DataCustodyExplainer;
