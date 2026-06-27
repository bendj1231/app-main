import React, { useCallback, useRef, useState } from 'react';
import {
  ArrowLeft, Upload, CheckCircle2, AlertCircle, Loader2,
  FileText, Clock, RefreshCw, ShieldCheck, Info,
} from 'lucide-react';
import { useLogbookUpload } from '../../@/hooks/useLogbookUpload';

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const dark: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0f172a',
  color: '#ffffff',
  fontFamily: 'system-ui, sans-serif',
};

const card: React.CSSProperties = {
  background: 'rgba(15,23,42,0.8)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '1.5rem',
};

const EXPECTED_COLUMNS = [
  'date', 'aircraft_type', 'aircraft_registration',
  'total_hours', 'pic_hours', 'sic_hours',
  'night_hours', 'ifr_hours', 'cross_country_hours', 'remarks',
];

const SAMPLE_CSV = [
  'date,aircraft_type,aircraft_registration,total_hours,pic_hours,sic_hours,night_hours,ifr_hours,cross_country_hours,remarks',
  '2024-01-15,C172,RP-C1234,1.5,1.5,0,0,0,1.2,Training flight',
  '2024-01-22,C172,RP-C1234,2.0,2.0,0,0.5,0.5,1.8,Night IFR XC',
  '2024-02-03,P200JF,RP-C9876,1.2,1.2,0,0,0,0,Solo circuit',
].join('\n');

