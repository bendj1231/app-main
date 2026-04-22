import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Search, Plane, ChevronLeft, ChevronRight, Sparkles, Award, ArrowRight } from 'lucide-react';

// Floating Particle System Component
const ParticleSystem: React.FC<{ color: string; count?: number }> = ({ color, count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: color,
            width: p.size,
            height: p.size,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated Count Component
const AnimatedCount: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ value, suffix = '', duration = 1.5 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
};

// Typing Animation Component
const TypingAnimation: React.FC<{ texts: string[]; speed?: number }> = ({ texts, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentText.length) {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTextIndex((textIndex + 1) % texts.length);
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed]);

  return <span>{displayText}</span>;
};

interface DiscoverPathwaysAnimationProps {
  isPlaying: boolean;
  onComplete?: () => void;
  onSceneChange?: (sceneIndex: number) => void;
}

const OdometerTitle: React.FC<{ titles: string[]; currentIndex: number }> = ({ titles, currentIndex }) => {
  return (
    <div className="relative h-8 overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-white text-sm md:text-base font-semibold tracking-wide"
        >
          {titles[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const DiscoverPathwaysAnimation: React.FC<DiscoverPathwaysAnimationProps> = ({
  isPlaying,
  onComplete,
  onSceneChange
}) => {
  const [currentScene, setCurrentScene] = useState<'airlines' | 'typeratings' | 'jobs' | 'pathways'>('airlines');
  const [opacity, setOpacity] = useState(1);

  const sceneTitles = [
    'Discover Expectations',
    'Discover Type Ratings Search',
    'Discover Pilot Matched Jobs',
    'Discover Pathways'
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const sceneDuration = 5000;
    const transitionDuration = 800;
    onSceneChange?.(0);
    console.log('DiscoverPathwaysAnimation: Scene 0 (airlines)');

    const timer1 = setTimeout(() => {
      setOpacity(0);
      setTransitionOverlay(true);
      setTimeout(() => {
        setCurrentScene('typeratings');
        setOpacity(1);
        setTransitionOverlay(false);
        onSceneChange?.(1);
        console.log('DiscoverPathwaysAnimation: Scene 1 (typeratings)');
      }, transitionDuration);
    }, sceneDuration);

    const timer2 = setTimeout(() => {
      setOpacity(0);
      setTransitionOverlay(true);
      setTimeout(() => {
        setCurrentScene('jobs');
        setOpacity(1);
        setTransitionOverlay(false);
        onSceneChange?.(2);
        console.log('DiscoverPathwaysAnimation: Scene 2 (jobs)');
      }, transitionDuration);
    }, sceneDuration * 2);

    const timer3 = setTimeout(() => {
      setOpacity(0);
      setTransitionOverlay(true);
      setTimeout(() => {
        setCurrentScene('pathways');
        setOpacity(1);
        setTransitionOverlay(false);
        onSceneChange?.(3);
        console.log('DiscoverPathwaysAnimation: Scene 3 (pathways)');
      }, transitionDuration);
    }, sceneDuration * 3);

    const timer4 = setTimeout(() => { onComplete?.(); }, sceneDuration * 4);

    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); };
  }, [isPlaying, onComplete, onSceneChange]);

  const [transitionOverlay, setTransitionOverlay] = useState(false);

  if (!isPlaying) return null;

  const currentTitleIndex = { 'airlines': 0, 'typeratings': 1, 'jobs': 2, 'pathways': 3 }[currentScene];

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-xl overflow-hidden">
      {/* Ambient Lighting Effects */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`ambient-${currentScene}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
          style={{
            background: currentScene === 'airlines'
              ? 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)'
              : currentScene === 'typeratings'
              ? 'radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
              : currentScene === 'jobs'
              ? 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
          }}
        />
      </AnimatePresence>

      {/* Dynamic Gradient Background Animation */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background: currentScene === 'airlines'
            ? 'linear-gradient(270deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05))'
            : currentScene === 'typeratings'
            ? 'linear-gradient(270deg, rgba(14, 165, 233, 0.05), rgba(6, 182, 212, 0.05), rgba(14, 165, 233, 0.05))'
            : currentScene === 'jobs'
            ? 'linear-gradient(270deg, rgba(16, 185, 129, 0.05), rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05))'
            : 'linear-gradient(270deg, rgba(139, 92, 246, 0.05), rgba(168, 85, 247, 0.05), rgba(139, 92, 246, 0.05))',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Scene Transition Overlay */}
      <AnimatePresence>
        {transitionOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particle System - scene-specific colors */}
      {currentScene === 'airlines' && <ParticleSystem color="#3b82f6" count={25} />}
      {currentScene === 'typeratings' && <ParticleSystem color="#0ea5e9" count={20} />}
      {currentScene === 'jobs' && <ParticleSystem color="#10b981" count={25} />}
      {currentScene === 'pathways' && <ParticleSystem color="#8b5cf6" count={20} />}

      {/* Odometer-style Title Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent pt-2 pb-4 px-3">
        <OdometerTitle titles={sceneTitles} currentIndex={currentTitleIndex} />
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ SCENE 1: AIRLINE EXPECTATIONS — Netflix-style modal (matches EtihadExpectationsAnimation) ═══ */}
        {currentScene === 'airlines' && (
          <motion.div key="airlines" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="absolute inset-0 flex flex-col pt-10">
            <div className="flex-1 overflow-hidden">
              <motion.div initial={{ y: 0 }} animate={{ y: -580 }} transition={{ duration: 5, ease: [0.42, 0, 0.58, 1], times: [0, 0.2, 0.8, 1] }} className="bg-white">
                {/* Netflix-style Hero with real airline image - Parallax layers */}
                <div className="relative h-[110px] overflow-hidden">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -20 }}
                    transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0"
                  >
                    <img src="https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg" alt="Etihad Airways" className="w-full h-full object-cover scale-110" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[5px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded-full border border-blue-400/30">Selected Airline</span>
                      <span className="text-[6px] text-white/80 flex items-center gap-0.5"><MapPin className="w-2 h-2" />UAE</span>
                    </div>
                    <div className="text-white text-[14px] font-serif font-bold leading-tight mb-1">Etihad Airways</div>
                    <div className="text-[6px] text-white/80 leading-tight mb-1.5">Competitive tax-free packages from Abu Dhabi. Modern fleet with premium service standards.</div>
                    <div className="flex gap-1.5 mb-1">
                      <span className="text-[5px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/30 font-semibold">$115k - $200k/yr</span>
                      <span className="text-[5px] bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30 font-semibold">2,500+ hrs TT</span>
                    </div>
                    <div className="flex gap-1">
                      {['Premium Airline', 'Abu Dhabi Hub', 'Modern Fleet'].map(t => (
                        <span key={t} className="text-[4px] text-white/70 bg-white/10 px-1 py-0.5 rounded-full border border-white/20">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Requirements section — matching EtihadExpectationsAnimation */}
                <div className="bg-slate-50 px-2 py-2">
                  <div className="text-[8px] font-bold text-slate-900 mb-1.5 pb-1 border-b-2 border-slate-200">Pilot Requirements</div>
                  <div className="bg-white rounded p-2 border border-slate-200 mb-2">
                    <div className="mb-1.5 p-1 bg-amber-50 rounded border border-amber-200">
                      <div className="text-[5px] font-semibold text-slate-800">⚠ Last Updated Jan 15, 2026</div>
                    </div>
                    {['2,500+ hrs Total Flight Time', 'Valid ATPL or CPL License', 'ICAO English Level 4+', 'Class 1 Medical Certificate', 'Multi-Engine Instrument Rating'].map(r => (
                      <div key={r} className="flex items-start gap-1 mb-0.5"><span className="text-[4px] text-slate-400 mt-0.5">•</span><span className="text-[5px] text-slate-700">{r}</span></div>
                    ))}
                  </div>
                  <div className="text-[7px] font-bold text-slate-900 mb-1">Core Expectations</div>
                  <div className="space-y-1 mb-2">
                    {[{ icon: '⚙️', name: 'Technical Mastery', desc: 'Automation, precision, systems' }, { icon: '👥', name: 'Behavioral Competency', desc: 'CRM, decisions, leadership' }, { icon: '🧠', name: 'Cognitive Resilience', desc: 'Awareness, workload mgmt' }].map(e => (
                      <div key={e.name} className="bg-white rounded p-1.5 border border-slate-200">
                        <div className="flex items-start gap-1"><span className="text-[7px]">{e.icon}</span><div><div className="text-[6px] font-semibold text-slate-800">{e.name}</div><div className="text-[5px] text-slate-500">{e.desc}</div></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[7px] font-bold text-slate-900 mb-1">Assessment Pipeline</div>
                  <div className="space-y-0.5 mb-2">
                    {['Screening - Digital audit', 'Psychometrics - Cognitive testing', 'Technical/HR - Interviews', 'Simulator Audit - EBT/CBTA'].map((s, i) => (
                      <div key={s} className="flex items-center gap-1 bg-slate-50 rounded p-1">
                        <div className={`w-2 h-2 rounded-full flex items-center justify-center text-[5px] font-bold text-white ${['bg-slate-500', 'bg-blue-500', 'bg-slate-600', 'bg-amber-500'][i]}`}>{i + 1}</div>
                        <span className="text-[5px] text-slate-700">{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[7px] font-bold text-slate-900 mb-1">Aircraft Fleet</div>
                  <div className="bg-white rounded p-1.5 border border-slate-200 mb-2">
                    <div className="text-[5px] text-slate-600">Boeing 787, 777, Airbus A350, A380 - Modern fuel-efficient fleet</div>
                  </div>
                  <div className="bg-gradient-to-r from-red-600 to-red-700 rounded p-2 text-white relative overflow-hidden">
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div><div className="text-[5px] text-red-200 uppercase tracking-wider mb-0.5">Match Score</div><motion.div className="text-[14px] font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <AnimatedCount value={84} suffix="%" />
                      </motion.div></div>
                      <div className="text-right"><div className="text-[5px] text-red-200 uppercase tracking-wider mb-0.5">Pilot</div><div className="text-[6px] font-semibold">Pete Mitchell</div></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══ SCENE 2: TYPE RATINGS — Aircraft thumbnails + 3D viewer + requirements ═══ */}
        {currentScene === 'typeratings' && (
          <motion.div key="typeratings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="absolute inset-0 flex flex-col pt-10">
            <div className="flex-1 overflow-hidden">
              <motion.div initial={{ y: 0 }} animate={{ y: -560 }} transition={{ duration: 5, ease: [0.42, 0, 0.58, 1], times: [0, 0.2, 0.8, 1] }} className="bg-slate-50">
                {/* Hero */}
                <div className="bg-gradient-to-br from-sky-900/10 via-white to-indigo-900/5 px-3 pt-2 pb-2 text-center">
                  <div className="text-[6px] font-bold tracking-[0.2em] uppercase text-sky-500 mb-0.5">3D Models & Type Rating Info</div>
                  <div className="text-slate-900 text-[12px] font-serif font-normal mb-0.5">Aircraft <span style={{ color: '#DAA520' }}>Type Ratings</span></div>
                  <div className="text-slate-500 text-[7px] mb-1.5">Explore · 3D Models · Cockpits · Requirements</div>
                  <div className="mx-auto max-w-[85%] mb-1.5">
                    <div className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-400 text-[7px] flex items-center gap-1">
                      <TypingAnimation texts={['Search aircraft, type ratings...', 'Find Cessna models...', 'Browse turboprops...']} speed={80} />
                      <Search className="w-2.5 h-2.5 ml-auto" />
                    </div>
                  </div>
                  <div className="flex gap-1 justify-center flex-wrap">
                    {['All', 'Commercial', 'Regional', 'Business Jets', 'Turboprop', 'Single Engine'].map((c, i) => (
                      <motion.div key={c}
                        animate={{ y: [0, -2, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                        className={`px-1.5 py-0.5 rounded-full text-[5px] font-medium ${i === 0 ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{c}</motion.div>
                    ))}
                  </div>
                </div>
                {/* Browse Aircraft carousel with real thumbnails */}
                <div className="px-3 pt-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <div><div className="text-slate-900 text-[10px] font-serif">Browse Aircraft</div><div className="text-slate-500 text-[6px]">55 aircraft available</div></div>
                    <div className="flex gap-1">
                      <motion.div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
                        whileHover={{ rotate: -10, scale: 1.1, boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                      ><ChevronLeft className="w-2.5 h-2.5 text-slate-500" /></motion.div>
                      <motion.div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
                        whileHover={{ rotate: 10, scale: 1.1, boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                      ><ChevronRight className="w-2.5 h-2.5 text-slate-500" /></motion.div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    {[
                      { name: 'Cessna 182', cat: 'Single Engine', tags: ['cessna', '182'], img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80' },
                      { name: 'Cessna 206', cat: 'Single Engine', tags: ['cessna', '206'], img: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&q=80' },
                      { name: 'Cessna Caravan', cat: 'Turboprop', tags: ['caravan'], img: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&q=80', selected: true },
                      { name: 'SkyCourier', cat: 'Turboprop', tags: ['skycourier'], img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
                    ].map((a, i) => (
                      <motion.div key={a.name}
                        initial={{ x: 20, opacity: 0, scale: 0.9, rotateY: 15 }}
                        animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
                        whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                        transition={{ delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ perspective: 1000 }}
                        className={`flex-shrink-0 w-[72px] rounded-lg overflow-hidden bg-white border ${a.selected ? 'ring-1 ring-sky-500 border-sky-400' : 'border-slate-200'} cursor-pointer`}>
                        <div className="h-11 relative bg-slate-100">
                          <img src={a.img} alt={a.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0.5 left-1"><div className="text-white text-[6px] font-semibold leading-tight">{a.name}</div><div className="text-white/70 text-[4px]">{a.cat}</div></div>
                        </div>
                        <div className="p-0.5 flex gap-0.5 flex-wrap">
                          {a.tags.map(t => <span key={t} className="text-[4px] px-0.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {/* 3D Viewer component — dark embed mimicking Sketchfab */}
                  <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="rounded-lg overflow-hidden border border-slate-200 bg-white mb-2">
                    <div className="h-[80px] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 relative flex items-center justify-center">
                      <div className="absolute top-1.5 left-2"><div className="px-1.5 py-0.5 rounded text-[5px] font-bold uppercase tracking-wider bg-teal-500 text-white">Turboprop</div></div>
                      <div className="relative">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                          <Plane className="w-12 h-12 text-sky-400/40" />
                        </motion.div>
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }} className="absolute inset-[-4px] border-2 border-dashed border-sky-400/20 rounded-full" />
                      </div>
                      <div className="absolute bottom-1.5 left-2"><div className="text-white text-[11px] font-serif">Cessna Caravan</div><div className="text-slate-400 text-[5px]">3D Model · Rotate to explore</div></div>
                      <div className="absolute bottom-1.5 right-2 flex gap-1">
                        <span className="text-[4px] bg-white/10 text-white/70 px-1 py-0.5 rounded">Rotate</span>
                        <span className="text-[4px] bg-white/10 text-white/70 px-1 py-0.5 rounded">Zoom</span>
                        <span className="text-[4px] bg-white/10 text-white/70 px-1 py-0.5 rounded">Cockpit</span>
                      </div>
                    </div>
                    <div className="p-1.5 grid grid-cols-4 gap-1 border-t border-slate-100">
                      {[{ l: 'MANUFACTURER', v: 'Cessna/Textron' }, { l: 'AVG. RATING COST', v: '$15k–$40k', g: true }, { l: 'FIRST FLIGHT', v: '1980 (46 yrs)' }, { l: 'POH / MANUAL', v: 'Access PDF →', b: true }].map(s => (
                        <div key={s.l}><div className="text-slate-400 text-[4px] uppercase tracking-wider font-bold">{s.l}</div><div className={`text-[6px] font-medium ${s.g ? 'text-emerald-600' : s.b ? 'text-sky-500' : 'text-slate-900'}`}>{s.v}</div></div>
                      ))}
                    </div>
                  </motion.div>
                  {/* V-Speeds & Specs */}
                  <motion.div initial={{ y: 15, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="rounded-lg border border-slate-200 bg-white p-2 mb-2">
                    <div className="text-[7px] font-bold text-slate-900 mb-1">V-Speeds & Specs</div>
                    <div className="grid grid-cols-3 gap-1">
                      {[{ l: 'MTOW', v: '8,750 lbs' }, { l: 'Vne', v: '186 KIAS' }, { l: 'Vs0', v: '61 KIAS' }, { l: 'Vs1', v: '67 KIAS' }, { l: 'Va', v: '140 KIAS' }, { l: 'Vfe', v: '120 KIAS' }].map((s, i) => (
                        <motion.div key={s.l} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 + (i * 0.05), duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="bg-slate-50 rounded p-1"><div className="text-[4px] text-slate-400 uppercase font-bold">{s.l}</div><div className="text-[6px] text-slate-800 font-medium">{s.v}</div></motion.div>
                      ))}
                    </div>
                  </motion.div>
                  {/* Need-to-Know Requirements */}
                  <motion.div initial={{ y: 15, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="rounded-lg border border-slate-200 bg-white p-2 mb-2">
                    <div className="text-[7px] font-bold text-slate-900 mb-1">Need-to-Know</div>
                    {['Normal, abnormal & emergency procedures', 'Systems knowledge — hydraulics, electrics', 'Performance calculations — V-speeds, data', 'Weight & balance calculations'].map((n, i) => (
                      <motion.div key={n} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 + (i * 0.08), duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="flex items-start gap-1 mb-0.5"><div className="w-1 h-1 bg-sky-400 rounded-full mt-1 flex-shrink-0" /><span className="text-[5px] text-slate-600">{n}</span></motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══ SCENE 3: JOB LISTINGS — aircraft images + click-expand match breakdown ═══ */}
        {currentScene === 'jobs' && (
          <motion.div key="jobs" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="absolute inset-0 flex flex-col pt-10">
            <div className="flex-1 overflow-hidden">
              <motion.div initial={{ y: 0 }} animate={{ y: -560 }} transition={{ duration: 5, ease: [0.42, 0, 0.58, 1], times: [0, 0.2, 0.8, 1] }} className="bg-slate-50">
                {/* Dark hero */}
                <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 px-3 pt-2 pb-2 text-white">
                  <div className="text-[11px] font-serif font-normal mb-0.5">Pilot Job Listings</div>
                  <div className="text-blue-100/70 text-[6px] leading-tight mb-1.5">Browse 462+ active pilot opportunities.</div>
                  <div className="grid grid-cols-3 gap-1 mb-1.5">
                    {[{ l: 'LIVE JOBS', v: '462' }, { l: 'AIRLINES', v: '245' }, { l: 'AIRCRAFT', v: '182' }].map(s => (
                      <div key={s.l} className="bg-white/10 rounded-lg p-1 border border-white/20"><div className="text-[4px] text-blue-200 uppercase tracking-wider">{s.l}</div><div className="text-[11px] font-bold">{s.v}</div></div>
                    ))}
                  </div>
                  <div className="bg-white/10 rounded-lg p-1.5 border border-white/20">
                    <div className="flex items-center gap-1 text-blue-100 text-[6px] mb-1"><Sparkles className="w-2 h-2" /><span className="font-medium">Your Match Statistics</span></div>
                    <div className="grid grid-cols-4 gap-1">
                      {[{ v: '12', l: '90%+' }, { v: '34', l: '75%+' }, { v: '8', l: 'Blind Spots' }, { v: '462', l: 'Total' }].map(s => (
                        <div key={s.l} className="bg-white/10 rounded p-0.5 text-center"><div className="text-[9px] font-bold text-white">{s.v}</div><div className="text-[4px] text-blue-200">{s.l}</div></div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Filters */}
                <div className="bg-white border-b border-slate-200 px-3 py-1.5">
                  <div className="flex gap-1 flex-wrap mb-1">
                    {['All Jobs', 'Low Timer', 'Mid Timer', 'High Timer', 'Airline', 'Captain', 'First Officer'].map((c, i) => (
                      <div key={c} className={`px-1.5 py-0.5 rounded-full text-[5px] font-medium ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{c}</div>
                    ))}
                  </div>
                  <div className="text-[6px] text-slate-500">Showing <span className="font-semibold text-slate-700">462</span> of 462 jobs</div>
                </div>
                {/* Job rows with aircraft thumbnail images */}
                <div className="px-3 py-1.5 space-y-1.5">
                  {[
                    { title: 'First Officer - Delta', company: 'Delta Air Lines', aircraft: 'B737/A320', loc: 'Atlanta, GA', role: 'First Officer', status: 'Hiring Now', img: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&q=80', expand: false },
                    { title: 'Captain - Emirates', company: 'Emirates', aircraft: 'A380', loc: 'Dubai, UAE', role: 'Captain', status: 'Hiring Now', img: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png', expand: true },
                    { title: 'FO - Qatar Airways', company: 'Qatar Airways', aircraft: 'A350', loc: 'Doha, Qatar', role: 'First Officer', status: 'Open', img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&q=80', expand: false },
                    { title: 'Cadet - Singapore Airlines', company: 'Singapore Airlines', aircraft: 'Multiple', loc: 'Singapore', role: 'Cadet', status: 'Open', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80', expand: false },
                  ].map((job, i) => (
                    <motion.div key={job.title}
                      initial={{ y: 30, opacity: 0, scale: 0.85 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2, boxShadow: '0 15px 35px rgba(59, 130, 246, 0.2)' }}
                      transition={{
                        delay: i * 0.12,
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        mass: 0.8
                      }}
                      style={{ perspective: 1000 }}
                      className={`bg-white rounded-lg overflow-hidden border cursor-pointer ${job.expand ? 'border-blue-300 shadow-md shadow-blue-500/10' : 'border-slate-200'}`}>
                      <div className="p-1.5 flex items-start gap-1.5">
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-slate-100">
                          <motion.img
                            src={job.img}
                            alt={job.aircraft}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.15 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-slate-900 text-[7px] font-semibold truncate">{job.title}</div>
                          <div className="text-[5px] text-slate-500 mb-0.5">{job.company}</div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-[5px] text-slate-500 flex items-center gap-0.5 bg-slate-50 px-1 py-0.5 rounded"><Plane className="w-1.5 h-1.5" />{job.aircraft}</span>
                            <span className="text-[5px] text-slate-500 flex items-center gap-0.5 bg-slate-50 px-1 py-0.5 rounded"><MapPin className="w-1.5 h-1.5" />{job.loc}</span>
                            <span className="text-[5px] text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-medium">{job.role}</span>
                            <motion.span className={`text-[5px] px-1 py-0.5 rounded font-medium ${job.status === 'Hiring Now' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}
                              animate={job.status === 'Hiring Now' ? {
                                boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0)', '0 0 0 8px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)']
                              } : {}}
                              transition={job.status === 'Hiring Now' ? { duration: 2, repeat: Infinity } : {}}
                            >{job.status}</motion.span>
                          </div>
                        </div>
                      </div>
                      {/* Expanded Match Breakdown — simulates clicking on Emirates Captain */}
                      {job.expand && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ delay: 1.2, duration: 0.4 }}
                          className="border-t border-blue-100 bg-gradient-to-b from-blue-50/50 to-white px-2 py-1.5">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1"><Award className="w-3 h-3 text-blue-600" /><span className="text-[7px] font-semibold text-slate-900">Match Breakdown</span></div>
                            <div className="flex items-center gap-1">
                              <motion.div className="relative w-8 h-8">
                                <svg className="w-8 h-8 transform -rotate-90">
                                  <circle cx="16" cy="16" r="14" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                                  <motion.circle
                                    cx="16" cy="16" r="14"
                                    stroke="#f59e0b"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 0.72 }}
                                    transition={{ delay: 1.3, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                                    style={{ pathLength: 0.72, strokeDasharray: '88', strokeDashoffset: 24.64 }}
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-amber-600">72%</span>
                              </motion.div>
                              <span className="px-1.5 py-0.5 rounded-full bg-sky-500 text-white text-[6px] font-semibold">PR: 82%</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {[
                              { label: 'Flight Hours', yours: '200 hrs', req: '4,000 req.', score: 5, max: 40, color: 'bg-red-500' },
                              { label: 'Type Rating', yours: 'None', req: 'A380 req.', score: 0, max: 25, color: 'bg-red-500' },
                              { label: 'Behavioral Fit', yours: null, req: null, score: 18, max: 20, color: 'bg-emerald-500' },
                              { label: 'Language', yours: null, req: null, score: 14, max: 15, color: 'bg-emerald-500' },
                            ].map(r => {
                              const pct = Math.round((r.score / r.max) * 100);
                              return (
                                <div key={r.label}>
                                  <div className="flex items-center justify-between text-[5px] mb-0.5">
                                    <span className="text-slate-600">{r.label}</span>
                                    <div className="flex items-center gap-1">
                                      {r.yours && <span className={`font-semibold ${pct < 50 ? 'text-red-600' : 'text-emerald-600'}`}>{r.yours}<span className="text-slate-400"> / {r.req}</span></span>}
                                      <span className="text-slate-400">{r.score}/{r.max}</span>
                                    </div>
                                  </div>
                                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden relative">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ delay: 1.5, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                                      className={`h-full rounded-full relative`}
                                      style={{
                                        background: `linear-gradient(90deg, ${r.color === 'bg-red-500' ? '#ef4444' : r.color === 'bg-emerald-500' ? '#10b981' : '#3b82f6'} 0%, ${r.color === 'bg-red-500' ? '#f87171' : r.color === 'bg-emerald-500' ? '#34d399' : '#60a5fa'} 100%)`,
                                        boxShadow: `0 0 10px ${r.color === 'bg-red-500' ? 'rgba(239, 68, 68, 0.5)' : r.color === 'bg-emerald-500' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
                                      }}
                                    >
                                      <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 bg-white/30 rounded-full"
                                      />
                                    </motion.div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-1.5 rounded p-1 bg-sky-50 border border-sky-200">
                            <div className="text-[5px] font-semibold text-sky-600 mb-0.5">To improve this match:</div>
                            {['Build more flight hours (200 → 4,000 required)', 'Obtain A380 type rating'].map((t, i) => (
                              <div key={i} className="flex items-start gap-0.5 text-[5px] text-slate-600"><ArrowRight className="w-2 h-2 text-sky-400 flex-shrink-0 mt-0.5" />{t}</div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══ SCENE 4: PILOT PATHWAYS — PathwaysModern carousel with aircraft images ═══ */}
        {currentScene === 'pathways' && (
          <motion.div key="pathways" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="absolute inset-0 flex flex-col pt-10">
            <div className="flex-1 overflow-hidden">
              <motion.div initial={{ y: 0 }} animate={{ y: -520 }} transition={{ duration: 5, ease: [0.42, 0, 0.58, 1], times: [0, 0.2, 0.8, 1] }} className="bg-slate-950">
                {/* Header */}
                <div className="px-3 pt-2 pb-1.5 text-center">
                  <div className="text-white text-[12px] font-serif font-normal mb-0.5">Pilot Pathways</div>
                  <div className="text-slate-400 text-[6px] leading-tight mb-1.5">Discover and track your journey to airline careers.</div>
                  <div className="mx-auto max-w-[90%] mb-1.5">
                    <div className="w-full px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 text-[7px] flex items-center gap-1">
                      <Search className="w-2 h-2" />
                      <TypingAnimation texts={['Search pathways...', 'Find airline routes...', 'Browse cadet programs...']} speed={80} />
                    </div>
                  </div>
                  <div className="flex gap-1 justify-center mb-1.5">
                    {['Airline Expectations', 'Aircraft Type-Ratings', 'Pilot Pathways', 'Job Listings'].map((l, i) => (
                      <motion.div key={l}
                        animate={{ y: [0, -2, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut"
                        }}
                        className={`px-1.5 py-0.5 rounded-md text-[5px] font-medium ${i === 2 ? 'bg-sky-400 text-white' : 'bg-sky-600 text-white'}`}>{l}</motion.div>
                    ))}
                  </div>
                  <div className="flex gap-1 justify-center flex-wrap mb-1">
                    {['All', 'Airline Pathways', 'Cadet Programme', 'Type Rating', 'Private', 'Cargo'].map((c, i) => (
                      <motion.div key={c}
                        animate={{ y: [0, -2, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                        className={`px-1.5 py-0.5 rounded-full text-[5px] font-medium ${i === 0 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{c}</motion.div>
                    ))}
                  </div>
                  <div className="flex gap-1 justify-center mb-1">
                    <span className="text-[5px] text-slate-500">Match:</span>
                    {['All', '60-75%', '75-90%', '90%+'].map((f, i) => (
                      <div key={f} className={`px-1 py-0.5 rounded-full text-[4px] font-medium ${i === 0 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{f}</div>
                    ))}
                  </div>
                  <div className="text-slate-500 text-[6px]">48 pathways available</div>
                </div>
                {/* Pathway cards — real aircraft images with airline logos */}
                <div className="px-3 pt-1.5 space-y-2">
                  {[
                    { name: 'Qatar Airways FO', airline: 'Qatar Airways', aircraft: 'A350', loc: 'Doha | Qatar', match: 95, pr: 82, hiring: true, img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Qatar_Airways_logo.svg/1200px-Qatar_Airways_logo.svg.png' },
                    { name: 'Emirates Cadet Programme', airline: 'Emirates', aircraft: 'A380', loc: 'Dubai | UAE', match: 88, pr: 82, hiring: true, img: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png' },
                    { name: 'Etihad B787 Type Rating', airline: 'Etihad Airways', aircraft: 'B787', loc: 'Abu Dhabi | UAE', match: 84, pr: 82, hiring: false, img: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg', logo: 'https://logos-world.net/wp-content/uploads/2023/01/Etihad-Airways-Logo.png' },
                    { name: 'SIA Cadet Pilot Programme', airline: 'Singapore Airlines', aircraft: 'A350', loc: 'Singapore', match: 79, pr: 82, hiring: false, img: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/singapore-airlines.jpg', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/2b/Singapore_Airlines_logo.svg/1200px-Singapore_Airlines_logo.svg.png' },
                    { name: 'Cathay Pacific FO', airline: 'Cathay Pacific', aircraft: 'A350', loc: 'Hong Kong', match: 76, pr: 82, hiring: true, img: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Cathay_Pacific_logo.svg/1200px-Cathay_Pacific_logo.svg.png' },
                    { name: 'DHL Cargo Pathway', airline: 'DHL Aviation', aircraft: 'B777F', loc: 'Leipzig | Germany', match: 71, pr: 82, hiring: false, img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80', logo: null },
                  ].map((pw, i) => (
                    <motion.div key={pw.name}
                      initial={{ scale: 0.85, opacity: 0, y: 30 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)' }}
                      transition={{
                        delay: i * 0.1,
                        type: "spring",
                        stiffness: 280,
                        damping: 18,
                        mass: 0.75
                      }}
                      className="rounded-xl overflow-hidden border border-slate-800 cursor-pointer">
                      <div className="h-[52px] relative overflow-hidden">
                        <motion.img
                          src={pw.img}
                          alt={pw.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                        {/* Badges top-right */}
                        <div className="absolute top-1 right-1 flex gap-0.5">
                          <span className="px-1 py-0.5 rounded-full bg-emerald-500/90 text-white text-[5px] font-semibold">
                            <AnimatedCount value={pw.match} suffix="% Match" />
                          </span>
                          <span className="px-1 py-0.5 rounded-full bg-sky-500/90 text-white text-[5px] font-semibold">PR: {pw.pr}%</span>
                          {pw.hiring && (
                            <motion.span className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-green-500/80 text-white text-[5px] font-semibold"
                              animate={{
                                boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 8px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0.4)']
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />Hiring
                            </motion.span>
                          )}
                        </div>
                        {/* Info bottom — with airline logo */}
                        <div className="absolute bottom-1 left-0 right-0 px-2 text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            {pw.logo && <img src={pw.logo} alt={pw.airline} className="h-3 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                            <div className="text-white text-[8px] font-serif">{pw.name}</div>
                          </div>
                          <div className="text-white/70 text-[5px]">{pw.airline} · {pw.aircraft} · {pw.loc}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
