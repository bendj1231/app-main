import React from 'react';
import { Calendar } from 'lucide-react';

export const EventsTab: React.FC = () => {
  const events = [
    { name: 'APATS 2026', location: 'Manila, Philippines', date: 'Nov 2026', type: 'Career Fair' },
    { name: 'Dubai Airshow 2025', location: 'Dubai, UAE', date: 'Nov 2025', type: 'Industry Event' },
    { name: 'IATA AGM 2026', location: 'TBC', date: 'Jun 2026', type: 'Regulatory' },
    { name: 'Singapore Airshow 2026', location: 'Singapore', date: 'Feb 2026', type: 'Industry Event' },
  ];
  return (
    <div className="space-y-4">
      {events.map(e => (
        <div key={e.name} className="rounded-xl p-4 flex items-center gap-4 transition-all hover:scale-[1.005]" style={{ background: 'rgba(30,41,59,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex flex-col items-center justify-center flex-shrink-0">
            <Calendar size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm tracking-wide">{e.name}</p>
            <p className="text-xs text-white/50">{e.location} · {e.date}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>{e.type}</span>
        </div>
      ))}
    </div>
  );
};