function downloadSample() {
  const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'logbook_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function LogbookUploadPage({ onBack, onNavigate }: Props) {
  const { status, parseErrors, summary, uploadError, tokenId, handleFile, submit, reset } = useLogbookUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [issuerName, setIssuerName] = useState('');
  const [consented, setConsented] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={dark}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={status === 'success' ? () => onNavigate('pilot-recognition-profile') : onBack}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 12 — Logbook Integration</p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Import Logbook via CSV</h1>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
            Upload your logbook export as a CSV file. Your hours are parsed and stored as a <strong style={{ color: '#94a3b8' }}>Level 1 (self-reported) token</strong> in your credential wallet. You can request ATO or operator attestation afterwards to elevate to Level 3.
          </p>
        </div>

        {/* ── SUCCESS STATE ── */}
        {status === 'success' && (
          <div style={{ ...card, borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <CheckCircle2 size={26} color="#10b981" />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>Logbook Token Created</p>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  {summary?.totalHours.toFixed(1)} total hours recorded as a Level 1 self-reported token in your credential wallet.
                </p>
              </div>
            </div>
            <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', fontFamily: 'monospace' }}>Token ID: {tokenId}</p>
            </div>
            <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#38bdf8', lineHeight: 1.6 }}>
                <strong>Next step:</strong> Request ATO or operator attestation to elevate this token from Level 1 (self-reported) to Level 3 (institutionally countersigned). Go to <strong>ATO Attestation</strong> to send an attestation request.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button
                onClick={() => onNavigate('ato-attestation')}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '999px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Request ATO Attestation
              </button>
              <button
                onClick={() => { reset(); setIssuerName(''); setConsented(false); }}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={13} /> Upload Another
              </button>
            </div>
          </div>
        )}

        {/* ── IDLE / PARSING / ERROR — show upload zone ── */}
        {(status === 'idle' || status === 'parsing' || (status === 'error' && parseErrors.length > 0)) && (
          <>
            {/* Format guide */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.72rem', letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Expected Columns</p>
                  <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {EXPECTED_COLUMNS.map(col => (
                      <span key={col} style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#94a3b8', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '5px', padding: '0.15rem 0.5rem' }}>
                        {col}
                      </span>
                    ))}
                  </div>
                  <p style={{ margin: '0.6rem 0 0', fontSize: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
                    Column names are flexible — common aliases like "Total Time", "PIC", "XC Hours" are automatically recognised. Only <code style={{ color: '#94a3b8' }}>date</code> and <code style={{ color: '#94a3b8' }}>total_hours</code> are required.
                  </p>
                </div>
                <button
                  onClick={downloadSample}
                  style={{ padding: '0.55rem 1rem', borderRadius: '999px', border: '1px solid rgba(14,165,233,0.3)', background: 'transparent', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  ↓ Download Template
                </button>
              </div>
            </div>

            {/* Drop zone */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              style={{
                border: `2px dashed ${dragOver ? '#0ea5e9' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '16px',
                padding: '3rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
                background: dragOver ? 'rgba(14,165,233,0.04)' : 'transparent',
                marginBottom: '1.25rem',
              }}
            >
              {status === 'parsing' ? (
                <Loader2 size={32} color="#94a3b8" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
              ) : (
                <Upload size={32} color="#334155" style={{ margin: '0 auto 0.75rem' }} />
              )}
              <p style={{ margin: 0, fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>
                {status === 'parsing' ? 'Parsing CSV…' : 'Drop your logbook CSV here'}
              </p>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: '#475569' }}>
                or click to browse · .csv files only
              </p>
              <input ref={inputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={onFileInput} />
            </div>

            {/* Parse errors */}
            {parseErrors.length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                  <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#f87171', fontSize: '0.85rem' }}>Parse Error</p>
                    {parseErrors.map((e, i) => (
                      <p key={i} style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#fca5a5' }}>{e}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PREVIEW STATE ── */}
        {(status === 'preview' || status === 'uploading') && summary && (
          <>
            {/* Summary card */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <FileText size={18} color="#10b981" />
                <p style={{ margin: 0, fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>Parsed — {summary.rowCount} flight records</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {[
                  { label: 'Total Hours',    value: summary.totalHours.toFixed(1) },
                  { label: 'PIC',            value: summary.picHours.toFixed(1) },
                  { label: 'SIC',            value: summary.sicHours.toFixed(1) },
                  { label: 'Night',          value: summary.nightHours.toFixed(1) },
                  { label: 'IFR',            value: summary.ifrHours.toFixed(1) },
                  { label: 'Cross Country',  value: summary.crossCountryHours.toFixed(1) },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '10px', padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>{item.value}</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
                  </div>
                ))}
              </div>
              {summary.aircraftTypes.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Aircraft types:</span>
                  {summary.aircraftTypes.map(t => (
                    <span key={t} style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#94a3b8', background: 'rgba(148,163,184,0.1)', borderRadius: '4px', padding: '0.15rem 0.45rem' }}>{t}</span>
                  ))}
                </div>
              )}
              {(summary.dateFrom || summary.dateTo) && (
                <p style={{ margin: '0.65rem 0 0', fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={12} /> Period: {summary.dateFrom} → {summary.dateTo}
                </p>
              )}
            </div>

            {/* L1 notice */}
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem' }}>
              <Info size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#fcd34d', lineHeight: 1.6 }}>
                This upload creates a <strong>Level 1 — Self-Reported</strong> token. It is not independently verified. To elevate to Level 3, you must request attestation from the ATO or operator that issued the flight hours.
              </p>
            </div>

            {/* Issuer name */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
                Logbook / Issuing Organisation (optional)
              </label>
              <input
                type="text"
                value={issuerName}
                onChange={e => setIssuerName(e.target.value)}
                placeholder="e.g. WCC Aviation College, Self-logged"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '0.7rem 1rem', borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(30,41,59,0.6)', color: '#ffffff',
                  fontSize: '0.85rem', outline: 'none',
                }}
              />
            </div>

            {/* Consent */}
            <div
              onClick={() => setConsented(v => !v)}
              style={{
                background: consented ? 'rgba(16,185,129,0.06)' : 'rgba(30,41,59,0.6)',
                border: `1px solid ${consented ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
                marginBottom: '1.25rem', transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '0.1rem',
                background: consented ? '#10b981' : 'transparent',
                border: `2px solid ${consented ? '#10b981' : '#475569'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease',
              }}>
                {consented && <CheckCircle2 size={13} color="#fff" />}
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6, userSelect: 'none' }}>
                I confirm this logbook data is accurate to the best of my knowledge. I understand this creates a <strong>Level 1 self-reported token</strong> and that PilotRecognition does not independently verify CSV-imported data. I authorise this record to be stored in my Pillar 12 credential wallet.
              </p>
            </div>

            {/* Upload error */}
            {uploadError && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <AlertCircle size={15} color="#f87171" />
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#f87171' }}>{uploadError}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => submit(issuerName)}
                disabled={!consented || status === 'uploading'}
                style={{
                  flex: 1, minWidth: '200px',
                  padding: '0.9rem 1.5rem', borderRadius: '12px', border: 'none',
                  background: consented && status !== 'uploading' ? '#0ea5e9' : '#1e293b',
                  color: consented && status !== 'uploading' ? '#ffffff' : '#475569',
                  fontWeight: 700, fontSize: '0.9rem',
                  cursor: consented && status !== 'uploading' ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {status === 'uploading' ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving Token…</>
                ) : (
                  <><ShieldCheck size={16} /> Save to Credential Wallet</>
                )}
              </button>
              <button
                onClick={() => { reset(); setIssuerName(''); setConsented(false); }}
                disabled={status === 'uploading'}
                style={{
                  padding: '0.9rem 1.25rem', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
                  color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}
              >
                <RefreshCw size={14} /> Re-upload
              </button>
            </div>
          </>
        )}

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
}
