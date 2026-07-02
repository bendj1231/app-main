'use client';
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

const PILOT_API_URL = (import.meta.env as any).VITE_PILOT_API_URL || 'https://pilotrecognition-api.benjamintigerbowler.workers.dev';

const DOC_TYPES = [
  { value: 'hiring_rubric',      label: 'Hiring Rubric / Cadet Expectations' },
  { value: 'syllabus',           label: 'Training Syllabus / Curriculum' },
  { value: 'type_rating',        label: 'Type-Rating Checkride Parameters' },
  { value: 'advisory_circular',  label: 'Advisory Circular (CAAP / FAA / ICAO)' },
  { value: 'pathway_criteria',   label: 'Pathway Programme Criteria' },
  { value: 'other',              label: 'Other Public Reference Document' },
];

const RELATED_TABLES = [
  { value: '',                    label: '— None —' },
  { value: 'airlines',            label: 'Airlines' },
  { value: 'aviation_operators',  label: 'Aviation Operators' },
  { value: 'aviation_standards',  label: 'Aviation Standards' },
  { value: 'airline_expectations',label: 'Airline Expectations' },
];

interface PinRecord {
  id: string;
  ipfs_cid: string;
  title: string | null;
  doc_type: string;
  source_url: string | null;
  gateway_url: string | null;
  file_size_bytes: number | null;
  pinned_at: string;
  related_table: string | null;
}

export const IpfsPinPanel: React.FC = () => {
  const { getIdTokenClaims } = useAuth0();
  const { callApi } = useWorkerAuth();
  const [sourceUrl, setSourceUrl]       = useState('');
  const [docType, setDocType]           = useState('hiring_rubric');
  const [title, setTitle]               = useState('');
  const [description, setDescription]   = useState('');
  const [relatedTable, setRelatedTable] = useState('');
  const [relatedId, setRelatedId]       = useState('');
  const [pinning, setPinning]           = useState(false);
  const [result, setResult]             = useState<{ cid: string; gatewayUrl: string; ipfsUrl: string } | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [pins, setPins]                 = useState<PinRecord[]>([]);
  const [loadingPins, setLoadingPins]   = useState(true);

  const loadPins = async () => {
    setLoadingPins(true);
    const rows = await callApi<Record<string, unknown>[]>('queryTable', {
      table: 'public_ipfs_pins',
      operation: 'select',
      limit: 50,
    });
    const sorted = (rows || []).sort((a: any, b: any) => {
      const pa = a.pinned_at || '';
      const pb = b.pinned_at || '';
      return pb.localeCompare(pa);
    });
    setPins((sorted as unknown) as PinRecord[]);
    setLoadingPins(false);
  };

  useEffect(() => { loadPins(); }, []);

  const handlePin = async () => {
    if (!sourceUrl.trim()) { setError('Source URL is required'); return; }
    setError(null);
    setResult(null);
    setPinning(true);
    try {
      const claims = await getIdTokenClaims();
      const token = claims?.__raw;
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`${PILOT_API_URL}/api/pinata-pin-public`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceUrl: sourceUrl.trim(),
          docType,
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          relatedTable: relatedTable || undefined,
          relatedId: relatedId.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pin failed');
      setResult(data);
      setSourceUrl('');
      setTitle('');
      setDescription('');
      setRelatedId('');
      loadPins();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPinning(false);
    }
  };

  const fmt = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: '32px 24px', color: '#0f172a' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#dc2626', textTransform: 'uppercase', marginBottom: 4 }}>Public IPFS Registry</p>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Pin Public Document to IPFS</h1>
        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
          Only for publicly-available institutional content. Airline hiring expectations, ATO syllabi, manufacturer type-rating rubrics, CAAP/FAA/ICAO advisories.{' '}
          <strong style={{ color: '#dc2626' }}>Never use for pilot personal data.</strong>
        </p>
      </div>

      {/* Pin form */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '24px', marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Source URL *</label>
            <input
              value={sourceUrl}
              onChange={e => setSourceUrl(e.target.value)}
              placeholder="https://www.caap.gov.ph/advisory-circular-2025-001.pdf"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', background: 'white', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Document Type *</label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', fontSize: 12, background: 'white', outline: 'none' }}
            >
              {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="AirAsia Cadet Pilot Intake Requirements 2025"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', background: 'white', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Minimum hours, medical class, ELP requirements"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', background: 'white', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Link to Table</label>
            <select
              value={relatedTable}
              onChange={e => setRelatedTable(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', fontSize: 12, background: 'white', outline: 'none' }}
            >
              {RELATED_TABLES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {relatedTable && (
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Row UUID</label>
              <input
                value={relatedId}
                onChange={e => setRelatedId(e.target.value)}
                placeholder="UUID of the airline / operator / standard row"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', background: 'white', boxSizing: 'border-box' }}
              />
            </div>
          )}
        </div>

        <button
          onClick={handlePin}
          disabled={pinning || !sourceUrl.trim()}
          style={{ padding: '10px 28px', background: pinning ? '#94a3b8' : '#7c3aed', color: 'white', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: pinning ? 'wait' : 'pointer', transition: 'background 0.15s' }}
        >
          {pinning ? 'Fetching & Pinning…' : '↑ Pin to IPFS'}
        </button>

        {error && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca' }}>
            <p style={{ margin: 0, fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Error: {error}</p>
          </div>
        )}

        {result && (
          <div style={{ marginTop: 12, padding: '14px 16px', background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
            <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: '#6d28d9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>✓ Pinned to IPFS</p>
            <p style={{ margin: '0 0 2px', fontSize: 11, fontFamily: 'monospace', color: '#4c1d95', wordBreak: 'break-all' }}>CID: {result.cid}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <a href={result.ipfsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600 }}>View on IPFS →</a>
              <button onClick={() => navigator.clipboard?.writeText(result.cid)} style={{ background: 'none', border: 'none', fontSize: 11, color: '#7c3aed', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Copy CID</button>
              <button onClick={() => navigator.clipboard?.writeText(result.ipfsUrl)} style={{ background: 'none', border: 'none', fontSize: 11, color: '#7c3aed', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Copy URL</button>
            </div>
          </div>
        )}
      </div>

      {/* Pin history */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.01em' }}>Pinned Documents ({pins.length})</h2>
        {loadingPins ? (
          <p style={{ fontSize: 12, color: '#94a3b8' }}>Loading…</p>
        ) : pins.length === 0 ? (
          <p style={{ fontSize: 12, color: '#94a3b8' }}>No documents pinned yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 130px 100px 80px 120px', gap: 12, padding: '6px 12px', background: '#f1f5f9', fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              <span>Title / CID</span><span>Doc Type</span><span>Table</span><span>Size</span><span>Pinned</span>
            </div>
            {pins.map(pin => (
              <div key={pin.id} style={{ display: 'grid', gridTemplateColumns: '2fr 130px 100px 80px 120px', gap: 12, padding: '10px 12px', background: 'white', border: '1px solid #f1f5f9', alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{pin.title || '—'}</p>
                  <a href={pin.gateway_url || `https://ipfs.io/ipfs/${pin.ipfs_cid}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, fontFamily: 'monospace', color: '#7c3aed', wordBreak: 'break-all' }}>{pin.ipfs_cid}</a>
                </div>
                <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>{pin.doc_type.replace(/_/g, ' ')}</span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{pin.related_table || '—'}</span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{fmt(pin.file_size_bytes)}</span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{new Date(pin.pinned_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IpfsPinPanel;
