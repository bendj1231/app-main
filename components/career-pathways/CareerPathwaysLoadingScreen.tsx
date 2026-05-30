import React, { useEffect, useState } from 'react';
import { Plane, Route, Compass, ArrowUpRight } from 'lucide-react';

interface CareerPathwaysLoadingScreenProps {
  onComplete?: () => void;
  minimumDuration?: number;
}

export const CareerPathwaysLoadingScreen: React.FC<CareerPathwaysLoadingScreenProps> = ({
  onComplete,
  minimumDuration = 2000
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    { icon: Compass, text: 'Charting your course...' },
    { icon: Route, text: 'Mapping career pathways...' },
    { icon: Plane, text: 'Preparing for takeoff...' },
  ];

  useEffect(() => {
    const startTime = Date.now();
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 700);

    const completeTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, minimumDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(completeTimeout);
    };
  }, [minimumDuration, onComplete]);

  if (!isVisible) {
    return (
      <div 
        className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 z-50 flex items-center justify-center transition-opacity duration-500 opacity-0 pointer-events-none"
      />
    );
  }

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Logo/Brand */}
      <div className="relative mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <Route className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <ArrowUpRight className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Career<span className="text-indigo-400">Pathways</span>
            </h1>
            <p className="text-xs text-slate-400 tracking-wider uppercase">by PilotRecognition</p>
          </div>
        </div>
      </div>

      {/* Loading animation */}
      <div className="relative w-64 mb-8">
        {/* Progress bar background */}
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 rounded-full transition-all duration-100 ease-out"
            style={{ 
              width: `${progress}%`,
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
            }}
          />
        </div>
        
        {/* Progress percentage */}
        <div className="mt-3 flex justify-between text-xs">
          <span className="text-slate-500">Loading</span>
          <span className="text-indigo-400 font-medium">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Current step indicator */}
      <div className="flex items-center gap-3 text-slate-300 animate-pulse">
        <CurrentIcon className="w-5 h-5 text-indigo-400" />
        <span className="text-sm font-medium">{steps[currentStep].text}</span>
      </div>

      {/* Step indicators */}
      <div className="flex gap-2 mt-8">
        {steps.map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep 
                ? 'bg-indigo-500 w-6' 
                : index < currentStep 
                  ? 'bg-emerald-500' 
                  : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Footer tagline */}
      <p className="absolute bottom-8 text-xs text-slate-600">
        Your aviation career, mapped
      </p>

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
    </div>
  );
};

export default CareerPathwaysLoadingScreen;
