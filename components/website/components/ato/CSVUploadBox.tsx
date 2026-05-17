import React, { useState, useRef } from 'react';
import { Upload, Send, X, Loader2 } from 'lucide-react';

interface Props {
  atoName: string;
  onInvited: () => void;
}

interface CSVRow {
  name: string;
  email: string;
}

export function CSVUploadBox({ atoName, onInvited }: Props) {
  const [rows, setRows] = useState<CSVRow[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string): CSVRow[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const out: CSVRow[] = [];
    for (const line of lines) {
      const parts = line.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const email = parts[1];
        if (email.includes('@')) {
          out.push({ name, email });
        }
      }
    }
    return out;
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRows(parseCSV(text));
      setSentCount(0);
    };
    reader.readAsText(file);
  }

  async function handleInviteAll() {
    if (rows.length === 0) return;
    setSending(true);
    let count = 0;
    for (const row of rows) {
      try {
        const subject = encodeURIComponent(`Join PilotRecognition — ${atoName}`);
        const body = encodeURIComponent(
          `Hi ${row.name},\n\nYour flight school ${atoName} is now on PilotRecognition.com. Create your verified pilot profile and unlock airline pathways.\n\nhttps://pilotrecognition.com\n\n— ${atoName}`
        );
        window.open(`mailto:${row.email}?subject=${subject}&body=${body}`, '_blank');
        count++;
        await new Promise(r => setTimeout(r, 400)); // throttle to avoid popup blockers
      } catch {}
    }
    setSentCount(count);
    setSending(false);
    onInvited();
  }

  const dropStyle: React.CSSProperties = {
    border: `2px dashed ${dragOver ? '#0ea5e9' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    color: dragOver ? '#38bdf8' : '#64748b',
    background: dragOver ? 'rgba(14,165,233,0.05)' : 'transparent',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  return (
    <div>
      {rows.length === 0 ? (
        <div
          style={dropStyle}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={20} style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ margin: 0, fontSize: '0.82rem' }}>Drop a CSV here or click to upload</p>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.72rem', color: '#475569' }}>Format: name, email (one per line)</p>
          <input ref={fileInputRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>{rows.length} students ready to invite</p>
            <button onClick={() => { setRows([]); setSentCount(0); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
              <X size={14} /> Clear
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '0.85rem' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0.65rem', borderRadius: '8px', background: 'rgba(30,41,59,0.5)', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <span>{r.name}</span>
                <span style={{ color: '#64748b' }}>{r.email}</span>
              </div>
            ))}
          </div>
          {sentCount > 0 && (
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: '#34d399' }}>{sentCount} invite(s) opened in mail client.</p>
          )}
          <button
            onClick={handleInviteAll}
            disabled={sending}
            style={{
              padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none',
              background: sending ? '#1e293b' : '#0ea5e9', color: '#fff',
              fontWeight: 700, fontSize: '0.82rem', cursor: sending ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
          >
            {sending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
            {sending ? 'Sending Invites…' : 'Send Email Invites'}
          </button>
        </div>
      )}
      <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
