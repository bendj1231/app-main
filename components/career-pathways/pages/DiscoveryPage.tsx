import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Sparkles, Target } from 'lucide-react';

interface DiscoveryPageProps {
  onNavigate?: (path: string) => void;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const questions = [
    {
      id: 'experience',
      question: 'How many flight hours do you currently have?',
      options: ['0-200 (Student/Cadet)', '200-1500 (Building Time)', '1500+ (Commercial Ready)']
    },
    {
      id: 'goal',
      question: 'What is your primary career goal?',
      options: ['Airline Captain', 'Corporate Pilot', 'Charter Operations', 'Cargo Aviation', 'Flight Instructor']
    },
    {
      id: 'timeline',
      question: 'What is your target timeline?',
      options: ['Within 6 months', '6-12 months', '1-2 years', '2+ years']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => handleNavigate('/')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Career Discovery</h1>
            <p className="text-slate-400">Find your optimal aviation path</p>
          </div>
        </div>

        {/* Discovery Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">AI-Powered Matching</h2>
              <p className="text-sm text-slate-400">Answer a few questions to get personalized recommendations</p>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-sm flex items-center justify-center font-medium">
                    {idx + 1}
                  </span>
                  <h3 className="text-white font-medium">{q.question}</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 pl-8">
                  {q.options.map((option) => (
                    <button
                      key={option}
                      className="p-3 text-left text-sm text-slate-300 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Preview */}
        <div className="text-center">
          <button 
            onClick={() => handleNavigate('/pathways')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-white font-semibold transition-all"
          >
            <Target className="w-5 h-5" />
            Get My Career Path
          </button>
          <p className="mt-4 text-sm text-slate-500">
            Based on your profile, we'll match you with the best career opportunities
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
