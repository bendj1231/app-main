import React, { useEffect, useState } from 'react';

interface CareerPathwaysLoadingScreenProps {
  onComplete?: () => void;
  minimumDuration?: number;
}

export const CareerPathwaysLoadingScreen: React.FC<CareerPathwaysLoadingScreenProps> = ({
  onComplete,
  minimumDuration = 2000
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

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

    const completeTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, minimumDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [minimumDuration, onComplete]);

  if (!isVisible) {
    return (
      <div 
        className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-500 opacity-0 pointer-events-none"
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-500"
    >
      {/* Logo/Brand */}
      <div className="relative mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          pilotcareer<span className="text-red-500">pathways</span>.com
        </h1>
        <p className="mt-4 text-sm md:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
          Connecting pilots to the industry direction and profile alignment never had before
        </p>
      </div>

      {/* Loading animation */}
      <div className="relative w-64 mb-8">
        {/* Progress bar background */}
        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-full transition-all duration-100 ease-out"
            style={{ 
              width: `${progress}%`,
            }}
          />
        </div>
        
        {/* Progress percentage */}
        <div className="mt-3 flex justify-between text-xs">
          <span className="text-slate-400">Loading</span>
          <span className="text-slate-600 font-medium">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Footer tagline */}
      <p className="absolute bottom-8 text-xs text-slate-400">
        Your aviation career, mapped
      </p>
    </div>
  );
};

export default CareerPathwaysLoadingScreen;
