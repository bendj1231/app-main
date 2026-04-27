import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PathwayDetailPageProps {
  pathwayId: string;
  onBack: () => void;
}

const PathwayDetailPage: React.FC<PathwayDetailPageProps> = ({ pathwayId, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Pathways
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-4">Pathway Details</h1>
        <p className="text-slate-400 mb-8">Pathway ID: {pathwayId}</p>

        <div className="bg-slate-800 rounded-xl p-8">
          <h2 className="text-2xl mb-4">Pathway Information</h2>
          <p className="text-slate-300">
            This is the pathway detail page for pathway ID: {pathwayId}.
            The full pathway details will be loaded here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PathwayDetailPage;
