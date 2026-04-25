'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Video, FileText, Users, TrendingUp,
  Plus, Filter, Search, ChevronRight, CheckCircle, XCircle,
  AlertCircle, Star, Shield, Plane, Play, Pause, MoreVertical,
  Download, Mail, Send, Eye, Settings, RefreshCw
} from 'lucide-react';
import { supabase } from './hooks/useEnterpriseAuth';
import { InterviewRecordingPage } from './InterviewRecordingPage';
import { InterviewAssessmentForm } from './InterviewAssessmentForm';
import { InterviewFeedbackDelivery } from './InterviewFeedbackDelivery';

type Tab = 'scheduled' | 'in-progress' | 'completed' | 'all';

export function InterviewerDashboard({ user, account }: { user: any; account: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('scheduled');
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [showRecording, setShowRecording] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stats, setStats] = useState({
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    total: 0
  });

  // Load interviews
  const loadInterviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          profiles:pilot_profile_id (display_name, email, total_flight_hours, overall_recognition_score),
          interview_assessments (id, overall_score, overall_grade, recommendation)
        `)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setInterviews(data || []);

      // Calculate stats
      const stats = {
        scheduled: data?.filter(i => i.status === 'scheduled').length || 0,
        inProgress: data?.filter(i => i.status === 'in_progress').length || 0,
        completed: data?.filter(i => i.status === 'completed').length || 0,
        total: data?.length || 0
      };
      setStats(stats);
    } catch (err) {
      console.error('Error loading interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  // Filter interviews based on tab and search
  const filteredInterviews = interviews.filter(interview => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'scheduled' && interview.status === 'scheduled') ||
      (activeTab === 'in-progress' && interview.status === 'in_progress') ||
      (activeTab === 'completed' && interview.status === 'completed');
    
    const matchesSearch = !searchQuery || 
      interview.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Start interview
  const startInterview = (interview: any) => {
    setSelectedInterview(interview);
    setShowRecording(true);
  };

  // Complete recording and go to assessment
  const handleRecordingComplete = (recordingUrl: string, transcription: string) => {
    setShowRecording(false);
    setShowAssessment(true);
  };

  // Complete assessment and go to feedback
  const handleAssessmentComplete = (assessmentId: string) => {
    setShowAssessment(false);
    setShowFeedback(true);
  };

  // Handle feedback complete
  const handleFeedbackComplete = () => {
    setShowFeedback(false);
    setSelectedInterview(null);
    loadInterviews();
  };

  // Update interview status
  const updateInterviewStatus = async (interviewId: string, status: string) => {
    try {
      await supabase
        .from('interviews')
        .update({ 
          status,
          started_at: status === 'in_progress' ? new Date().toISOString() : undefined,
          completed_at: status === 'completed' ? new Date().toISOString() : undefined
        })
        .eq('id', interviewId);
      loadInterviews();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'no_show': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'no_show': return 'No Show';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-blue-400" />
            Interview Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage pilot interviews, assessments, and feedback
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadInterviews}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-all">
            <Plus className="w-4 h-4" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.scheduled}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.completed}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-violet-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-4">
        {(['scheduled', 'in-progress', 'completed', 'all'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab === 'all' ? 'All Interviews' : tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pilot name or email..."
            className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-4 py-2.5 text-sm transition-all">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Interview List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
          <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No interviews found</p>
          <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
            Schedule your first interview
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInterviews.map(interview => (
            <div key={interview.id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-4">
                {/* Pilot Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-semibold truncate">
                      {interview.profiles?.display_name || 'Unknown Pilot'}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(interview.status)}`}>
                      {getStatusLabel(interview.status)}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">{interview.profiles?.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleString() : 'Not scheduled'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane className="w-3 h-3" />
                      {interview.profiles?.total_flight_hours || 0}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Score: {interview.profiles?.overall_recognition_score || 0}
                    </span>
                  </div>
                </div>

                {/* Assessment Info */}
                {interview.interview_assessments && interview.interview_assessments.length > 0 && (
                  <div className="text-right px-4">
                    <p className="text-slate-500 text-xs uppercase mb-1">Assessment</p>
                    <p className={`text-2xl font-bold ${
                      interview.interview_assessments[0].overall_grade === 'A' || interview.interview_assessments[0].overall_grade === 'B' ? 'text-emerald-400' :
                      interview.interview_assessments[0].overall_grade === 'C' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {interview.interview_assessments[0].overall_grade || 'N/A'}
                    </p>
                    <p className="text-slate-500 text-xs">{interview.interview_assessments[0].overall_score || 0}/100</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {interview.status === 'scheduled' && (
                    <button
                      onClick={() => startInterview(interview)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all"
                    >
                      <Play className="w-3 h-3" />
                      Start
                    </button>
                  )}
                  {interview.status === 'in_progress' && (
                    <button
                      onClick={() => startInterview(interview)}
                      className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all"
                    >
                      <Video className="w-3 h-3" />
                      Continue
                    </button>
                  )}
                  {interview.status === 'completed' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedInterview(interview);
                          setShowAssessment(true);
                        }}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                        title="View Assessment"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {interview.interview_assessments?.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedInterview(interview);
                            setShowFeedback(true);
                          }}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                          title="Send Feedback"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

                {/* Airbus Review Status */}
                {interview.airbus_review_status && interview.airbus_review_status !== 'not_submitted' && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-xs">
                      <Plane className="w-3 h-3 text-violet-400" />
                      <span className="text-slate-400">Airbus Review:</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        interview.airbus_review_status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        interview.airbus_review_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        interview.airbus_review_status === 'under_review' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {interview.airbus_review_status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showRecording && selectedInterview && (
          <div className="fixed inset-0 bg-slate-950 z-50">
            <InterviewRecordingPage
              interviewId={selectedInterview.id}
              pilotProfileId={selectedInterview.pilot_profile_id}
              onComplete={handleRecordingComplete}
              onCancel={() => {
                setShowRecording(false);
                setSelectedInterview(null);
              }}
            />
          </div>
        )}

        {showAssessment && selectedInterview && (
          <div className="fixed inset-0 bg-slate-950 z-50">
            <InterviewAssessmentForm
              interviewId={selectedInterview.id}
              pilotProfileId={selectedInterview.pilot_profile_id}
              pilotName={selectedInterview.profiles?.display_name || 'Unknown'}
              interviewerId={user.id}
              onComplete={handleAssessmentComplete}
              onCancel={() => {
                setShowAssessment(false);
                setSelectedInterview(null);
              }}
            />
          </div>
        )}

        {showFeedback && selectedInterview && (
          <div className="fixed inset-0 bg-slate-950 z-50">
            <InterviewFeedbackDelivery
              interviewId={selectedInterview.id}
              pilotProfileId={selectedInterview.pilot_profile_id}
              pilotName={selectedInterview.profiles?.display_name || 'Unknown'}
              pilotEmail={selectedInterview.profiles?.email || ''}
              assessmentId={selectedInterview.interview_assessments?.[0]?.id || ''}
              onComplete={handleFeedbackComplete}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InterviewerDashboard;
