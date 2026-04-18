import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  logoUrl: string;
  userName?: string;
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ logoUrl, userName, onComplete }) => {
  const [stage, setStage] = useState<'whiteout' | 'text-in' | 'text-out' | 'finished'>('whiteout');
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    // Sequence Timeline with progress tracking
    const totalDuration = 3500;
    const updateInterval = 50;
    let elapsed = 0;

    const progressTimer = setInterval(() => {
      elapsed += updateInterval;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update loading text based on progress
      if (newProgress < 30) {
        setLoadingText('Initializing platform...');
      } else if (newProgress < 60) {
        setLoadingText('Loading your profile...');
      } else if (newProgress < 90) {
        setLoadingText('Preparing dashboard...');
      } else {
        setLoadingText('Almost ready...');
      }

      if (elapsed >= totalDuration) {
        clearInterval(progressTimer);
      }
    }, updateInterval);

    // 1. Start Whiteout (0ms)
    const timer1 = setTimeout(() => setStage('text-in'), 500);

    // 2. Text Fade Out (2500ms)
    const timer2 = setTimeout(() => setStage('text-out'), 2500);

    // 3. Complete / Materialize App (3500ms)
    const timer3 = setTimeout(() => {
      setStage('finished');
      onComplete();
    }, 3500);

    return () => {
      clearInterval(progressTimer);
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

        {/* Logo with subtle animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full animate-pulse"></div>
          <img
            src={logoUrl}
            alt="WingMentor"
            className="w-24 h-24 object-contain relative z-10 animate-pulse"
          />
        </div>

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

        <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-300 mb-8">
          RECOGNITION | ASSURANCE | SUPPORT
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage and Loading Text */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-600">{Math.round(progress)}%</span>
          <span className="text-sm text-slate-500">{loadingText}</span>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-3 mt-8 opacity-60">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;