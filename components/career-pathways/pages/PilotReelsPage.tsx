import React from 'react';
import { Instagram, User, Video } from 'lucide-react';

const reels: { type: 'video' | 'image'; src: string }[] = [
  { type: 'video', src: '/videos/cessna-caravan-startup.mp4' },
  { type: 'video', src: '/videos/reel-1.mp4' },
  { type: 'video', src: '/videos/reel-2.mp4' },
  { type: 'video', src: '/videos/tecnam-p2002jf.mp4' },
  { type: 'video', src: '/videos/cessna-172-landing.mp4' },
  { type: 'video', src: '/videos/mccall-visit.mp4' },
  { type: 'video', src: '/videos/simulator.mp4' },
  { type: 'video', src: '/videos/mount-everest.mp4' },
  { type: 'image', src: '/videos/checkride-c152.jpg' },
  { type: 'image', src: '/videos/maps.jpg' },
  { type: 'video', src: '/videos/Stearman.mp4' },
];

const ReelVideo: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      <video src={src} className="w-full h-full object-cover" autoPlay muted loop playsInline />
    </div>
  );
};

export const PilotReelsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            Turn your Reels into Careers
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Build a Recognition+ pilot profile that showcases your flight Reels and connects you
            with operators, airlines, and training partners.
          </p>
          <button
            onClick={() => {
              window.location.href = `${window.location.origin}/platform?tab=recognition-plus`;
            }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
          >
            Get Recognition+
          </button>
        </div>
      </section>

      {/* Example profile */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">Lina</h2>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Pilot
                </span>
              </div>
              <p className="text-slate-400 mb-4">
                Cessna Caravan pilot sharing cockpit Reels and flight-day moments. Open to cargo,
                charter, and instructor opportunities.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-indigo-400" />
                  <span>24 Reels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>@misspilot.ke</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reels grid */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h3 className="text-xl font-bold text-white mb-6">Featured Reels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reels.map((item, i) => (
            <div
              key={i}
              className="aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 border border-white/10"
            >
              {item.type === 'video' ? (
                <ReelVideo src={item.src} />
              ) : (
                <img src={item.src} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
