import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DigitalLogbookAnimationProps {
  isHovered: boolean;
}

export const DigitalLogbookAnimation: React.FC<DigitalLogbookAnimationProps> = ({ isHovered }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    
    // Reset animation state to beginning
    setScrollY(0);
    setIsTyping(true);
    
    // Animation loop function
    const runAnimation = () => {
      const scrollInterval = setInterval(() => {
        setScrollY(prev => {
          if (prev >= 100) {
            clearInterval(scrollInterval);
            return 100;
          }
          return prev + 2; // Increased from 0.5 to 2 for faster scrolling
        });
      }, 20); // Reduced from 30ms to 20ms for faster scrolling
      
      // Store the interval ref for cleanup
      const intervalRef = { current: scrollInterval } as any;
      timeoutsRef.current.push(intervalRef);
      
      // Loop back to beginning after scrolling completes
      const loopTimeout = setTimeout(() => {
        clearInterval(scrollInterval);
        setScrollY(0);
        runAnimation(); // Restart the loop
      }, 2000); // Complete scroll now takes ~1 second, then loop
      timeoutsRef.current.push(loopTimeout);
    };
    
    runAnimation();
    
    return () => {
      timeoutsRef.current.forEach(timeout => {
        if (typeof timeout === 'object' && 'current' in timeout) {
          clearInterval(timeout.current);
        } else {
          clearTimeout(timeout);
        }
      });
      timeoutsRef.current = [];
    };
  }, [isHovered]); // Add isHovered dependency to restart when returning to component

  return (
    <div className="absolute inset-0 bg-[#f0f4f8] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[8px] text-slate-600 uppercase tracking-wide">Verified Identity</span>
        </div>
        <div className="text-[7px] text-slate-400">Digital Logbook</div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden p-3">
        <div
          className="transition-transform ease-linear"
          style={{ 
            transform: `translateY(-${scrollY}px)`,
            paddingBottom: `${scrollY + 20}px`,
            transitionDuration: '3s'
          }}
        >
          {/* Profile Header */}
          <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm mb-3">
            <div className="text-center">
              <p className="text-[6px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-1">Pilot Recognition</p>
              <h1 className="text-sm font-serif text-slate-900">Pilot Profile</h1>
            </div>
          </div>

          {/* Digital Logbook Card */}
          <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-[10px] font-serif text-slate-900 font-bold">Digital Logbook</h2>
                <p className="text-[6px] font-bold text-emerald-600 uppercase tracking-wide">Verified Flight Record</p>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-9 gap-1 py-1 border-b border-slate-200 text-[5px] font-bold text-slate-500 uppercase tracking-wide">
              <div>DATE</div>
              <div>TYPE</div>
              <div>IDENT</div>
              <div>ROUTE</div>
              <div>CAT</div>
              <div className="col-span-2">DESC</div>
              <div>TIME</div>
              <div>TOT</div>
            </div>

            {/* Flight Entries */}
            <div className="space-y-1">
              <div className="grid grid-cols-9 gap-1 py-2 border-b border-slate-100 text-[6px] text-slate-700 items-center">
                <div className="font-medium">Jan 15</div>
                <div>A320</div>
                <div>ABC-123</div>
                <div>JFK-LHR</div>
                <div className="text-emerald-600">Dual</div>
                <div className="col-span-2 truncate">Commercial flight instruction</div>
                <div className="font-bold">7.2</div>
                <div className="font-bold">7.2</div>
              </div>

              <div className="grid grid-cols-9 gap-1 py-2 border-b border-slate-100 text-[6px] text-slate-700 items-center">
                <div className="font-medium">Jan 12</div>
                <div>C172</div>
                <div>N456DF</div>
                <div>LAX-SFO</div>
                <div className="text-blue-600">PIC</div>
                <div className="col-span-2 truncate">Solo flight - IFR practice</div>
                <div className="font-bold">3.5</div>
                <div className="font-bold">3.5</div>
              </div>

              <div className="grid grid-cols-9 gap-1 py-2 border-b border-slate-100 text-[6px] text-slate-700 items-center">
                <div className="font-medium">Jan 08</div>
                <div>PA28</div>
                <div>N789GH</div>
                <div>MIA-NAS</div>
                <div className="text-purple-600">Dual XC</div>
                <div className="col-span-2 truncate">Night cross country</div>
                <div className="font-bold">4.1</div>
                <div className="font-bold">4.1</div>
              </div>

              <div className="grid grid-cols-9 gap-1 py-2 border-b border-slate-100 text-[6px] text-slate-700 items-center">
                <div className="font-medium">Jan 05</div>
                <div>C152</div>
                <div>N321JK</div>
                <div>Local</div>
                <div className="text-emerald-600">Dual</div>
                <div className="col-span-2 truncate">Pattern work</div>
                <div className="font-bold">2.3</div>
                <div className="font-bold">2.3</div>
              </div>

              <div className="grid grid-cols-9 gap-1 py-2 text-[6px] text-slate-700 items-center">
                <div className="font-medium">Jan 02</div>
                <div>BE76</div>
                <div>N654LM</div>
                <div>ORD-DTW</div>
                <div className="text-orange-600">Multi</div>
                <div className="col-span-2 truncate">Multi-engine instruction</div>
                <div className="font-bold">5.7</div>
                <div className="font-bold">5.7</div>
              </div>
            </div>

            {/* Total Hours */}
            <div className="mt-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-[7px]">
                <div className="flex gap-2">
                  <div>
                    <span className="text-slate-500">Dual:</span>
                    <span className="ml-1 font-bold">14.6</span>
                  </div>
                  <div>
                    <span className="text-slate-500">PIC:</span>
                    <span className="ml-1 font-bold">8.8</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Total:</span>
                  <span className="ml-1 text-[9px] font-bold text-slate-900">22.8 hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
