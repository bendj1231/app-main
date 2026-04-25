'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  History, Calendar, Clock, FileText, Star, TrendingUp,
  Filter, Search, ChevronRight, CheckCircle, Download,
  Eye, Plane, Shield, Award, BarChart3, ArrowUpRight, Video
} from 'lucide-react';
import { supabase } from './hooks/useEnterpriseAuth';

export function InterviewHistoryPage({ user }: { user: any }) {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    averageScore: 0,
    completed: 0,
    pendingFeedback: 0
  });

  // Load interview history
  const loadInterviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          interview_assessments (
            overall_score,
            overall_grade,
            recommendation,
            strengths,
            areas_for_improvement
          ),
          interview_feedback (
            summary,
            key_takeaways,
            recommended_actions,
            feedback_delivered,
            viewed_by_pilot
          )
        `)
        .eq('pilot_profile_id', user.id)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      setInterviews(data || []);

      // Calculate stats
      const completed = data?.filter(i => i.status === 'completed' && i.interview_assessments?.length > 0) || [];
      const totalScore = completed.reduce((sum, i) => sum + (i.interview_assessments?.[0]?.overall_score || 0), 0);
      const avgScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;
      const pendingFeedback = data?.filter(i => i.status === 'completed' && (!i.interview_feedback || !i.interview_feedback.feedback_delivered)).length || 0;

      setStats({
        total: data?.length || 0,
        averageScore: avgScore,
        completed: completed.length,
        pendingFeedback
      });
    } catch (err) {
      console.error('Error loading interview history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, [user.id]);

  // Filter interviews
  const filteredInterviews = interviews.filter(interview => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      interview.interview_type?.toLowerCase().includes(query) ||
      interview.status?.toLowerCase().includes(query)
    );
  });

  // Get grade color
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'B': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'C': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'D': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'F': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-6 h-6 text-blue-400" />
          Interview History
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Track your interview assessments and feedback
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Total Interviews</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
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
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.averageScore}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-violet-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wider">Pending Feedback</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.pendingFeedback}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interviews..."
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
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No interview history yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInterviews.map(interview => (
            <div key={interview.id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-4">
                {/* Interview Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-semibold capitalize">
                      {interview.interview_type || 'Technical Interview'}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(interview.status)}`}>
                      {interview.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleDateString() : 'Not scheduled'}
                    </span>
                    {interview.duration_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {interview.duration_minutes} min
                      </span>
                    )}
                  </div>
                </div>

                {/* Assessment Info */}
                {interview.interview_assessments && interview.interview_assessments.length > 0 && (
                  <div className="text-center px-4">
                    <p className="text-slate-500 text-xs uppercase mb-1">Grade</p>
                    <span className={`text-2xl font-bold px-3 py-1 rounded-lg border ${getGradeColor(interview.interview_assessments[0].overall_grade)}`}>
                      {interview.interview_assessments[0].overall_grade}
                    </span>
                    <p className="text-slate-500 text-xs mt-1">{interview.interview_assessments[0].overall_score}/100</p>
                  </div>
                )}

                {/* Feedback Status */}
                <div className="text-right px-4">
                  {interview.interview_feedback?.feedback_delivered ? (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Feedback Delivered</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Pending</span>
                    </div>
                  )}
                  {interview.interview_feedback?.viewed_by_pilot && (
                    <div className="flex items-center gap-2 text-blue-400 mt-1">
                      <Eye className="w-3 h-3" />
                      <span className="text-xs">Viewed</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <button
                  onClick={() => {
                    setSelectedInterview(interview);
                    setShowDetails(true);
                  }}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-all"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedInterview && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {selectedInterview.interview_type?.replace(/_/g, ' ') || 'Technical Interview'}
                </h2>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedInterview(null);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Assessment Details */}
              {selectedInterview.interview_assessments && selectedInterview.interview_assessments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    Assessment Results
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-slate-500 text-xs uppercase mb-1">Overall Grade</p>
                      <span className={`text-3xl font-bold px-4 py-2 rounded-lg border ${getGradeColor(selectedInterview.interview_assessments[0].overall_grade)}`}>
                        {selectedInterview.interview_assessments[0].overall_grade}
                      </span>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-slate-500 text-xs uppercase mb-1">Score</p>
                      <p className="text-3xl font-bold text-white">
                        {selectedInterview.interview_assessments[0].overall_score}/100
                      </p>
                    </div>
                  </div>

                  {/* Strengths */}
                  {selectedInterview.interview_assessments[0].strengths && selectedInterview.interview_assessments[0].strengths.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Strengths</p>
                      <ul className="space-y-1">
                        {selectedInterview.interview_assessments[0].strengths.map((strength: string, index: number) => (
                          <li key={index} className="text-emerald-400 text-sm flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {selectedInterview.interview_assessments[0].areas_for_improvement && selectedInterview.interview_assessments[0].areas_for_improvement.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Areas for Improvement</p>
                      <ul className="space-y-1">
                        {selectedInterview.interview_assessments[0].areas_for_improvement.map((area: string, index: number) => (
                          <li key={index} className="text-amber-400 text-sm flex items-center gap-2">
                            <ArrowUpRight className="w-3 h-3" />
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Details */}
              {selectedInterview.interview_feedback && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Feedback
                  </h3>
                  {selectedInterview.interview_feedback.summary && (
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-slate-300 text-sm whitespace-pre-wrap">
                        {selectedInterview.interview_feedback.summary}
                      </p>
                    </div>
                  )}
                  {selectedInterview.interview_feedback.key_takeaways && selectedInterview.interview_feedback.key_takeaways.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Key Takeaways</p>
                      <ul className="space-y-1">
                        {selectedInterview.interview_feedback.key_takeaways.map((takeaway: string, index: number) => (
                          <li key={index} className="text-slate-300 text-sm">• {takeaway}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedInterview.interview_feedback.recommended_actions && selectedInterview.interview_feedback.recommended_actions.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Recommended Actions</p>
                      <ul className="space-y-1">
                        {selectedInterview.interview_feedback.recommended_actions.map((action: string, index: number) => (
                          <li key={index} className="text-slate-300 text-sm">• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Recording */}
              {selectedInterview.recording_url && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Video className="w-5 h-5 text-violet-400" />
                    Recording
                  </h3>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <video controls className="w-full rounded-lg" src={selectedInterview.recording_url} />
                  </div>
                </div>
              )}

              {/* Transcription */}
              {selectedInterview.transcription && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Transcription
                  </h3>
                  <div className="bg-slate-800/50 rounded-xl p-4 max-h-48 overflow-y-auto">
                    <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono">
                      {selectedInterview.transcription}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default InterviewHistoryPage;
