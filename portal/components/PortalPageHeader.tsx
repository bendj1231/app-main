import React from 'react';

interface PortalPageHeaderProps {
  onNavigate: (page: string) => void;
  activePage?: string;
}

const NAV_BUTTONS = [
  { label: 'Airline Expectations', page: 'portal-airline-expectations' },
  { label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
  { label: 'Pilot Pathways', page: 'pathways-modern' },
  { label: 'Job Listings', page: 'job-listings' },
];

export const PortalPageHeader: React.FC<PortalPageHeaderProps> = ({ onNavigate, activePage }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 px-6 py-6 text-center sticky top-0 z-50">
      <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-400 mb-2">
        Pilot Recognition Platform
      </p>
      <h1 className="text-3xl md:text-4xl font-serif font-normal text-slate-900 mb-2">
        Pilot Recognition{' '}
        <span style={{ color: '#DAA520' }}>Pathways</span>
      </h1>
      <p className="text-slate-500 text-sm max-w-xl mx-auto mb-6">
        Discover and track your journey to airline careers. Our Recognition Formula calculates your real probability of success.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {NAV_BUTTONS.map(({ label, page }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activePage === page
                ? 'bg-sky-400 text-white'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
