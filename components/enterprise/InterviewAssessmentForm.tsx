'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save, Send, FileText, TrendingUp, AlertCircle,
  CheckCircle, Star, Shield, Plane, Clock, Target,
  Users, MessageSquare, Plus, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { supabase } from './hooks/useEnterpriseAuth';

interface InterviewAssessmentFormProps {
  interviewId: string;
  pilotProfileId: string;
  pilotName: string;
  interviewerId: string;
  onComplete?: (assessmentId: string) => void;
  onCancel?: () => void;
}

// Aviation competency areas based on ICAO/EBT-CBTA standards
const COMPETENCY_AREAS = [
  {
    id: 'technical_knowledge',
    label: 'Technical Knowledge',
    description: 'Understanding of aircraft systems, procedures, and regulations',
    icon: Plane,
    weight: 15
  },
  {
    id: 'situational_awareness',
    label: 'Situational Awareness',
    description: 'Perception of environment and anticipation of events',
    icon: Target,
    weight: 15
  },
  {
    id: 'decision_making',
    label: 'Decision Making',
    description: 'Ability to make timely and appropriate decisions',
    icon: TrendingUp,
    weight: 15
  },
  {
    id: 'communication',
    label: 'Communication',
    description: 'Clear and effective verbal and written communication',
    icon: MessageSquare,
    weight: 15
  },
  {
    id: 'teamwork',
    label: 'Teamwork & CRM',
    description: 'Collaboration and crew resource management',
    icon: Users,
    weight: 15
  },
  {
    id: 'professionalism',
    label: 'Professionalism',
    description: 'Professional conduct and attitude',
    icon: Shield,
    weight: 10
  },
  {
    id: 'adaptability',
    label: 'Adaptability',
    description: 'Flexibility in changing situations',
    icon: Clock,
    weight: 10
  },
  {
    id: 'leadership',
    label: 'Leadership',
    description: 'Leadership potential and initiative',
    icon: Star,
    weight: 5
  }
];

