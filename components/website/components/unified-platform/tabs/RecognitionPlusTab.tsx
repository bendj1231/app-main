import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import type { TabId } from '../types';

interface RecognitionPlusTabProps {
  setTab: (tab: TabId) => void;
  onNavigate: (page: string) => void;
}

/* ─── Rockstar-inspired cinematic Recognition+ page ─── */

const SectionStrip: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style }) => (
  <section className={`relative w-full overflow-hidden ${className}`} style={style}>
    {children}
  </section>
);

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

/** Individual scroll-triggered materialize wrapper */
const AnimateIn: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
};

export const RecognitionPlusTab: React.FC<RecognitionPlusTabProps> = ({ setTab, onNavigate }) => {
  return (
    <div
      className="relative z-10 flex flex-col w-full"
    >
      {/* ═══════════════════════════════════════════════════
          HERO — Full viewport, cinematic, massive type
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative flex items-center justify-center overflow-visible"
        style={{
          minHeight: 'calc(92vh + 120px)',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #b91c1c 0%, #991b1b 40%, #7f1d1d 100%)',
        }}
      >

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Massive headline */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-6">
              RECOGNITION
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
                }}
              >
                +
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg md:text-xl text-red-100 font-light tracking-wide max-w-2xl mx-auto mb-4 leading-relaxed">
              Your license is your leverage. We make the industry see it.
            </p>

            {/* Description */}
            <p className="text-sm text-red-200/80 max-w-xl mx-auto mb-10 leading-relaxed">
              Recognition+ is not a subscription. It is a one-time verification that turns your CAAP
              license, medical, and flight hours into a live, industry-trusted credential. Airlines
              do not read PDFs. They pull verified profiles.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => onNavigate('recognition-plus')}
                className="group px-8 py-3.5 text-sm font-black uppercase tracking-[0.15em] text-slate-900 transition-all hover:scale-105 flex items-center gap-3 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                  boxShadow: '0 4px 20px rgba(255,255,255,0.15), 0 1px 4px rgba(0,0,0,0.1)',
                }}
              >
                Request Verification
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 text-slate-700"
                />
              </button>
              <button
                onClick={() => setTab('recognition-plus-tab' as TabId)}
                className="group px-8 py-3.5 text-sm font-black uppercase tracking-[0.15em] text-white transition-all hover:scale-105 flex items-center gap-3 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                Learn More
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 text-white/80"
                />
              </button>
              <span className="text-xs text-red-200/70 font-medium tracking-wide">
                $120 one-time · No recurring fees
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-300">
            Explore
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-red-300 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA PILL — Navigate to main marketing page
      ═══════════════════════════════════════════════════ */}
      <div className="w-full flex items-center justify-center py-4 px-6" style={{ background: '#dc2626' }}>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Recognition+</span>
          <span className="text-white/40">|</span>
          <span className="text-xs font-bold text-white">Explore the full Recognition+ experience</span>
        </div>
        <button
          onClick={() => setTab('recognition-plus-tab' as TabId)}
          className="ml-auto flex items-center gap-2 px-5 py-2 rounded-full bg-white text-red-600 text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 hover:shadow-lg"
        >
          Learn More
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════
          STRIP 1 — The Problem (full-width image left)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#991b1b' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <AnimateIn>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src="/images/set-04-screenshots/pilotcenter.png"
                  alt="Pilot at terminal"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to right, rgba(127,29,29,0.4) 0%, transparent 60%)',
                  }}
                />
              </div>
            </AnimateIn>

            {/* Text */}
            <AnimateIn>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-4">
                  The Reality
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
                  Airlines do not read
                  <br />
                  your PDF resume.
                </h2>
                <p className="text-sm text-red-100 leading-relaxed mb-6 max-w-md">
                  They pull from verified databases. If your hours are not attested, your license
                  not cross-checked, and your medical not confirmed, you are invisible. The pilots
                  who get pulled are the ones pre-cleared.
                </p>
                <p className="text-sm text-red-100 leading-relaxed max-w-md">
                  Recognition+ is that clearance. One verification. Lifetime signal.
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 2 — What You Get (full-width image right)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#7f1d1d' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text (left on desktop) */}
            <AnimateIn className="order-2 lg:order-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-4">
                  What You Get
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
                  A live profile
                  <br />
                  airlines can pull.
                </h2>
                <div className="space-y-5">
                  {[
                    {
                      title: 'CAAP License Verification',
                      desc: 'We cross-reference your PEL number with CAAP records. Your license status becomes a live data point.',
                    },
                    {
                      title: 'Medical Currency Check',
                      desc: 'Class 1 medical validated against CAAP Form 551 records. No more guessing if you are current.',
                    },
                    {
                      title: 'Flight Hours Attestation',
                      desc: 'Logbook data verified and locked. Airlines see attested hours, not self-reported numbers.',
                    },
                    {
                      title: 'Recognition+ Badge',
                      desc: 'A permanent verified badge on your profile. The signal that separates cleared pilots from the pile.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="group">
                      <div className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                          <p className="text-xs text-red-200 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

            {/* Image (right on desktop) */}
            <AnimateIn className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src="/images/set-04-screenshots/wingmentor terminal.png"
                  alt="Terminal interface"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to left, rgba(127,29,29,0.5) 0%, transparent 60%)',
                  }}
                />
              </div>
            </AnimateIn>
          </div>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 3 — How It Works (dark, centered)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-28" style={{ background: '#991b1b' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <AnimateIn>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300 mb-4">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-14">
              Verified in three steps.
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {[
              {
                step: '01',
                title: 'Submit',
                desc: 'Upload your CAAP license, medical certificate, and logbook summary. Takes five minutes.',
              },
              {
                step: '02',
                title: 'We Verify',
                desc: 'Our team cross-references with CAAP, your ATO, and logbook providers. Best effort on hours.',
              },
              {
                step: '03',
                title: 'You Go Live',
                desc: 'Your profile gets the Recognition+ badge. Airlines see you as pre-cleared. Pull-ready.',
              },
            ].map((s, i) => (
              <AnimateIn key={s.step}>
                <div className="relative text-left md:text-center">
                  <span className="text-6xl md:text-7xl font-black text-white/5 absolute -top-4 left-0 md:left-1/2 md:-translate-x-1/2 select-none">
                    {s.step}
                  </span>
                  <div className="relative">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">
                      Step {s.step}
                    </p>
                    <h3 className="text-xl font-black text-white mb-3">{s.title}</h3>
                    <p className="text-xs text-red-200 leading-relaxed">{s.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                      <ArrowRight size={20} className="text-red-300" />
                    </div>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 4 — Pricing / CTA (bold, full-width)
      ═══════════════════════════════════════════════════ */}
      <SectionStrip className="py-20 md:py-24 relative" style={{ background: '#7f1d1d' }}>
        {/* Subtle background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(/images/set-02-pilot-gap/bridging-the-gap.png)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, #7f1d1d 0%, rgba(127,29,29,0.85) 50%, #7f1d1d 100%)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300 mb-4">
              Pricing
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
              $120.
              <br />
              <span className="text-red-300">One time.</span>
            </h2>
            <p className="text-sm text-red-100 leading-relaxed max-w-lg mx-auto mb-10">
              No subscriptions. No recurring billing. You pay once, we verify once, and your profile
              carries the Recognition+ badge for as long as your credentials remain valid.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={() => onNavigate('recognition-plus')}
                className="group px-10 py-3.5 text-sm font-black uppercase tracking-[0.15em] text-slate-900 transition-all hover:scale-105 flex items-center gap-3 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                  boxShadow: '0 4px 20px rgba(255,255,255,0.15), 0 1px 4px rgba(0,0,0,0.1)',
                }}
              >
                Request Verification Now
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 text-slate-700"
                />
              </button>
            </div>

            <p className="text-[10px] text-red-200/60 tracking-wide">
              Secure checkout via Dodo Payments · Verified by our team within 7 business days
            </p>
          </AnimateIn>
        </div>
      </SectionStrip>

      {/* ═══════════════════════════════════════════════════
          STRIP 5 — Guarantee / Trust
      ═══════════════════════════════════════════════════ */}
      <SectionStrip
        className="py-16 md:py-20"
        style={{ background: '#991b1b', borderTop: '1px solid rgba(255,255,255,0.15)' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <AnimateIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { label: '7-Day Turnaround', desc: 'Most verifications complete within one week.' },
                { label: 'No Hidden Fees', desc: '$120 covers everything. No upsells.' },
                { label: 'Data You Control', desc: 'You decide who sees your verified profile.' },
              ].map((t) => (
                <div key={t.label}>
                  <p className="text-sm font-black text-white mb-2">{t.label}</p>
                  <p className="text-xs text-red-200/70 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </SectionStrip>
    </div>
  );
};

export default RecognitionPlusTab;
