'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plane, Shield, CheckCircle, XCircle, Clock, AlertCircle,
  Send, FileText, Star, ChevronRight, Info, Lock,
  ExternalLink, Upload, Download, Eye
} from 'lucide-react';
import { supabase } from './hooks/useEnterpriseAuth';

interface AirbusReviewWorkflowProps {
  interviewId: string;
  assessmentId: string;
  pilotName: string;
  onComplete?: () => void;
}

export function AirbusReviewWorkflow({
  interviewId,
  assessmentId,
  pilotName,
  onComplete
}: AirbusReviewWorkflowProps) {
  const [status, setStatus] = useState<'not_submitted' | 'submitted' | 'under_review' | 'approved' | 'rejected'>('not_submitted');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForReview = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Update interview with Airbus review status
      const { error: updateError } = await supabase
        .from('interviews')
        .update({
          airbus_review_status: 'submitted',
          airbus_review_notes: reviewNotes,
          airbus_reviewed_at: new Date().toISOString()
        })
        .eq('id', interviewId);

      if (updateError) throw updateError;

      setStatus('submitted');
      setIsSubmitted(true);

      // Simulate Airbus review process (placeholder)
      setTimeout(() => {
        setStatus('under_review');
      }, 2000);

    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit for review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Plane className="w-6 h-6 text-violet-400" />
              Airbus Review Workflow
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Submit assessment for Airbus partner review
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

        {/* Partnership Notice */}
        <div className="bg-violet-600/10 border border-violet-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Future Advisory Relationship</h4>
              <p className="text-slate-400 text-xs">
                This workflow is a placeholder for the upcoming Airbus advisory relationship. 
                Selected high-performing pilot assessments may be submitted for Airbus review 
                to validate competency standards and identify candidates for Airbus-aligned programs.
              </p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">Review Status</h2>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              status === 'not_submitted' ? 'bg-slate-700 text-slate-400' :
              status === 'submitted' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' :
              status === 'under_review' ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' :
              status === 'approved' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' :
              'bg-red-600/20 text-red-400 border border-red-500/30'
            }`}>
              {status === 'not_submitted' && <Clock className="w-4 h-4" />}
              {status === 'submitted' && <Send className="w-4 h-4" />}
              {status === 'under_review' && <Eye className="w-4 h-4" />}
              {status === 'approved' && <CheckCircle className="w-4 h-4" />}
              {status === 'rejected' && <XCircle className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Status Progress */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2" />
            <div className="relative flex justify-between">
              {[
                { key: 'not_submitted', label: 'Draft' },
                { key: 'submitted', label: 'Submitted' },
                { key: 'under_review', label: 'Under Review' },
                { key: 'approved', label: 'Approved' }
              ].map((step, index) => {
                const isActive = status === step.key;
                const isPast = ['submitted', 'under_review', 'approved'].includes(status) && 
                               index <= ['submitted', 'under_review', 'approved'].indexOf(status);
                
                return (
                  <div key={step.key} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive || isPast ? 'bg-violet-600' : 'bg-slate-800'
                    }`}>
                      {isActive || isPast ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-2 h-2 bg-slate-600 rounded-full" />
                      )}
                    </div>
                    <span className={`text-xs ${
                      isActive || isPast ? 'text-white' : 'text-slate-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pilot Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Assessment Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Pilot Name</span>
              <span className="text-white text-sm font-medium">{pilotName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Assessment ID</span>
              <span className="text-white text-sm font-mono">{assessmentId.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Interview ID</span>
              <span className="text-white text-sm font-mono">{interviewId.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Review Notes */}
        {status === 'not_submitted' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Review Notes</h2>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add any notes or context for the Airbus review team..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none resize-none h-32"
            />
          </div>
        )}

        {/* Submit Button */}
        {status === 'not_submitted' && (
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={submitForReview}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-3 transition-all"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit for Airbus Review
                </>
              )}
            </button>
          </div>
        )}

        {/* Success Message */}
        {isSubmitted && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-emerald-300 text-sm font-medium">Submitted for Review</p>
              <p className="text-emerald-400/70 text-xs mt-1">
                The assessment has been submitted to the Airbus review team. 
                You will be notified when the review is complete.
              </p>
            </div>
          </div>
        )}

        {/* Under Review Message */}
        {status === 'under_review' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-300 text-sm font-medium">Under Review</p>
              <p className="text-amber-400/70 text-xs mt-1">
                The Airbus review team is currently evaluating this assessment. 
                This process typically takes 3-5 business days.
              </p>
            </div>
          </div>
        )}

        {/* Approved Message */}
        {status === 'approved' && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-emerald-300 text-sm font-medium">Approved by Airbus</p>
              <p className="text-emerald-400/70 text-xs mt-1">
                This assessment has been approved by the Airbus review team. 
                The pilot may be eligible for Airbus-aligned programs.
              </p>
            </div>
          </div>
        )}

        {/* Rejected Message */}
        {status === 'rejected' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-300 text-sm font-medium">Review Not Approved</p>
              <p className="text-red-400/70 text-xs mt-1">
                This assessment did not meet the Airbus review criteria. 
                Please review the feedback and consider additional training or reassessment.
              </p>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm mb-1">Partnership Information</h4>
              <p className="text-slate-400 text-xs">
                The Airbus review workflow is part of our strategic partnership to align pilot competency 
                assessments with Airbus standards. This enables pilots to receive validation from one of the 
                world's leading aircraft manufacturers and access exclusive training opportunities.
              </p>
              <button className="mt-2 text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Learn more about Airbus partnership
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirbusReviewWorkflow;
