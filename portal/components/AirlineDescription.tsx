import React from 'react';
import { Info } from 'lucide-react';

export const AirlineDescription: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 mb-8 relative z-30">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-white border-l-4 border-sky-500 shadow-md">
        <Info className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">About Airline Expectations</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Browse airlines from around the world to explore pilot requirements, salary ranges,
            fleet details, and assessment processes. Airline logos and information are sourced from
            publicly available data for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};
