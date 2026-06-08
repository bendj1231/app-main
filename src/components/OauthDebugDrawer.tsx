import React, { useEffect, useState } from 'react';

export const OauthDebugDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const read = () => {
      try {
        const raw = sessionStorage.getItem('oauth_debug_log');
        if (!raw) {
          setLogs([]);
          return;
        }
        const parsed = JSON.parse(raw);
        setLogs(Array.isArray(parsed) ? parsed.slice().reverse() : []);
      } catch (e) {
        // ignore
      }
    };

    read();
    const id = setInterval(read, 1000);
    return () => clearInterval(id);
  }, []);

  if (!logs.length && !open) return null;

  return (
    <div style={{ position: 'fixed', right: 12, top: 12, zIndex: 99999, fontFamily: 'Inter, Arial, sans-serif' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '8px 12px',
          borderRadius: 8,
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        {open ? 'Hide OAuth Debug' : `OAuth Debug (${logs.length})`}
      </button>

      {open && (
        <div style={{ width: 520, maxWidth: 'calc(100vw - 32px)', maxHeight: '60vh', overflow: 'auto', marginTop: 8, background: 'rgba(17,24,39,0.95)', color: '#e6eef8', borderRadius: 8, padding: 12, boxShadow: '0 8px 30px rgba(2,6,23,0.6)' }}>
          <div style={{ fontSize: 13, marginBottom: 8, color: '#9fb0c8' }}>OAuth debug log (latest first)</div>
          <div style={{ fontSize: 12 }}>
            {logs.map((l, idx) => (
              <div key={idx} style={{ padding: '8px 6px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 11, color: '#9fb0c8' }}>{new Date(l.ts || Date.now()).toLocaleString()}</div>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, color: '#e6eef8' }}>{JSON.stringify(l, null, 2)}</pre>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button
              onClick={() => { sessionStorage.removeItem('oauth_debug_log'); setLogs([]); }}
              style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none' }}
            >Clear</button>
            <button
              onClick={() => { navigator.clipboard?.writeText(JSON.stringify(logs.slice().reverse(), null, 2)); }}
              style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(59,130,246,0.95)', color: '#fff', border: 'none' }}
            >Copy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OauthDebugDrawer;
