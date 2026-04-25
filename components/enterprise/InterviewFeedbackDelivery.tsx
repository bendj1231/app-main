'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mail, CheckCircle, Clock, Eye, EyeOff,
  FileText, Star, TrendingUp, Target, Download,
  ChevronRight, AlertCircle, Plus, X, ExternalLink
} from 'lucide-react';
import { supabase } from './hooks/useEnterpriseAuth';

interface InterviewFeedbackDeliveryProps {
  interviewId: string;
  pilotProfileId: string;
  pilotName: string;
  pilotEmail: string;
  assessmentId: string;
  onComplete?: () => void;
}

export function InterviewFeedbackDelivery({
  interviewId,
  pilotProfileId,
  pilotName,
  pilotEmail,
  assessmentId,
  onComplete
}: InterviewFeedbackDeliveryProps) {
  const [feedbackData, setFeedbackData] = useState({
    summary: '',
    keyTakeaways: [] as string[],
    recommendedActions: [] as string[],
    resources: [] as { title: string; url: string }[]
  });
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'portal' | 'both'>('both');
  const [isDelivering, setIsDelivering] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load assessment data
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const { data, error } = await supabase
          .from('interview_assessments')
          .select('*')
          .eq('id', assessmentId)
          .single();

        if (error) throw error;
        setAssessment(data);

        // Auto-generate summary from assessment
        if (data) {
          setFeedbackData(prev => ({
            ...prev,
            summary: generateAutoSummary(data),
            keyTakeaways: data.strengths || [],
            recommendedActions: data.areas_for_improvement || []
          }));
        }
      } catch (err) {
        console.error('Error loading assessment:', err);
        setError('Failed to load assessment data.');
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [assessmentId]);

  // Generate auto-summary from assessment
  const generateAutoSummary = (assessment: any) => {
    const grade = assessment.overall_grade;
    const score = assessment.overall_score;
    const recommendation = assessment.recommendation;

    let summary = `Interview Assessment Summary for ${pilotName}\n\n`;
    summary += `Overall Grade: ${grade} (Score: ${score}/100)\n`;
    summary += `Recommendation: ${recommendation.replace(/_/g, ' ').toUpperCase()}\n\n`;
    summary += `This assessment was conducted based on ICAO/EBT-CBTA standards. `;
    summary += `The pilot demonstrated ${grade === 'A' || grade === 'B' ? 'strong' : grade === 'C' ? 'satisfactory' : 'areas needing improvement'} performance across key competency areas.\n\n`;
    summary += `Detailed feedback and recommendations are provided below to support continued professional development.`;

    return summary;
  };

  // Add key takeaway
  const addKeyTakeaway = () => {
    setFeedbackData(prev => ({ ...prev, keyTakeaways: [...prev.keyTakeaways, ''] }));
  };

  const updateKeyTakeaway = (index: number, value: string) => {
    const updated = [...feedbackData.keyTakeaways];
    updated[index] = value;
    setFeedbackData(prev => ({ ...prev, keyTakeaways: updated }));
  };

  const removeKeyTakeaway = (index: number) => {
    setFeedbackData(prev => ({
      ...prev,
      keyTakeaways: prev.keyTakeaways.filter((_, i) => i !== index)
    }));
  };

  // Add recommended action
  const addRecommendedAction = () => {
    setFeedbackData(prev => ({ ...prev, recommendedActions: [...prev.recommendedActions, ''] }));
  };

  const updateRecommendedAction = (index: number, value: string) => {
    const updated = [...feedbackData.recommendedActions];
    updated[index] = value;
    setFeedbackData(prev => ({ ...prev, recommendedActions: updated }));
  };

  const removeRecommendedAction = (index: number) => {
    setFeedbackData(prev => ({
      ...prev,
      recommendedActions: prev.recommendedActions.filter((_, i) => i !== index)
    }));
  };

  // Add resource
  const addResource = () => {
    setFeedbackData(prev => ({
      ...prev,
      resources: [...prev.resources, { title: '', url: '' }]
    }));
  };

  const updateResource = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...feedbackData.resources];
    updated[index] = { ...updated[index], [field]: value };
    setFeedbackData(prev => ({ ...prev, resources: updated }));
  };

  const removeResource = (index: number) => {
    setFeedbackData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  // Deliver feedback
  const deliverFeedback = async () => {
    if (!feedbackData.summary) {
      setError('Please provide a summary before delivering feedback.');
      return;
    }

    setIsDelivering(true);
    setError(null);

    try {
      // Create feedback record
      const feedbackRecord = {
        interview_id: interviewId,
        pilot_profile_id: pilotProfileId,
        feedback_delivered: true,
        delivered_at: new Date().toISOString(),
        delivery_method: deliveryMethod,
        summary: feedbackData.summary,
        key_takeaways: feedbackData.keyTakeaways.filter(t => t.trim()),
        recommended_actions: feedbackData.recommendedActions.filter(a => a.trim()),
        resources: feedbackData.resources.filter(r => r.title && r.url)
      };

      const { data: feedbackDataResult, error: feedbackError } = await supabase
        .from('interview_feedback')
        .insert(feedbackRecord)
        .select()
        .single();

      if (feedbackError) throw feedbackError;

      // If delivery method includes email, send email notification
      if (deliveryMethod === 'email' || deliveryMethod === 'both') {
        await sendEmailNotification(feedbackDataResult);
      }

      setIsDelivered(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
    } catch (err) {
      console.error('Delivery error:', err);
      setError('Failed to deliver feedback. Please try again.');
    } finally {
      setIsDelivering(false);
    }
  };

  // Send email notification (placeholder - integrate with email service)
  const sendEmailNotification = async (feedback: any) => {
    try {
      // Placeholder for email integration
      // This would typically call:
      // - Firebase Cloud Function for email
      // - Resend API
      // - SendGrid API
      // - Supabase Auth email

      console.log('Sending email notification to:', pilotEmail);
      console.log('Feedback ID:', feedback.id);

      // Simulate email send
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Email error:', err);
      throw err;
    }
  };

  // Preview feedback
  const previewFeedback = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Interview Feedback Preview</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
              h1 { color: #1e40af; }
              .grade { font-size: 48px; font-weight: bold; color: ${assessment?.overall_grade === 'A' || assessment?.overall_grade === 'B' ? '#059669' : assessment?.overall_grade === 'C' ? '#d97706' : '#dc2626'}; }
              .section { margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 8px; }
              .takeaway { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #059669; }
              .action { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #d97706; }
              .resource { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #1e40af; }
            </style>
          </head>
          <body>
            <h1>Interview Assessment Feedback</h1>
            <p><strong>Pilot:</strong> ${pilotName}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <div class="section">
              <h2>Overall Grade</h2>
              <div class="grade">${assessment?.overall_grade || 'N/A'}</div>
              <p>Score: ${assessment?.overall_score || 0}/100</p>
            </div>

            <div class="section">
              <h2>Summary</h2>
              <p>${feedbackData.summary.replace(/\n/g, '<br>')}</p>
            </div>

            <div class="section">
              <h2>Key Takeaways</h2>
              ${feedbackData.keyTakeaways.map(t => t ? `<div class="takeaway">${t}</div>` : '').join('')}
            </div>

            <div class="section">
              <h2>Recommended Actions</h2>
              ${feedbackData.recommendedActions.map(a => a ? `<div class="action">${a}</div>` : '').join('')}
            </div>

            <div class="section">
              <h2>Resources</h2>
              ${feedbackData.resources.map(r => r.title && r.url ? `<div class="resource"><a href="${r.url}">${r.title}</a></div>` : '').join('')}
            </div>
          </body>
        </html>
      `);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Send className="w-6 h-6 text-blue-400" />
              Deliver Feedback
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Send interview assessment feedback to <span className="text-white font-medium">{pilotName}</span>
            </p>
          </div>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              Close
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
        {isDelivered && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-emerald-300 text-sm font-medium">Feedback delivered successfully!</p>
              <p className="text-emerald-400/70 text-xs mt-1">
                {deliveryMethod === 'email' && 'Email sent to pilot.'}
                {deliveryMethod === 'portal' && 'Feedback available in pilot portal.'}
                {deliveryMethod === 'both' && 'Email sent and feedback available in portal.'}
              </p>
            </div>
          </div>
        )}

        {/* Assessment Summary Card */}
        {assessment && (
          <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Grade</p>
                <p className={`text-5xl font-bold ${
                  assessment.overall_grade === 'A' || assessment.overall_grade === 'B' ? 'text-emerald-400' :
                  assessment.overall_grade === 'C' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {assessment.overall_grade}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">Overall Score: {assessment.overall_score}/100</p>
                <p className="text-slate-400 text-sm">Recommendation: {assessment.recommendation.replace(/_/g, ' ').toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Recognition Impact</p>
                <p className={`text-2xl font-bold ${assessment.recognition_score_impact > 0 ? 'text-emerald-400' : assessment.recognition_score_impact < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                  {assessment.recognition_score_impact > 0 ? '+' : ''}{assessment.recognition_score_impact}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Feedback Summary
          </h2>
          <textarea
            value={feedbackData.summary}
            onChange={(e) => setFeedbackData({ ...feedbackData, summary: e.target.value })}
            placeholder="Provide a comprehensive summary of the interview assessment..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none resize-none h-40"
          />
          <button
            onClick={previewFeedback}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {/* Key Takeaways */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-emerald-400" />
              Key Takeaways
            </h2>
            <button
              onClick={addKeyTakeaway}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {feedbackData.keyTakeaways.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No key takeaways added yet</p>
            ) : (
              feedbackData.keyTakeaways.map((takeaway, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={takeaway}
                    onChange={(e) => updateKeyTakeaway(index, e.target.value)}
                    placeholder="e.g. Strong situational awareness demonstrated"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => removeKeyTakeaway(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Recommended Actions
            </h2>
            <button
              onClick={addRecommendedAction}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {feedbackData.recommendedActions.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No recommended actions added yet</p>
            ) : (
              feedbackData.recommendedActions.map((action, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => updateRecommendedAction(index, e.target.value)}
                    placeholder="e.g. Complete CRM training course"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => removeRecommendedAction(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resources */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-blue-400" />
              Resources & Training Materials
            </h2>
            <button
              onClick={addResource}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </button>
          </div>
          <div className="space-y-2">
            {feedbackData.resources.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No resources added yet</p>
            ) : (
              feedbackData.resources.map((resource, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={resource.title}
                    onChange={(e) => updateResource(index, 'title', e.target.value)}
                    placeholder="Resource title"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="url"
                    value={resource.url}
                    onChange={(e) => updateResource(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => removeResource(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Delivery Method */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5 text-violet-400" />
            Delivery Method
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setDeliveryMethod('email')}
              className={`p-4 rounded-xl text-sm font-medium transition-all ${
                deliveryMethod === 'email'
                  ? 'bg-blue-600 text-white border-2 border-blue-500'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Mail className="w-5 h-5 mx-auto mb-2" />
              Email Only
            </button>
            <button
              onClick={() => setDeliveryMethod('portal')}
              className={`p-4 rounded-xl text-sm font-medium transition-all ${
                deliveryMethod === 'portal'
                  ? 'bg-blue-600 text-white border-2 border-blue-500'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Eye className="w-5 h-5 mx-auto mb-2" />
              Portal Only
            </button>
            <button
              onClick={() => setDeliveryMethod('both')}
              className={`p-4 rounded-xl text-sm font-medium transition-all ${
                deliveryMethod === 'both'
                  ? 'bg-blue-600 text-white border-2 border-blue-500'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Send className="w-5 h-5 mx-auto mb-2" />
              Both
            </button>
          </div>
          <p className="text-slate-500 text-xs">
            {deliveryMethod === 'email' && 'Feedback will be sent via email to ' + pilotEmail}
            {deliveryMethod === 'portal' && 'Feedback will be available in the pilot\'s portal'}
            {deliveryMethod === 'both' && 'Feedback will be sent via email and available in the pilot\'s portal'}
          </p>
        </div>

        {/* Deliver Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={previewFeedback}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl px-6 py-3 transition-all"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={deliverFeedback}
            disabled={isDelivering || isDelivered}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-3 transition-all"
          >
            {isDelivering ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isDelivered ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Delivered
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Deliver Feedback
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewFeedbackDelivery;
