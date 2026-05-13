/**
 * PathwayPriority Component
 * 
 * Premium Pathway Features for Recognition+ members:
 * - Interest-based pathway matching
 * - Priority listings for airline cadet programs
 * - Customized training stack recommendations
 * - Milestone tracking from PPL to legacy carrier
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Target, 
  GraduationCap, 
  Plane, 
  TrendingUp, 
  Award, 
  Briefcase,
  CheckCircle,
  Circle,
  ChevronRight,
  Star,
  BookOpen,
  Radio,
  Navigation,
  AlertCircle,
  Zap
} from 'lucide-react';

type PathwayType = 'commercial' | 'cargo' | 'corporate' | 'flight_instruction' | 'regional' | 'legacy';
type MilestoneStatus = 'completed' | 'in_progress' | 'pending' | 'locked';

interface TrainingStack {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommended: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  requiredHours?: number;
  requiredRating?: string;
  estimatedTime?: string;
  nextSteps?: string[];
}

interface PathwayOption {
  id: PathwayType;
  label: string;
  description: string;
  icon: React.ReactNode;
  programs: string[];
  color: string;
}

interface PathwayPriorityProps {
  selectedInterests?: PathwayType[];
  currentHours?: number;
  currentRatings?: string[];
  onInterestChange?: (interests: PathwayType[]) => void;
  onViewProgram?: (program: string) => void;
  onViewTraining?: (trainingId: string) => void;
}

export const PathwayPriority: React.FC<PathwayPriorityProps> = ({
  selectedInterests = [],
  currentHours = 0,
  currentRatings = [],
  onInterestChange,
  onViewProgram,
  onViewTraining,
}) => {
  const [activeTab, setActiveTab] = useState<'interests' | 'roadmap' | 'training'>('interests');
  const [localInterests, setLocalInterests] = useState<PathwayType[]>(selectedInterests);

  const pathwayOptions: PathwayOption[] = [
    {
      id: 'commercial',
      label: 'Commercial Airlines',
      description: 'Legacy and major airlines (United, Delta, American)',
      icon: <Plane className="w-5 h-5" />,
      programs: ['United Aviate', 'Delta Propel', 'American Airlines Cadet'],
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: 'cargo',
      label: 'Cargo Operations',
      description: 'FedEx, UPS, DHL, Atlas Air cargo operations',
      icon: <Briefcase className="w-5 h-5" />,
      programs: ['FedEx Purple Runway', 'UPS FlightPath', 'Atlas Air'],
      color: 'from-purple-500 to-purple-700',
    },
    {
      id: 'corporate',
      label: 'Corporate Aviation',
      description: 'Private jets, business aviation, charter operations',
      icon: <Star className="w-5 h-5" />,
      programs: ['NetJets', 'Flexjet', 'VistaJet'],
      color: 'from-amber-500 to-amber-700',
    },
    {
      id: 'flight_instruction',
      label: 'Flight Instruction',
      description: 'CFI, CFII, MEI pathway',
      icon: <GraduationCap className="w-5 h-5" />,
      programs: ['ATP Flight School', 'FlightSafety International'],
      color: 'from-emerald-500 to-emerald-700',
    },
    {
      id: 'regional',
      label: 'Regional Airlines',
      description: 'Entry-level commercial aviation path',
      icon: <Navigation className="w-5 h-5" />,
      programs: ['Envoy Air', 'SkyWest', 'Republic Airways'],
      color: 'from-cyan-500 to-cyan-700',
    },
    {
      id: 'legacy',
      label: 'Legacy Carriers',
      description: 'Top-tier global airlines (Singapore, Emirates, Qantas)',
      icon: <Award className="w-5 h-5" />,
      programs: ['Singapore Airlines', 'Emirates', 'Qantas'],
      color: 'from-rose-500 to-rose-700',
    },
  ];

  const milestones: Milestone[] = [
    {
      id: 'ppl',
      title: 'Private Pilot License (PPL)',
      description: 'Foundation of your aviation recognition',
      status: currentHours >= 40 ? 'completed' : currentHours > 0 ? 'in_progress' : 'pending',
      requiredHours: 40,
    },
    {
      id: 'instrument',
      title: 'Instrument Rating (IR)',
      description: 'Fly in IFR conditions',
      status: currentRatings.includes('IR') ? 'completed' : currentHours >= 50 ? 'in_progress' : 'locked',
      requiredRating: 'IR',
    },
    {
      id: 'commercial',
      title: 'Commercial Pilot License (CPL)',
      description: 'Get paid to fly',
      status: currentRatings.includes('CPL') ? 'completed' : currentHours >= 250 ? 'in_progress' : 'locked',
      requiredHours: 250,
    },
    {
      id: 'cfi',
      title: 'Certified Flight Instructor (CFI)',
      description: 'Build hours while teaching',
      status: currentRatings.includes('CFI') ? 'completed' : currentRatings.includes('CPL') ? 'in_progress' : 'locked',
      requiredRating: 'CFI',
    },
    {
      id: 'multi',
      title: 'Multi-Engine Rating (ME)',
      description: 'Fly aircraft with multiple engines',
      status: currentRatings.includes('ME') ? 'completed' : currentRatings.includes('CPL') ? 'in_progress' : 'locked',
      requiredRating: 'ME',
    },
    {
      id: 'atpl',
      title: 'Airline Transport Pilot License (ATPL)',
      description: 'Minimum 1500 hours required',
      status: currentRatings.includes('ATPL') ? 'completed' : currentHours >= 1500 ? 'in_progress' : 'locked',
      requiredHours: 1500,
    },
    {
      id: 'type_rating',
      title: 'Type Rating (B737/A320)',
      description: 'Qualify for specific aircraft',
      status: currentRatings.some(r => ['B737', 'A320'].includes(r)) ? 'completed' : currentHours >= 1500 ? 'in_progress' : 'locked',
      requiredRating: 'Type Rating',
    },
    {
      id: 'legacy_carrier',
      title: 'Legacy Carrier Position',
      description: 'Major airline employment',
      status: currentHours >= 1500 && currentRatings.some(r => ['ATPL', 'Type Rating'].includes(r)) ? 'in_progress' : 'locked',
      estimatedTime: '3-5 years total',
    },
  ];

  const trainingStacks: TrainingStack[] = [
    {
      id: 'foreflight',
      name: 'ForeFlight',
      description: 'IFR navigation, flight planning, charts',
      icon: '🗺️',
      recommended: localInterests.includes('commercial') || localInterests.includes('legacy'),
    },
    {
      id: 'planeenglish',
      name: 'PlaneEnglish',
      description: 'Radio communication proficiency',
      icon: '📻',
      recommended: true, // Always recommended
    },
    {
      id: 'garmin',
      name: 'Garmin G1000',
      description: 'Glass cockpit familiarization',
      icon: '📊',
      recommended: localInterests.includes('corporate') || localInterests.includes('legacy'),
    },
    {
      id: 'flightradar',
      name: 'FlightRadar24',
      description: 'Flight tracking, airport monitoring',
      icon: '📡',
      recommended: localInterests.includes('commercial'),
    },
    {
      id: 'boldmethod',
      name: 'BoldMethod',
      description: 'Training articles, quizzes, checklists',
      icon: '📚',
      recommended: true, // Always recommended
    },
    {
      id: 'asa',
      name: 'ASA Test Prep',
      description: 'Written exam preparation',
      icon: '📝',
      recommended: milestones.some(m => m.status === 'in_progress'),
    },
  ];

  const toggleInterest = (interest: PathwayType) => {
    const newInterests = localInterests.includes(interest)
      ? localInterests.filter(i => i !== interest)
      : [...localInterests, interest];
    setLocalInterests(newInterests);
    onInterestChange?.(newInterests);
  };

  const getMilestoneIcon = (status: MilestoneStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'in_progress':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'pending':
        return <Circle className="w-5 h-5 text-slate-500" />;
      case 'locked':
        return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const getMilestoneStyle = (status: MilestoneStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-900/20 border-emerald-700/50';
      case 'in_progress':
        return 'bg-amber-900/20 border-amber-700/50 ring-1 ring-amber-500/30';
      case 'pending':
        return 'bg-slate-700/30 border-slate-600';
      case 'locked':
        return 'bg-slate-800/30 border-slate-700 opacity-60';
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-700/50 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Pathway Priority</h3>
              <p className="text-xs text-slate-400">
                {localInterests.length > 0 
                  ? `${localInterests.length} pathway${localInterests.length > 1 ? 's' : ''} selected`
                  : 'Select your interests for priority listings'
                }
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
            Premium
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-600">
        {[
          { id: 'interests', label: 'Interests', icon: <Target className="w-4 h-4" /> },
          { id: 'roadmap', label: 'Roadmap', icon: <MapPin className="w-4 h-4" /> },
          { id: 'training', label: 'Training', icon: <BookOpen className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-700/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Interests Tab */}
        {activeTab === 'interests' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-3">
              Select your pathway interests to receive priority listings for specific programs:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pathwayOptions.map((pathway) => {
                const isSelected = localInterests.includes(pathway.id);
                return (
                  <button
                    key={pathway.id}
                    onClick={() => toggleInterest(pathway.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? `bg-gradient-to-r ${pathway.color} bg-opacity-10 border-white/30 ring-1 ring-white/20`
                        : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded ${isSelected ? 'bg-white/20' : 'bg-slate-600'} text-white`}>
                        {pathway.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white text-sm">{pathway.label}</p>
                          {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{pathway.description}</p>
                        
                        {isSelected && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {pathway.programs.slice(0, 2).map((program) => (
                              <span
                                key={program}
                                className="text-xs bg-white/10 text-white px-2 py-0.5 rounded"
                              >
                                {program}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {localInterests.length > 0 && onViewProgram && (
              <button
                onClick={() => onViewProgram('priority-listings')}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Priority Listings ({localInterests.length} pathways)
              </button>
            )}
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-white">Your Progress</p>
                <p className="text-xs text-slate-400">
                  {milestones.filter(m => m.status === 'completed').length} of {milestones.length} milestones completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{currentHours}</p>
                <p className="text-xs text-slate-400">Total Hours</p>
              </div>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-600" />

              {/* Milestones */}
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className={`relative pl-10 pr-3 py-3 rounded-lg border ${getMilestoneStyle(milestone.status)}`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-2 top-3.5">
                      {getMilestoneIcon(milestone.status)}
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-white text-sm">{milestone.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{milestone.description}</p>
                        
                        {milestone.status === 'in_progress' && (
                          <p className="text-xs text-amber-400 mt-1">
                            In Progress • {milestone.requiredHours ? `${currentHours}/${milestone.requiredHours} hours` : 'Complete requirements'}
                          </p>
                        )}
                        
                        {milestone.status === 'locked' && (
                          <p className="text-xs text-slate-500 mt-1">
                            🔒 Requires: {milestone.requiredHours ? `${milestone.requiredHours} hours` : milestone.requiredRating}
                          </p>
                        )}
                      </div>

                      {milestone.status === 'in_progress' && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            {milestones.find(m => m.status === 'in_progress')?.nextSteps && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-sm font-medium text-blue-400 mb-2">Recommended Next Steps:</p>
                <ul className="space-y-1">
                  {milestones.find(m => m.status === 'in_progress')?.nextSteps?.map((step, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-blue-400" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-3">
              Recommended training resources based on your pathway:
            </p>

            <div className="space-y-2">
              {trainingStacks.map((stack) => (
                <div
                  key={stack.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    stack.recommended
                      ? 'bg-blue-900/20 border-blue-700/50'
                      : 'bg-slate-700/30 border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stack.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-medium text-sm ${stack.recommended ? 'text-blue-400' : 'text-white'}`}>
                          {stack.name}
                        </p>
                        {stack.recommended && (
                          <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{stack.description}</p>
                    </div>
                  </div>

                  {onViewTraining && (
                    <button
                      onClick={() => onViewTraining(stack.id)}
                      className="px-3 py-1.5 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                    >
                      View
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Stack Builder */}
            <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
              <div className="flex items-start gap-3">
                <Radio className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Custom Training Stack</p>
                  <p className="text-xs text-slate-400">
                    Get personalized training recommendations based on your current progress and goals.
                  </p>
                  <button className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-medium">
                    Build Custom Stack →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PathwayPriority;
