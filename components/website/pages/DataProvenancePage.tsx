'use client';
import React from 'react';

const SOURCES = [
  {
    pillar: 'Pillar 1 — Structural Attrition Mathematics',
    color: '#ef4444',
    description: 'Fleet retirement timelines are calculated using the industry-standard Weibull Distribution Model — the same statistical framework used in Boeing\'s published Airplane Economic Life Analysis. No internal airline operational data is used.',
    formula: 'F(t) = 1 − exp(−(t/η)^β)',
    formulaNote: 'where β = shape parameter (2.8 for narrowbody jets), η = characteristic life scale (24.5 years for narrowbody). Retirement probability at any fleet age t is derived entirely from publicly known aircraft registration dates.',
    sources: [
      { name: 'Boeing Airplane Economic Life Analysis', url: 'https://www.boeing.com/commercial/aeromagazine/articles/qtr_02_07/AERO_Q207_article4.pdf', type: 'Public Technical Standard' },
      { name: 'FAA Civil Aircraft Registry (N-Number Inquiry)', url: 'https://registry.faa.gov/aircraftinquiry', type: 'Public Government Registry' },
      { name: 'EASA Civil Aviation Aircraft Register', url: 'https://www.easa.europa.eu/en/domains/aircraft-products/aircraft-registration', type: 'Public Government Registry' },
      { name: 'Airfleets Fleet Age Directory', url: 'https://airfleets.net', type: 'Public Aggregator' },
      { name: 'ch-aviation Fleet Profiles', url: 'https://ch-aviation.com', type: 'Public Aggregator' },
    ],
  },
  {
    pillar: 'Pillar 2 — OEM Market Forecasts & Delivery Backlogs',
    color: '#3b82f6',
    description: 'All 20-year demand projections and delivery backlog figures are sourced directly from Original Equipment Manufacturers\' publicly released investor documents. Boeing and Airbus are publicly traded corporations legally required to publish this data annually.',
    formula: 'Hiring Demand Index = f(deliveries_20yr, fleet_growth_pct, retiring_units, region)',
    formulaNote: 'The platform\'s demand index is a normalised composite of OEM-published delivery volumes, fleet growth rates, and retirement replacement demand per region. No proprietary airline hiring data is used.',
    sources: [
      { name: 'Boeing Commercial Market Outlook (CMO)', url: 'https://www.boeing.com/commercial/market/commercial-market-outlook', type: 'Public Investor Report' },
      { name: 'Airbus Global Market Forecast (GMF)', url: 'https://www.airbus.com/en/products-services/commercial-aircraft/market/global-market-forecast', type: 'Public Investor Report' },
      { name: 'Embraer Market Outlook', url: 'https://embraer.com/global/en/market-outlook', type: 'Public Investor Report' },
      { name: 'ATR Market Forecast', url: 'https://www.atr-aircraft.com/market', type: 'Public Investor Report' },
    ],
  },
  {
    pillar: 'Pillar 3 — Regulatory Standards & Training Frameworks',
    color: '#8b5cf6',
    description: 'Type-rating parameters, EBT competency frameworks, and pilot licensing standards are sourced from open-access regulatory publications by ICAO, CAAP, FAA, and EASA. These documents are publicly available and not subject to data privacy restrictions as they contain zero personally identifiable information.',
    formula: null,
    formulaNote: null,
    sources: [
      { name: 'ICAO Annex 1 — Personnel Licensing', url: 'https://www.icao.int/safety/Documents/ICAO_Annex1.pdf', type: 'Public Regulatory Standard' },
      { name: 'ICAO Evidence-Based Training (EBT) Manual', url: 'https://www.icao.int/safety/OPS/OPS-Normal/Pages/evidence-based-training.aspx', type: 'Public Regulatory Standard' },
      { name: 'CAAP Civil Aviation Regulations (Philippines)', url: 'https://caap.gov.ph/regulations/', type: 'Public Government Regulation' },
      { name: 'FAA Airmen Certification Standards', url: 'https://www.faa.gov/training_testing/testing/acs', type: 'Public Government Standard' },
      { name: 'EASA Part-FCL (Flight Crew Licensing)', url: 'https://www.easa.europa.eu/en/document-library/regulations/commission-regulation-eu-no-11782011', type: 'Public Regulatory Standard' },
    ],
  },
  {
    pillar: 'Pillar 4 — Publicly Pinned Institutional Reference Data (IPFS)',
    color: '#10b981',
    description: 'Airline hiring rubrics, ATO training syllabi, manufacturer type-rating parameters, and advisory circulars published by operators are pinned to IPFS via Pinata using Content Identifiers (CIDs). The CID is a cryptographic hash of the file — meaning the source institution cannot retroactively alter previously published expectations. PilotRecognition does not author this content; it indexes and preserves it.',
    formula: 'CID = SHA-256(file_content)',
    formulaNote: 'Content Identifiers are derived from the file\'s own hash. If the content changes, the CID changes — the original record is permanently preserved on the distributed IPFS network. This protects pilots from shifting institutional goalposts.',
    sources: [
      { name: 'Pinata IPFS Public Gateway', url: 'https://pinata.cloud', type: 'Public IPFS Infrastructure' },
      { name: 'Protocol Labs IPFS Documentation', url: 'https://docs.ipfs.tech', type: 'Public Open-Source Protocol' },
      { name: 'Cloudflare IPFS Gateway', url: 'https://cloudflare-ipfs.com', type: 'Public IPFS Gateway' },
    ],
  },
];

