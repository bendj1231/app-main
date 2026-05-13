import React from 'react';

export interface Pathway {
  id: string;
  airline: string;
  type: 'Cadet' | 'Cargo' | 'Charter' | 'Corporate';
  title: string;
  location: string;
  requirements: {
    minHours: number;
    licenseType: string;
    ratings: string[];
    minRecognitionScore: number;
    backgroundCheck: boolean;
  };
  benefits: string[];
  deadline?: string;
  spotsAvailable?: number;
}

interface PathwayCardProps {
  pathway: Pathway;
  pilotScore: number;
  pilotProfile: {
    totalHours: number;
    licenseType: string;
    ratings: string[];
    backgroundCheck: boolean;
  };
  onApply: (pathwayId: string) => void;
}

export function PathwayCard({ pathway, pilotScore, pilotProfile, onApply }: PathwayCardProps) {
  // Calculate gaps
  const gaps: string[] = [];
  const meets: string[] = [];
  
  if (pilotProfile.totalHours < pathway.requirements.minHours) {
    gaps.push(`Need ${pathway.requirements.minHours - pilotProfile.totalHours} more flight hours`);
  } else {
    meets.push(`${pilotProfile.totalHours} flight hours ✓`);
  }
  
  if (pilotProfile.licenseType !== pathway.requirements.licenseType) {
    gaps.push(`Requires ${pathway.requirements.licenseType}`);
  } else {
    meets.push(`${pathway.requirements.licenseType} ✓`);
  }
  
  const missingRatings = pathway.requirements.ratings.filter(
    r => !pilotProfile.ratings.includes(r)
  );
  if (missingRatings.length > 0) {
    gaps.push(`Missing ratings: ${missingRatings.join(', ')}`);
  }
  if (pathway.requirements.ratings.some(r => pilotProfile.ratings.includes(r))) {
    meets.push(`${pathway.requirements.ratings.filter(r => pilotProfile.ratings.includes(r)).join(', ')} ✓`);
  }
  
  if (pilotScore < pathway.requirements.minRecognitionScore) {
    gaps.push(`Need ${pathway.requirements.minRecognitionScore - pilotScore} more recognition points`);
  } else {
    meets.push(`Recognition Score ${pilotScore} ✓`);
  }
  
  if (pathway.requirements.backgroundCheck && !pilotProfile.backgroundCheck) {
    gaps.push('Background check required');
  } else if (pathway.requirements.backgroundCheck) {
    meets.push('Background check verified ✓');
  }
  
  const isEligible = gaps.length === 0;
  const eligibilityPercentage = Math.round((meets.length / (meets.length + gaps.length)) * 100);
  
  const typeColors: Record<string, string> = {
    'Cadet': 'bg-blue-100 text-blue-800',
    'Cargo': 'bg-green-100 text-green-800',
    'Charter': 'bg-purple-100 text-purple-800',
    'Corporate': 'bg-amber-100 text-amber-800'
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[pathway.type]}`}>
            {pathway.type} Program
          </span>
          {pathway.spotsAvailable && (
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
              {pathway.spotsAvailable} spots left
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold mb-1">{pathway.airline}</h3>
        <p className="text-slate-300 text-sm">{pathway.title}</p>
        <div className="flex items-center mt-3 text-sm text-slate-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {pathway.location}
        </div>
      </div>
      
      {/* Eligibility Meter */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Your Eligibility</span>
          <span className={`text-sm font-bold ${isEligible ? 'text-green-600' : 'text-amber-600'}`}>
            {eligibilityPercentage}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isEligible ? 'bg-green-500' : 'bg-amber-500'}`}
            style={{ width: `${eligibilityPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Requirements */}
      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements Met</h4>
          {meets.length > 0 ? (
            <ul className="space-y-1">
              {meets.slice(0, 3).map((item: string, idx: number) => (
                <li key={idx} className="text-sm text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">None yet — start building your profile</p>
          )}
        </div>
        
        {gaps.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Gaps to Close</h4>
            <ul className="space-y-1">
              {gaps.slice(0, 3).map((gap, idx) => (
                <li key={idx} className="text-sm text-red-600 flex items-start">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {gap}
                </li>
              ))}
              {gaps.length > 3 && (
                <li className="text-xs text-gray-500">+{gaps.length - 3} more requirements...</li>
              )}
            </ul>
          </div>
        )}
        
        {/* Benefits */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">What You Get</h4>
          <ul className="space-y-1">
            {pathway.benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        
        {/* CTA */}
        <div className="pt-4">
          {isEligible ? (
            <button
              onClick={() => onApply(pathway.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Apply Now — Pre-Cleared
            </button>
          ) : (
            <div className="space-y-2">
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
              >
                Not Yet Eligible ({gaps.length} gaps)
              </button>
              <a 
                href="/programs"
                className="block w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2"
              >
                See programs to close gaps →
              </a>
            </div>
          )}
          
          {pathway.deadline && (
            <p className="text-xs text-center text-gray-500 mt-2">
              Application deadline: {pathway.deadline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Pre-defined pathways for MVP
export const MVP_PATHWAYS: Pathway[] = [
  {
    id: 'etihad-cadet-2026',
    airline: 'Etihad Airways',
    type: 'Cadet',
    title: 'Cadet Pilot Program 2026',
    location: 'Abu Dhabi, UAE',
    requirements: {
      minHours: 0, // Cadet programs accept low hours
      licenseType: 'Student',
      ratings: [],
      minRecognitionScore: 30,
      backgroundCheck: true
    },
    benefits: [
      'Full scholarship covering training costs',
      'Guaranteed employment upon completion',
      'Airbus A320 type rating included',
      'Competitive salary from day 1 of training'
    ],
    deadline: 'June 30, 2026',
    spotsAvailable: 24
  },
  {
    id: 'fedex-cargo-first-officer',
    airline: 'FedEx Express',
    type: 'Cargo',
    title: 'First Officer - Boeing 767 Fleet',
    location: 'Memphis, TN / Various Hubs',
    requirements: {
      minHours: 1500,
      licenseType: 'ATPL',
      ratings: ['Instrument', 'Multi-Engine'],
      minRecognitionScore: 70,
      backgroundCheck: true
    },
    benefits: [
      '$95,000-$125,000 starting salary',
      'Home base flexibility',
      'Rapid upgrade to Captain (2-3 years)',
      'Comprehensive benefits package'
    ],
    spotsAvailable: 15
  },
  {
    id: 'vista-corporate-pilot',
    airline: 'VistaJet',
    type: 'Corporate',
    title: 'Corporate Pilot - Challenger 350',
    location: 'Global / Flexible Base',
    requirements: {
      minHours: 3000,
      licenseType: 'ATPL',
      ratings: ['Instrument', 'Multi-Engine', 'Type Rating'],
      minRecognitionScore: 80,
      backgroundCheck: true
    },
    benefits: [
      '$180,000-$250,000 annual compensation',
      'Flexible scheduling (20 days on/10 days off)',
      'Global travel to 187 countries',
      'Luxury accommodation when traveling'
    ],
    spotsAvailable: 8
  }
];
