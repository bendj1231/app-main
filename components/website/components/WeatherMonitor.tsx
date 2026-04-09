import React, { useState, useEffect } from 'react';

export const WeatherMonitor = () => {
    const [station, setStation] = useState('KJFK');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchMetar = async (id: string) => {
        if (!id) return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`https://aviationweather.gov/api/data/metar?ids=${id.toUpperCase()}&format=json`);
            if (!response.ok) throw new Error('Telemetry server connection timeout.');
            const result = await response.json();
            if (result && result.length > 0) setData(result[0]);
            else setError('Station not found or report unavailable.');
        } catch (err: any) {
            setError('Official weather API connection failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMetar(station); }, []);

    return (
        <div className="weather-monitor-card fade-in-up" style={{ background: '#fff', borderRadius: 32, padding: 'clamp(24px, 5vw, 48px)', border: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.15em', fontWeight: 700 }}>Telemetry Console</h3>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, marginBottom: 32 }}>METAR Search Node</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                <input
                    style={{ flex: '1 1 200px', padding: '16px 24px', borderRadius: 18, border: '2px solid #f0f0f0', fontFamily: 'JetBrains Mono', fontSize: '1.1rem' }}
                    type="text" value={station} onChange={(e) => setStation(e.target.value.toUpperCase())}
                    placeholder="ICAO CODE" onKeyDown={(e) => e.key === 'Enter' && fetchMetar(station)}
                />
                <button onClick={() => fetchMetar(station)} style={{ flex: '0 0 auto', padding: '12px 32px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '18px', fontWeight: 700, cursor: 'pointer' }}>
                    {loading ? 'SYNCING...' : 'FETCH'}
                </button>
            </div>
            {error && <p style={{ color: '#e53e3e', fontWeight: 600 }}>{error}</p>}
            {data && <div style={{ background: '#1a1a1a', color: '#00ff00', padding: 24, borderRadius: 24, fontFamily: 'JetBrains Mono', wordBreak: 'break-all', fontSize: '0.9rem' }}>{data.rawOb}</div>}
        </div>
    );
};
