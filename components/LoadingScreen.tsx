import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  logoUrl: string;
  userName?: string;
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ logoUrl, userName, onComplete }) => {
  const [stage, setStage] = useState<'whiteout' | 'text-in' | 'text-out' | 'finished'>('whiteout');

  useEffect(() => {
    // Sequence Timeline

    // 1. Start Whiteout (0ms)
    const timer1 = setTimeout(() => setStage('text-in'), 500);

    // 2. Text Fade Out (2500ms) -  Reduced viewing time slightly for better pacing without progress bar
    const timer2 = setTimeout(() => setStage('text-out'), 2500);

    // 3. Complete / Materialize App (3500ms)
    const timer3 = setTimeout(() => {
      setStage('finished');
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-1000 ease-in-out ${stage === 'whiteout' ? 'bg-white' : 'bg-slate-50'}`}>

      {/* Content Container */}
      <div className={`flex flex-col items-center transition-all duration-1000 transform ${stage === 'text-in' ? 'opacity-100 blur-0 scale-100' :
          stage === 'text-out' ? 'opacity-0 blur-lg scale-110' :
            'opacity-0 blur-xl scale-95'
        }`}>

        {/* Logo (Subtle) */}
        <img
          src={logoUrl}
          alt="WingMentor"
          className="w-24 h-24 object-contain mb-8 opacity-90"
        />

        {/* Main Text */}
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter mb-4 text-center">
          WELCOME, <br />
          <span className="text-sky-600 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-800">FELLOW PILOT</span>
        </h1>

        {/* Subtext */}
        {userName && (
          <p className="text-xl text-slate-500 font-mono tracking-widest uppercase mb-4">
            ID: {userName}
          </p>
        )}

        <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-300 mb-12">
          RECOGNITION | ASSURANCE | SUPPORT
        </p>

        {/* Subtle Decorative Element instead of Progress Bar */}
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;