const LEGAL_STATEMENT = `PilotRecognition.com does not purchase, licence, scrape, or store any proprietary or confidential airline operational data. Every data point used in our career intelligence engine is sourced from one of the following categories:

1. Publicly traded company investor disclosures (Boeing, Airbus, Embraer) — legally required annual publications.
2. Open government civil aircraft registries (FAA, EASA, CAAP) — freely accessible public records.
3. Open-access regulatory standards (ICAO, FAA, EASA) — public domain documents with no PII.
4. Publicly pinned institutional reference documents — content submitted by operators for public indexing.

All predictive career modelling uses standard aerospace mathematical models (Weibull Distribution, OEM economic life analysis) applied to these public inputs. The outputs are mathematical projections, not insider intelligence.

If an operator, airline, manufacturer, or regulatory body believes any content on this platform misrepresents their publicly available documents, please contact legal@pilotrecognition.com and the relevant content will be reviewed within 5 business days.`;

interface DataProvenancePageProps {
  onNavigate?: (page: string) => void;
}

export const DataProvenancePage: React.FC<DataProvenancePageProps> = ({ onNavigate }) => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 860, margin: '0 auto', padding: '48px 24px', color: '#0f172a' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#dc2626', textTransform: 'uppercase' }}>Data Provenance & Legal Basis</p>
        <h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          How We Build Career Intelligence<br />
          <span style={{ color: '#64748b', fontWeight: 400, fontSize: 18 }}>Purely mathematical. Entirely public. Zero proprietary data.</span>
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.7, maxWidth: 680 }}>
          If an airline, operator, or regulatory body asks how PilotRecognition builds its predictive career pathways, 
          the answer is straightforward: we apply standard aerospace mathematics to data that Boeing, Airbus, and 
          governments are legally required to publish. This page is the complete technical and legal record of every 
          data source and formula we use.
        </p>
      </div>

      {/* Legal statement box */}
      <div style={{ marginBottom: 40, padding: '20px 24px', background: '#f8fafc', border: '2px solid #e2e8f0', borderLeft: '4px solid #0f172a' }}>
        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0f172a' }}>Platform Legal Statement</p>
        <pre style={{ margin: 0, fontSize: 11, color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'system-ui, sans-serif' }}>{LEGAL_STATEMENT}</pre>
        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          <a href="mailto:legal@pilotrecognition.com" style={{ fontSize: 11, fontWeight: 700, color: '#2563eb' }}>legal@pilotrecognition.com</a>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>5-business-day review SLA for all content disputes</span>
        </div>
      </div>

      {/* Pillars */}
      {SOURCES.map((pillar, pi) => (
        <div key={pi} style={{ marginBottom: 32, borderLeft: `3px solid ${pillar.color}`, paddingLeft: 20 }}>
          <p style={{ margin: '0 0 6px', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: pillar.color }}>{pillar.pillar}</p>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: '#334155', lineHeight: 1.7 }}>{pillar.description}</p>

          {pillar.formula && (
            <div style={{ marginBottom: 12, padding: '10px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 4px', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{pillar.formula}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>{pillar.formulaNote}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pillar.sources.map((s, si) => (
              <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'white', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: `${pillar.color}11`, color: pillar.color, border: `1px solid ${pillar.color}33`, letterSpacing: '0.05em', flexShrink: 0 }}>{s.type}</span>
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#1e40af', fontWeight: 600, textDecoration: 'none' }}>
                  {s.name}
                </a>
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ marginLeft: 'auto', fontSize: 10, color: '#94a3b8' }}>↗</a>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pitch statement for airlines */}
      <div style={{ marginTop: 40, padding: '24px 28px', background: '#0f172a', color: 'white' }}>
        <p style={{ margin: '0 0 6px', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#dc2626', textTransform: 'uppercase' }}>For Airlines & Operators</p>
        <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em' }}>What to Tell Your Legal or Data Team</h2>
        <blockquote style={{ margin: '0 0 16px', padding: '14px 18px', background: 'rgba(255,255,255,0.05)', borderLeft: '3px solid #dc2626', fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontStyle: 'italic' }}>
          "We don't buy or leak internal airline data. We take the open-source market outlooks you publish, 
          cross-reference them with public civil aircraft registries, and apply standard economic lifecycle 
          mathematics — specifically the Weibull Distribution Model used in Boeing's own Airplane Economic Life 
          Analysis — to show pilots exactly where their careers need to go to meet your future hiring targets."
        </blockquote>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Zero PII Used', desc: 'No pilot or airline personal data enters the intelligence engine' },
            { label: 'Zero Proprietary Data', desc: 'Only publicly disclosed OEM forecasts and open government registries' },
            { label: 'Auditable Formula', desc: 'Weibull parameters and OEM source URLs are published on every output' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: '#10b981', letterSpacing: '-0.01em' }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>
        Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} &nbsp;·&nbsp; PilotRecognition.com &nbsp;·&nbsp; <a href="mailto:legal@pilotrecognition.com" style={{ color: '#94a3b8' }}>legal@pilotrecognition.com</a>
      </p>
    </div>
  );
};

export default DataProvenancePage;
