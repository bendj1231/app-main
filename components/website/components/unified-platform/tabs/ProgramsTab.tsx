import React from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { safeRedirect } from '@/src/lib/url-validator';

export const ProgramsTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const { currentUser, userProfile } = useAuth();
  const isEnrolledInFoundational = userProfile?.is_enrolled_in_foundational ?? false;

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="relative mb-8 text-center">
        <h2 className="text-3xl font-serif text-white tracking-wide mb-2">PROGRAMS</h2>
        <div className="h-1 bg-gradient-to-r from-teal-500 to-blue-500 w-32 mx-auto" />
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">

          {/* Left hero card: W1000 (enrolled) or Foundation video (unenrolled) */}
          <div className="md:col-span-2 h-80 md:h-96">
            {currentUser && isEnrolledInFoundational ? (
              <div
                className="relative group cursor-pointer overflow-hidden h-full"
                onClick={() => onNavigate('/w1000')}
              >
                <div className="h-full flex flex-col">
                  <div className="relative h-[70%] overflow-hidden">
                    <img src="w12.png" alt="W1000 Flight Deck" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 bg-blue-500 text-white text-sm font-bold uppercase tracking-wider">Access Simulator</span>
                    </div>
                  </div>
                  <div className="h-[30%] bg-slate-900 border border-slate-700 p-4 flex flex-col justify-center">
                    <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1">» W1000 Flight Deck</h3>
                    <p className="text-slate-300 text-xs leading-tight">Advanced aviation training simulator with PFD, VOR, and exam modules</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
              </div>
            ) : (
              <div
                className="relative group cursor-pointer overflow-hidden h-full"
                onClick={() => onNavigate('foundational-program')}
              >
                <div className="h-full flex flex-col">
                  <div className="relative h-[70%] overflow-hidden bg-slate-900">
                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
                      <source src="/images/My Movie 3 - 720WebShareName.mov" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 bg-teal-500 text-white text-sm font-bold uppercase tracking-wider">Start Here</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="h-[30%] bg-slate-900 border border-slate-700 p-4 flex flex-col justify-center">
                    <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1">» Foundation Program</h3>
                    <p className="text-slate-300 text-xs leading-tight">Start your pilot journey with structured mentorship and guidance</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Right column: three stacked directory cards */}
          <div className="md:col-span-2 flex flex-col gap-3 md:gap-4 h-80 md:h-96">

            {/* Foundational Platform */}
            <div
              className="relative group cursor-pointer overflow-hidden flex-1 min-h-0 border border-white/20 hover:scale-[1.02] transition-transform"
              onClick={() => onNavigate('foundational-platform')}
            >
              <img src="fp1.png" alt="Foundational Platform" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
              <div className="relative h-full flex items-center px-6">
                <div>
                  <h3 className="text-white font-serif text-base tracking-wide mb-1">» Foundational Platform</h3>
                  <p className="text-slate-300 text-xs leading-tight">Access your enrolled courses, track progress, and engage with program materials</p>
                </div>
              </div>
            </div>

            {/* Examination Portal */}
            <div
              className="relative group cursor-pointer overflow-hidden flex-1 min-h-0 border border-white/20 hover:scale-[1.02] transition-transform"
              onClick={() => { safeRedirect('/examination-portal'); }}
            >
              <img src="/ep.png" alt="Examination Portal" className="absolute inset-0 w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }} />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-transparent" />
              <div className="relative h-full flex items-center px-6">
                <div>
                  <h3 className="text-white font-serif text-base tracking-wide mb-1">» Examination Portal</h3>
                  <p className="text-slate-300 text-xs leading-tight">Certification examinations, assessments, and progress tracking</p>
                </div>
              </div>
            </div>

            {/* Official Examination Board */}
            <div
              className="relative group cursor-pointer overflow-hidden flex-1 min-h-0 bg-white border border-white/20 hover:scale-[1.02] transition-transform"
              onClick={() => onNavigate('official-examination-board')}
            >
              <div className="relative h-full flex items-center px-6">
                <div>
                  <h3 className="text-slate-900 font-serif text-base tracking-wide mb-1">» Official Examination Board & Certifications</h3>
                  <p className="text-slate-600 text-xs leading-tight">Official certification bodies, examination boards, and industry-standard credentials</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
