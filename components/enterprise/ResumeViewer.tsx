import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Eye, Clock, Plane, Award, MapPin, Mail, Phone, Calendar, GraduationCap, Briefcase, Shield, ChevronDown, ChevronUp, FileText, Send } from 'lucide-react';
import { supabase } from '../../shared/lib/supabase';

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  enterpriseAccountId: string;
}

interface ApplicationData {
  id: string;
  resume_id: string;
  user_id: string;
  airline_id: string;
  airline_name: string;
  status: string;
  application_status: string;
  applied_at: string;
  updated_at: string;
  notes: string;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    nationality: string;
    languages: string[];
    linkedin?: string;
    website?: string;
  };
  summary: string;
  flightHours: {
    total: number;
    pic: number;
    sic: number;
    crossCountry: number;
    night: number;
    ifr: number;
    multiEngine: number;
    simulator: number;
    dualReceived: number;
  };
  aircraftTypes: Array<{
    manufacturer: string;
    model: string;
    typeRating: boolean;
    hours: number;
    lastFlown: string;
  }>;
  licenses: Array<{
    type: string;
    number: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate?: string;
    status: string;
    medicalClass?: string;
  }>;
  ratings: Array<{
    type: string;
    aircraftType: string;
    issueDate: string;
    expiryDate?: string;
  }>;
  workExperience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    aircraftTypes: string[];
    responsibilities: string[];
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  certifications: Array<{
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate?: string;
    credentialNumber?: string;
  }>;
  skills: string[];
  coreCompetencies: string[];
  template: string;
  targetRole: string;
  isCertified: boolean;
  certificationDate?: string;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({
  isOpen,
  onClose,
  applicationId,
  enterpriseAccountId
}) => {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [recognitionScore, setRecognitionScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && applicationId) {
      loadApplication();
    }
  }, [isOpen, applicationId]);

  const loadApplication = async () => {
    setLoading(true);
    try {
      // Load application
      const { data: appData, error: appError } = await supabase
        .from('resume_airline_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (appError) throw appError;
      setApplication(appData);
      setNotes(appData.notes || '');

      // Load resume
      if (appData.resume_id) {
        const { data: resumeData, error: resumeError } = await supabase
          .from('atlas_resumes')
          .select('*')
          .eq('id', appData.resume_id)
          .single();

        if (resumeError) throw resumeError;
        setResume(resumeData);
      }

      // Load recognition score
      if (appData.user_id) {
        const { data: scoreData } = await supabase
          .from('pilot_recognition_scores')
          .select('overall_score')
          .eq('user_id', appData.user_id)
          .single();

        if (scoreData) {
          setRecognitionScore(scoreData.overall_score);
        }
      }
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('resume_airline_applications')
        .update({
          status: newStatus,
          updated_at: new Date(),
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplication(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const saveNotes = async () => {
    try {
      const { error } = await supabase
        .from('resume_airline_applications')
        .update({
          notes,
          updated_at: new Date(),
        })
        .eq('id', applicationId);

      if (error) throw error;

      setApplication(prev => prev ? { ...prev, notes } : null);
      alert('Notes saved');
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const recordView = async () => {
    // Record that the airline viewed this resume
    try {
      await supabase
        .from('resume_analytics')
        .upsert({
          resume_id: application?.resume_id,
          user_id: application?.user_id,
          last_viewed_at: new Date(),
          updated_at: new Date(),
        });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  useEffect(() => {
    if (isOpen && !loading) {
      recordView();
    }
  }, [isOpen, loading]);

  const statusColors: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    viewed: 'bg-purple-100 text-purple-700 border-purple-200',
    shortlisted: 'bg-amber-100 text-amber-700 border-amber-200',
    interview: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    hired: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    withdrawn: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const statusLabels: Record<string, string> = {
    submitted: 'Submitted',
    viewed: 'Viewed',
    shortlisted: 'Shortlisted',
    interview: 'Interview',
    hired: 'Hired',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex"
          onClick={e => e.stopPropagation()}
        >
          {/* Left Panel - Resume */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : resume ? (
              <div className="p-8">
                {/* Header */}
                <div className="border-b border-slate-200 pb-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">{resume.personalInfo.fullName}</h1>
                      <p className="text-slate-600 mt-1">{resume.summary}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {resume.personalInfo.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {resume.personalInfo.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {resume.personalInfo.phone}
                        </span>
                      </div>
                    </div>
                    {resume.isCertified && (
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Atlas Certified
                      </div>
                    )}
                  </div>
                </div>

                {/* Recognition Score */}
                {recognitionScore !== null && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-amber-700 font-medium">Pilot Recognition Score</p>
                          <p className="text-2xl font-bold text-amber-900">{recognitionScore}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-amber-600">Industry Benchmark</p>
                        <p className="text-sm font-semibold text-amber-800">Top 25%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Flight Hours */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Flight Hours
                  </h2>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-lg font-bold text-slate-900">{resume.flightHours.total.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">PIC</p>
                      <p className="text-lg font-bold text-slate-900">{resume.flightHours.pic.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">SIC</p>
                      <p className="text-lg font-bold text-slate-900">{resume.flightHours.sic.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Multi-Engine</p>
                      <p className="text-lg font-bold text-slate-900">{resume.flightHours.multiEngine.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Aircraft Types */}
                {resume.aircraftTypes.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      Aircraft Types
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {resume.aircraftTypes.map((aircraft, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-lg p-3">
                          <p className="font-medium text-slate-900">{aircraft.manufacturer} {aircraft.model}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            {aircraft.typeRating && <span className="text-green-600">Type Rated</span>}
                            <span>•</span>
                            <span>{aircraft.hours.toLocaleString()} hrs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Licenses */}
                {resume.licenses.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Licenses
                    </h2>
                    <div className="space-y-2">
                      {resume.licenses.map((license, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">{license.type}</p>
                            <p className="text-xs text-slate-500">{license.issuingAuthority} • {license.number}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            license.status === 'valid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {license.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {resume.workExperience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      Work Experience
                    </h2>
                    <div className="space-y-4">
                      {resume.workExperience.map((exp, idx) => (
                        <div key={idx} className="border-l-2 border-blue-200 pl-4">
                          <p className="font-semibold text-slate-900">{exp.title}</p>
                          <p className="text-slate-600">{exp.company} • {exp.location}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resume.education.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      Education
                    </h2>
                    <div className="space-y-3">
                      {resume.education.map((edu, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-lg p-3">
                          <p className="font-medium text-slate-900">{edu.degree}</p>
                          <p className="text-sm text-slate-600">{edu.institution} • {edu.location}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-slate-500">
                Resume not found
              </div>
            )}
          </div>

          {/* Right Panel - Actions */}
          <div className="w-80 bg-slate-50 border-l border-slate-200 p-6 flex flex-col">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="self-end text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Application Status */}
            {application && (
              <>
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Application Status</h3>
                  <div className={`px-4 py-3 rounded-lg border ${statusColors[application.status]}`}>
                    <p className="font-medium">{statusLabels[application.status]}</p>
                    <p className="text-xs opacity-75 mt-1">
                      Applied: {new Date(application.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Update Status</h3>
                  <div className="space-y-2">
                    {['viewed', 'shortlisted', 'interview', 'hired', 'rejected'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateStatus(status)}
                        disabled={updatingStatus}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          application.status === status
                            ? statusColors[status]
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        } disabled:opacity-50`}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-6 flex-1">
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="flex items-center justify-between w-full text-sm font-semibold text-slate-900 mb-3"
                  >
                    <span>Internal Notes</span>
                    {showNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showNotes && (
                    <div className="space-y-2">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add internal notes about this candidate..."
                        className="w-full h-32 px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={saveNotes}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Save Notes
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <a
                    href={`mailto:${resume?.personalInfo.email}`}
                    className="w-full px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Contact Pilot
                  </a>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumeViewer;
