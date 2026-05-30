import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';

interface ProgramDetailPageProps {
  onNavigate?: (path: string) => void;
}

export const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({ onNavigate }) => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const programData: Record<string, {
    title: string;
    description: string;
    modules: string[];
    price: string;
    duration: string;
  }> = {
    foundation: {
      title: 'Foundation Program',
      description: 'Build the essential skills and knowledge needed to launch your aviation career. This comprehensive program covers everything from basic airmanship to professional development.',
      modules: [
        'Introduction to Professional Aviation',
        'Airmanship Fundamentals',
        'Crew Resource Management Basics',
        'Regulatory Framework',
        'Career Planning Strategies',
        'Interview Preparation',
        'Professional Communication'
      ],
      price: '$49',
      duration: '8 weeks'
    },
    transition: {
      title: 'Transition Program',
      description: 'Bridge the gap between flight training and airline operations. Designed for pilots preparing to enter commercial aviation.',
      modules: [
        'Airline Operations Overview',
        'Advanced CRM Techniques',
        'Technical Interview Mastery',
        'Simulator Preparation',
        'Airline Selection Strategy',
        'Type Rating Fundamentals',
        'Line Operations Introduction'
      ],
      price: '$299',
      duration: '12 weeks'
    },
    certification: {
      title: 'Certification Prep',
      description: 'Intensive preparation for ATPL exams and type rating assessments. Focus on passing your certifications on the first attempt.',
      modules: [
        'ATPL Theory Review',
        'Air Law and Regulations',
        'Meteorology for Pilots',
        'Navigation Principles',
        'Aircraft Systems Deep Dive',
        'Type Rating Oral Prep',
        'Checkride Preparation'
      ],
      price: '$149',
      duration: '6 weeks'
    }
  };

  const program = programData[programId || ''];

  if (!program) {
    return (
      <div className="min-h-screen bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-white">Program not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => handleNavigate('/programs')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Program Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm mb-4">
            <BookOpen className="w-4 h-4" />
            {program.duration}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{program.title}</h1>
          <p className="text-lg text-slate-400">{program.description}</p>
        </div>

        {/* Modules */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Program Modules</h2>
          <div className="space-y-4">
            {program.modules.map((module, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-300">{module}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-6">
          <div>
            <p className="text-sm text-slate-400">Complete program access</p>
            <p className="text-3xl font-bold text-white">{program.price}</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-white font-semibold transition-all">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;
