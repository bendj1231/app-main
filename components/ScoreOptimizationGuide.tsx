/**
 * ScoreOptimizationGuide Component
 * 
 * Provides personalized recommendations for improving recognition score
 * Integrated with AI-powered score maintenance advice system
 */

import React, { useState, useEffect } from 'react';
import { ScoreBreakdown, PilotScoreInput } from '../lib/pilot-recognition-score';
import { Lock, Crown, Brain, TrendingUp, Target } from 'lucide-react';

interface ScoreOptimizationGuideProps {
  currentScore: ScoreBreakdown | null;
  onApplyChanges?: (updates: Partial<PilotScoreInput>) => void;
  isPremium?: boolean;
  userId?: string;
  limit?: number;
  onViewAll?: () => void;
  onNavigate?: (page: string) => void;
}

interface OptimizationTip {
  category: 'hours' | 'experience' | 'assessments' | 'mentorship';
  title: string;
  description: string;
  potentialGain: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: string;
  actionable: boolean;
}

export const ScoreOptimizationGuide: React.FC<ScoreOptimizationGuideProps> = ({
  currentScore,
  onApplyChanges,
  isPremium = false,
  userId,
  limit = 3,
  onViewAll,
  onNavigate,
}) => {
  // Debug logging
// [AUDIT] Removed console.log // line 42
  
  // Track isPremium changes
  useEffect(() => {
// [AUDIT] Removed console.log // line 46
  }, [isPremium]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showAiSection, setShowAiSection] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch AI-powered score maintenance advice for premium users
  useEffect(() => {
    if (isPremium && userId && currentScore) {
      fetchAiAdvice();
    }
  }, [isPremium, userId, currentScore]);

  const fetchAiAdvice = async () => {
    if (!currentScore) return;
    setLoadingAi(true);
    try {
      const response = await fetch('/api/score/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilotId: userId,
          currentScore: currentScore.totalScore,
          targetScore: Math.min(currentScore.totalScore + 10, 100),
          components: calculateScoreComponents(currentScore),
          profile: { totalFlightHours: currentScore.breakdown.totalHours }
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAiAdvice(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch AI advice:', error);
    } finally {
      setLoadingAi(false);
    }
  };

  const calculateScoreComponents = (score: ScoreBreakdown) => {
    return {
      flightHours: Math.min(100, (score.breakdown.totalHours / 250) * 100),
      licenses: Math.min(100, (score.breakdown.licensesCount / 5) * 100),
      certifications: Math.min(100, (score.breakdown.achievementsCount / 10) * 100),
      experience: Math.min(100, (score.breakdown.experienceYears / 5) * 100),
      education: Math.min(100, score.breakdown.programCompletion),
      networking: Math.min(100, (score.breakdown.mentorshipHours / 20) * 100),
      achievements: Math.min(100, (score.breakdown.achievementsCount / 10) * 100)
    };
  };

  if (!currentScore) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Load your score to see optimization tips</p>
      </div>
    );
  }

  // Premium gating for advanced features
  const showAdvancedTips = isPremium;

  // Generate optimization tips based on current score
  const generateTips = (): OptimizationTip[] => {
    const tips: OptimizationTip[] = [];
    const { breakdown } = currentScore;

    // Hours tips
    if (breakdown.totalHours < 250) {
      tips.push({
        category: 'hours',
        title: 'Build Flight Hours to 250',
        description: `You currently have ${breakdown.totalHours} hours. Reaching 250 hours will significantly boost your score with linear scaling up to this milestone.`,
        potentialGain: Math.round(Math.min((250 - breakdown.totalHours) / 250 * 10, 10) * 10) / 10,
        difficulty: 'medium',
        timeEstimate: '3-6 months',
        actionable: true,
      });
    }

    if (breakdown.picHours / Math.max(breakdown.totalHours, 1) < 0.5) {
      tips.push({
        category: 'hours',
        title: 'Increase PIC Ratio',
        description: `Your PIC ratio is ${(breakdown.picHours / Math.max(breakdown.totalHours, 1) * 100).toFixed(1)}%. Flying more as Pilot-in-Command will improve your score significantly.`,
        potentialGain: 2.5,
        difficulty: 'medium',
        timeEstimate: '2-4 months',
        actionable: true,
      });
    }

    if (breakdown.ifrHours < 50) {
      tips.push({
        category: 'hours',
        title: 'Gain IFR Experience',
        description: `You have ${breakdown.ifrHours} IFR hours. Building to 50+ IFR hours will demonstrate instrument proficiency and add points.`,
        potentialGain: Math.round(Math.min((50 - breakdown.ifrHours) / 50 * 5, 5) * 10) / 10,
        difficulty: 'hard',
        timeEstimate: '2-3 months',
        actionable: true,
      });
    }

    // Experience tips
    if (breakdown.experienceYears < 3) {
      tips.push({
        category: 'experience',
        title: 'Continue Building Experience',
        description: `With ${breakdown.experienceYears} years of experience, each additional year adds significant points. Focus on consistent flight activity.`,
        potentialGain: Math.round(Math.min((3 - breakdown.experienceYears) * 1, 3) * 10) / 10,
        difficulty: 'easy',
        timeEstimate: '1-3 years',
        actionable: false,
      });
    }

    if (breakdown.achievementsCount < 5) {
      tips.push({
        category: 'experience',
        title: 'Pursue Additional Achievements',
        description: `You have ${breakdown.achievementsCount} achievements. Each achievement adds up to 3 points. Consider certifications, awards, or special training.`,
        potentialGain: Math.round(Math.min((5 - breakdown.achievementsCount) * 1, 5) * 10) / 10,
        difficulty: 'medium',
        timeEstimate: '1-6 months',
        actionable: true,
      });
    }

    if (breakdown.licensesCount < 3) {
      tips.push({
        category: 'experience',
        title: 'Obtain Additional Licenses',
        description: `You have ${breakdown.licensesCount} licenses. Additional licenses or type ratings add up to 5 points each.`,
        potentialGain: Math.round(Math.min((3 - breakdown.licensesCount) * 1.5, 4.5) * 10) / 10,
        difficulty: 'hard',
        timeEstimate: '3-12 months',
        actionable: true,
      });
    }

    // Assessment tips
    if (breakdown.programCompletion < 100) {
      tips.push({
        category: 'assessments',
        title: 'Complete Program Modules',
        description: `Your program completion is ${breakdown.programCompletion}%. Completing all modules will maximize your assessment score.`,
        potentialGain: Math.round(((100 - breakdown.programCompletion) / 100) * 12.5 * 10) / 10,
        difficulty: 'easy',
        timeEstimate: '1-3 months',
        actionable: true,
      });
    }

    if (breakdown.performanceScore < 80) {
      tips.push({
        category: 'assessments',
        title: 'Improve Assessment Performance',
        description: `Your performance score is ${breakdown.performanceScore}. Focus on excelling in assessments to reach 80+ for optimal points.`,
        potentialGain: Math.round(Math.min((80 - breakdown.performanceScore) / 100 * 12.5, 5) * 10) / 10,
        difficulty: 'medium',
        timeEstimate: '1-2 months',
        actionable: true,
      });
    }

    // Mentorship tips
    if (breakdown.mentorshipHours < 10) {
      tips.push({
        category: 'mentorship',
        title: 'Engage in Mentorship Activities',
        description: `You have ${breakdown.mentorshipHours} mentorship hours. Active participation in mentorship programs builds leadership skills and adds points.`,
        potentialGain: Math.round(Math.min((10 - breakdown.mentorshipHours) / 10 * 2, 2) * 10) / 10,
        difficulty: 'easy',
        timeEstimate: '1-2 months',
        actionable: true,
      });
    }

    if (breakdown.mentorshipObservations < 10) {
      tips.push({
        category: 'mentorship',
        title: 'Participate in Observation Sessions',
        description: `You have ${breakdown.mentorshipObservations} observations. Regular observation sessions enhance learning and add points.`,
        potentialGain: Math.round(Math.min((10 - breakdown.mentorshipObservations) / 10 * 1.5, 1.5) * 10) / 10,
        difficulty: 'easy',
        timeEstimate: '1-2 months',
        actionable: true,
      });
    }

    if (breakdown.mentorshipCases < 5) {
      tips.push({
        category: 'mentorship',
        title: 'Take on Mentorship Cases',
        description: `You have handled ${breakdown.mentorshipCases} cases. Taking on more cases demonstrates leadership and adds points.`,
        potentialGain: Math.round(Math.min((5 - breakdown.mentorshipCases) / 5 * 1.2, 1.2) * 10) / 10,
        difficulty: 'medium',
        timeEstimate: '2-4 months',
        actionable: true,
      });
    }

    // Sort by potential gain
    return tips.sort((a, b) => b.potentialGain - a.potentialGain);
  };

  const tips = generateTips();
  const filteredTips =
    selectedCategory === 'all'
      ? tips
      : tips.filter((tip) => tip.category === selectedCategory);
  
  const displayTips = limit ? filteredTips.slice(0, limit) : filteredTips;

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayTips.length]);

  // Reset index when tips change
  useEffect(() => {
    setCurrentIndex(0);
  }, [displayTips.length]);

  const categoryColors = {
    hours: 'bg-blue-100 text-blue-800',
    experience: 'bg-purple-100 text-purple-800',
    assessments: 'bg-green-100 text-green-800',
    mentorship: 'bg-orange-100 text-orange-800',
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const totalPotentialGain = Math.round(tips.reduce((sum, tip) => sum + tip.potentialGain, 0) * 10) / 10;
  const currentScoreValue = currentScore.totalScore; // Already 0-100
  const projectedScore = Math.min(Math.round((currentScoreValue + totalPotentialGain) * 10) / 10, 100);
  const actualPotentialGain = Math.round((projectedScore - currentScoreValue) * 10) / 10;

  // Calculate progression trend based on score components
  const calculateProgressionTrend = () => {
    // Score components are now on smaller scales (hours max 35, exp max 25, assessments max 25)
    const progressionScore = currentScore.experienceScore + currentScore.hoursScore + currentScore.assessmentScore;
    
    // Simple trend calculation based on score components (adjusted for /100 scale)
    const trend = currentScore.experienceScore > 5 && currentScore.hoursScore > 10 ? 'up' :
                  currentScore.hoursScore < 3 ? 'down' : 'stable';
    
    // Calculate percentage change for stock market style display
    const maxPossible = 85; // 35 + 25 + 25
    const progressionPercent = Math.round((progressionScore / maxPossible) * 100);
    const changePercent = trend === 'up' ? Math.round(progressionPercent * 0.15) :
                         trend === 'down' ? -Math.round(progressionPercent * 0.1) : 0;
    
    return { trend, score: Math.round(progressionScore * 10) / 10, changePercent };
  };

  const { trend, score: progressionScore, changePercent } = calculateProgressionTrend();
  const trendColor = changePercent > 0 ? 'green' : 'red';
  const trendSign = changePercent > 0 ? '+' : '';

  return (
    <div className="bg-slate-800/80 rounded-lg shadow-lg p-6 space-y-6 border border-slate-700 backdrop-blur-sm">
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Current Score</p>
          <p className="text-2xl font-bold text-white flex items-center gap-2">
            {currentScoreValue} <span className="text-slate-500 text-lg font-normal">/ 100</span>
            {currentScoreValue === 0 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
          </p>
          <p className="text-xs text-slate-500 mt-1">{currentScoreValue === 0 ? 'Calculated on credential verification' : 'out of 100'}</p>
        </div>
        <div className="bg-emerald-900/30 rounded-lg p-4 border border-emerald-700">
          <p className="text-xs text-emerald-400 uppercase tracking-wide mb-1">Projected Score</p>
          <p className="text-2xl font-bold text-emerald-400">{projectedScore}</p>
          <p className="text-xs text-emerald-500 mt-1">↑ {actualPotentialGain} pts gain</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Potential Gain</p>
          <p className="text-2xl font-bold text-white">+{totalPotentialGain}</p>
          <p className="text-xs text-slate-500 mt-1">If all tips completed</p>
        </div>
        <div className={`${trendColor === 'green' ? 'bg-emerald-900/30 border-emerald-700' : 'bg-slate-700/50 border-slate-600'} rounded-lg p-4 border`}>
          <p className={`text-xs ${trendColor === 'green' ? 'text-emerald-400' : 'text-slate-400'} uppercase tracking-wide mb-1`}>Current Progression</p>
          <p className={`text-2xl font-bold ${trendColor === 'green' ? 'text-emerald-400' : 'text-white'}`}>{trendSign}{changePercent}%</p>
          <p className={`text-xs ${trendColor === 'green' ? 'text-emerald-500' : 'text-slate-400'} mt-1`}>{trend === 'up' ? 'Trending up' : changePercent === 0 ? 'Complete profile verification to begin tracking' : 'Trending down'}</p>
        </div>
      </div>

      {/* Learn More Link */}
      <div className="text-center">
        <button
          onClick={() => onNavigate?.('recognition-score-info')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
        >
          Learn more about recognition score
        </button>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          style={selectedCategory === 'all' ? { background: 'linear-gradient(135deg,#e53e3e,#9b1c1c)' } : {}}
        >
          All ({tips.length})
        </button>
        <button
          onClick={() => setSelectedCategory('hours')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'hours'
              ? 'text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          style={selectedCategory === 'hours' ? { background: 'linear-gradient(135deg,#e53e3e,#9b1c1c)' } : {}}
        >
          Hours ({tips.filter((t) => t.category === 'hours').length})
        </button>
        <button
          onClick={() => setSelectedCategory('experience')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'experience'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Experience ({tips.filter((t) => t.category === 'experience').length})
        </button>
        <button
          onClick={() => setSelectedCategory('assessments')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'assessments'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Assessments ({tips.filter((t) => t.category === 'assessments').length})
        </button>
        <button
          onClick={() => setSelectedCategory('mentorship')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'mentorship'
              ? 'bg-orange-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Mentorship ({tips.filter((t) => t.category === 'mentorship').length})
        </button>
      </div>

      {/* Tips List - Auto Carousel */}
      <div className="relative">
        {displayTips.length > 0 && (
          <>
            <div 
              className={`border border-slate-600 rounded-lg p-6 hover:border-blue-500 transition-colors bg-slate-700/50 shadow-md ${
                !isPremium ? 'blur-sm opacity-60' : ''
              }`}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${
                    displayTips[currentIndex].difficulty === 'easy'
                      ? 'bg-emerald-900/50 text-emerald-400'
                      : displayTips[currentIndex].difficulty === 'medium'
                      ? 'bg-amber-900/50 text-amber-400'
                      : 'bg-red-900/50 text-red-400'
                  }`}>
                    {displayTips[currentIndex].difficulty}
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">+{Math.round(displayTips[currentIndex].potentialGain)} pts</span>
                </div>
                <span className="text-sm text-slate-400">{displayTips[currentIndex].timeEstimate}</span>
              </div>
              <h3 className="font-semibold text-white mb-2 text-lg">{displayTips[currentIndex].title}</h3>
              <p className="text-sm text-slate-300 mb-4">{displayTips[currentIndex].description}</p>
              <button
                onClick={() => setExpandedTip(expandedTip === currentIndex ? null : currentIndex)}
                className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium py-2 border border-blue-600 rounded-lg hover:bg-blue-900/30 transition-colors"
                disabled={!isPremium && !displayTips[currentIndex].actionable}
              >
                {expandedTip === currentIndex ? 'Collapse' : 'Expand'}
              </button>
              {expandedTip === currentIndex && (
                <div className="mt-4 p-4 bg-slate-800/50 border-t border-slate-600 rounded-lg">
                  {isPremium ? (
                    <>
                      <p className="text-slate-300 mb-4">{displayTips[currentIndex].description}</p>
                      <p className="text-sm text-slate-400 mb-3">
                        Detailed steps to achieve this improvement:
                      </p>
                      <ul className="text-sm text-slate-400 space-y-1">
                        <li>• Review current progress in this area</li>
                        <li>• Set specific goals and timeline</li>
                        <li>• Track completion and log activities</li>
                        <li>• Monitor score improvement over time</li>
                      </ul>
                      {displayTips[currentIndex].actionable && onApplyChanges && (
                        <button
                          onClick={() => {
// [AUDIT] Removed console.log // line 463
                          }}
                          className="mt-4 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
                          style={{ background: 'linear-gradient(135deg,#e53e3e,#9b1c1c)', boxShadow: '0 2px 10px rgba(229,62,62,0.3)' }}
                        >
                          Get Started
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-amber-900/30 rounded-lg border border-amber-700">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <p className="text-sm text-amber-400">
                        Upgrade to Premium to access detailed optimization steps and personalized action plans
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Upgrade Overlay for Non-Members */}
            {!isPremium && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg" style={{ background: 'rgba(15,22,36,0.88)', backdropFilter: 'blur(6px)' }}>
                <div className="text-center p-6 max-w-md">
                  <h3 className="text-xl font-bold text-white mb-2">Unlock Career Progression Metrics & Priority Recognition</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    Subscribe to Recognition + to unlock advanced career progression analytics, personalized optimization strategies, and get priority placement when airlines demand pilots with your profile.
                  </p>
                  <button
                    className="text-white px-6 py-3 rounded-lg font-bold transition-all"
                    style={{ background: 'linear-gradient(135deg,#e53e3e,#9b1c1c)', boxShadow: '0 4px 15px rgba(229,62,62,0.35)', letterSpacing: '0.04em' }}
                    onClick={() => console.log('Navigate to membership upgrade')}
                  >
                    Upgrade to Recognition+
                  </button>
                </div>
              </div>
            )}
            
            {/* Carousel Indicators */}
            {isPremium && (
              <div className="flex justify-center gap-2 mt-4">
                {displayTips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                    aria-label={`Go to tip ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* View All Button */}
      {limit && filteredTips.length > limit && onViewAll && (
        <button
          onClick={onViewAll}
          className="w-full text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          style={{ background: '#1e293b', border: '1px solid rgba(229,62,62,0.4)', letterSpacing: '0.04em' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(229,62,62,0.7)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(229,62,62,0.4)'; }}
        >
          View All {filteredTips.length} Optimization Tips
        </button>
      )}

      {filteredTips.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-medium text-white">Great job!</p>
          <p className="text-sm text-slate-300">You're maximizing your score in this category.</p>
        </div>
      )}
    </div>
  );
};