const GRADE_OPTIONS = [
  { value: 'A', label: 'A - Exceptional', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'B', label: 'B - Strong', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'C', label: 'C - Satisfactory', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'D', label: 'D - Needs Improvement', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { value: 'F', label: 'F - Unsatisfactory', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
];

const RECOMMENDATION_OPTIONS = [
  { value: 'hire', label: 'Recommend for Hire', color: 'bg-emerald-600' },
  { value: 'consider', label: 'Consider for Future', color: 'bg-blue-600' },
  { value: 'needs_more_assessment', label: 'Needs More Assessment', color: 'bg-amber-600' },
  { value: 'do_not_hire', label: 'Do Not Recommend', color: 'bg-red-600' }
];

export function InterviewAssessmentForm({
  interviewId,
  pilotProfileId,
  pilotName,
  interviewerId,
  onComplete,
  onCancel
}: InterviewAssessmentFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [overallGrade, setOverallGrade] = useState<string>('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [areasForImprovement, setAreasForImprovement] = useState<string[]>([]);
  const [detailedFeedback, setDetailedFeedback] = useState('');
  const [recommendation, setRecommendation] = useState<string>('');
  const [recognitionScoreImpact, setRecognitionScoreImpact] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Calculate overall score based on weighted competency areas
  const calculateOverallScore = () => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    COMPETENCY_AREAS.forEach(area => {
      const score = scores[area.id] || 0;
      totalWeightedScore += score * area.weight;
      totalWeight += area.weight;
    });

    return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  };

  const overallScore = calculateOverallScore();

  // Auto-grade based on overall score
  React.useEffect(() => {
    if (overallScore >= 90) setOverallGrade('A');
    else if (overallScore >= 80) setOverallGrade('B');
    else if (overallScore >= 70) setOverallGrade('C');
    else if (overallScore >= 60) setOverallGrade('D');
    else if (overallScore > 0) setOverallGrade('F');
  }, [overallScore]);

  // Add strength
  const addStrength = () => {
    setStrengths([...strengths, '']);
  };

  const updateStrength = (index: number, value: string) => {
    const updated = [...strengths];
    updated[index] = value;
    setStrengths(updated);
  };

  const removeStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index));
  };

  // Add area for improvement
  const addAreaForImprovement = () => {
    setAreasForImprovement([...areasForImprovement, '']);
  };

  const updateAreaForImprovement = (index: number, value: string) => {
    const updated = [...areasForImprovement];
    updated[index] = value;
    setAreasForImprovement(updated);
  };

  const removeAreaForImprovement = (index: number) => {
    setAreasForImprovement(areasForImprovement.filter((_, i) => i !== index));
  };

  // Save assessment
  const saveAssessment = async (applyToRecognitionScore: boolean = false) => {
    if (!overallGrade || !recommendation) {
      setError('Please select an overall grade and recommendation.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const assessmentData = {
        interview_id: interviewId,
        interviewer_id: interviewerId,
        overall_score: overallScore,
        overall_grade: overallGrade,
        
        // Competency scores
        technical_knowledge_score: scores.technical_knowledge || 0,
        situational_awareness_score: scores.situational_awareness || 0,
        decision_making_score: scores.decision_making || 0,
        communication_score: scores.communication || 0,
        teamwork_score: scores.teamwork || 0,
        crm_score: scores.teamwork || 0, // Same as teamwork
        professionalism_score: scores.professionalism || 0,
        adaptability_score: scores.adaptability || 0,
        leadership_score: scores.leadership || 0,
        
        // Additional scores (can be expanded later)
        emergency_procedures_score: 0,
        instrument_procedures_score: 0,
        weather_interpretation_score: 0,
        
        // Feedback
        strengths: strengths.filter(s => s.trim()),
        areas_for_improvement: areasForImprovement.filter(s => s.trim()),
        detailed_feedback: detailedFeedback,
        recommendation: recommendation,
        
        // Recognition score integration
        recognition_score_impact: recognitionScoreImpact,
        applied_to_recognition_score: applyToRecognitionScore,
        applied_at: applyToRecognitionScore ? new Date().toISOString() : null
      };

      const { data, error: insertError } = await supabase
        .from('interview_assessments')
        .insert(assessmentData)
        .select()
        .single();

      if (insertError) throw insertError;

      // Update interview status to completed
      await supabase
        .from('interviews')
        .update({ status: 'completed' })
        .eq('id', interviewId);

      // If applying to recognition score, update pilot's recognition score
      if (applyToRecognitionScore) {
        await applyRecognitionScoreUpdate(pilotProfileId, recognitionScoreImpact);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      if (onComplete) {
        onComplete(data.id);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save assessment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Apply recognition score update
  const applyRecognitionScoreUpdate = async (pilotId: string, impact: number) => {
    try {
      // Get current recognition score
      const { data: currentScore } = await supabase
        .from('recognition_scores')
        .select('total_score')
        .eq('user_id', pilotId)
        .single();

      if (currentScore) {
        const newScore = Math.min(1000, Math.max(0, currentScore.total_score + impact));
        
        await supabase
          .from('recognition_scores')
          .update({
            total_score: newScore,
            last_calculated_at: new Date().toISOString()
          })
          .eq('user_id', pilotId);

        // Also update interview_score in profiles
        await supabase
          .from('profiles')
          .update({ interview_score: newScore })
          .eq('id', pilotId);
      }
    } catch (err) {
      console.error('Recognition score update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              Interview Assessment
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Assess pilot: <span className="text-white font-medium">{pilotName}</span>
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {saved && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-emerald-300 text-sm">Assessment saved successfully!</p>
          </div>
        )}

        {/* Overall Score Summary */}
        <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Overall Score</p>
              <p className="text-4xl font-bold text-white">{overallScore}</p>
              <p className="text-slate-500 text-xs mt-1">out of 100</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Grade</p>
              <select
                value={overallGrade}
                onChange={(e) => setOverallGrade(e.target.value)}
                className="text-2xl font-bold bg-transparent border-b-2 border-slate-700 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select Grade</option>
                {GRADE_OPTIONS.map(g => (
                  <option key={g.value} value={g.value}>{g.value}</option>
                ))}
              </select>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Recognition Impact</p>
              <input
                type="number"
                value={recognitionScoreImpact}
                onChange={(e) => setRecognitionScoreImpact(Number(e.target.value))}
                className="text-2xl font-bold bg-transparent border-b-2 border-slate-700 text-white w-24 text-center focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
              <p className="text-slate-500 text-xs mt-1">points</p>
            </div>
          </div>
        </div>

        {/* Competency Areas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Competency Assessment
          </h2>
          <p className="text-slate-400 text-sm">
            Rate each competency area based on ICAO/EBT-CBTA standards (0-100)
          </p>

          <div className="space-y-3">
            {COMPETENCY_AREAS.map(area => (
              <div key={area.id} className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <area.icon className="w-4 h-4 text-blue-400" />
                      <h3 className="text-white font-medium">{area.label}</h3>
                      <span className="text-slate-500 text-xs">({area.weight}%)</span>
                    </div>
                    <p className="text-slate-500 text-xs">{area.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scores[area.id] || ''}
                      onChange={(e) => setScores({ ...scores, [area.id]: Number(e.target.value) })}
                      className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                    <span className="text-slate-500 text-sm">/100</span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${scores[area.id] || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-emerald-400" />
              Strengths
            </h2>
            <button
              onClick={addStrength}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {strengths.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No strengths added yet</p>
            ) : (
              strengths.map((strength, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={strength}
                    onChange={(e) => updateStrength(index, e.target.value)}
                    placeholder="e.g. Excellent situational awareness during emergency scenarios"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => removeStrength(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Areas for Improvement
            </h2>
            <button
              onClick={addAreaForImprovement}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {areasForImprovement.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No areas for improvement added yet</p>
            ) : (
              areasForImprovement.map((area, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => updateAreaForImprovement(index, e.target.value)}
                    placeholder="e.g. Improve communication under high workload"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => removeAreaForImprovement(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Detailed Feedback
          </h2>
          <textarea
            value={detailedFeedback}
            onChange={(e) => setDetailedFeedback(e.target.value)}
            placeholder="Provide comprehensive feedback for the pilot. This will be shared with the pilot after review..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none resize-none h-32"
          />
        </div>

        {/* Recommendation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            Recommendation
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {RECOMMENDATION_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => setRecommendation(option.value)}
                className={`p-4 rounded-xl text-sm font-medium transition-all ${
                  recommendation === option.value
                    ? `${option.color} text-white border-2 border-white/30`
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => saveAssessment(false)}
            disabled={saving}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-3 transition-all"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Draft
          </button>
          <button
            onClick={() => saveAssessment(true)}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-3 transition-all"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Save & Apply to Recognition Score
              </>
            )}
          </button>
        </div>

        {/* Recognition Score Info */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Recognition Score Integration</h4>
              <p className="text-slate-400 text-xs">
                Applying this assessment to the pilot's Recognition Score will immediately update their score by the specified impact amount.
                This helps pilots see the direct value of completing interviews and assessments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewAssessmentForm;
