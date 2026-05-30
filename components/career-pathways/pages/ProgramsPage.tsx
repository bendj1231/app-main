import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Clock, Users, Award } from 'lucide-react';

interface ProgramsPageProps {
  onNavigate?: (path: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const programs = [
    {
      id: 'foundation',
      title: 'Foundation Program',
      description: 'Build core aviation knowledge and professional skills',
      duration: '8 weeks',
      students: '2,400+',
      level: 'Beginner',
      price: '$49',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'transition',
      title: 'Transition Program',
      description: 'Prepare for airline operations and technical interviews',
      duration: '12 weeks',
      students: '1,800+',
      level: 'Intermediate',
      price: '$299',
      color: 'from-indigo-500 to-violet-600'
    },
    {
      id: 'certification',
      title: 'Certification Prep',
      description: 'ATPL exam preparation and type rating readiness',
      duration: '6 weeks',
      students: '3,200+',
      level: 'Advanced',
      price: '$149',
      color: 'from-violet-500 to-purple-600'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => handleNavigate('/')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Training Programs</h1>
            <p className="text-slate-400">Accelerate your career with structured learning</p>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              onClick={() => handleNavigate(`/programs/${program.id}`)}
              className="group p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-indigo-500/30 hover:bg-slate-900 cursor-pointer transition-all"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-4 shadow-lg`}>
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {program.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">{program.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {program.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {program.students}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">
                  {program.level}
                </span>
                <span className="text-lg font-bold text-white">{program.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
