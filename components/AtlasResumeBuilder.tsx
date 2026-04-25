import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { getUserSubscription, checkFeatureAccess } from '@/lib/subscription-gating';
import { 
  AtlasResumeData, 
  FlightHours, 
  AircraftType, 
  License, 
  Rating, 
  WorkExperience, 
  Education, 
  Certification,
  AviationRole,
  ResumeTemplate 
} from '@/types/atlas-resume';
import { supabase } from '@/shared/lib/supabase';
import { 
  FileText, 
  Download, 
  Share2, 
  Award, 
  Plane, 
  Clock, 
  GraduationCap, 
  Briefcase,
  Shield,
  Eye,
  Download as DownloadIcon,
  Send
} from 'lucide-react';
import AirlineSelectionModal from './AirlineSelectionModal';

interface AtlasResumeBuilderProps {
  onBack?: () => void;
}

const AtlasResumeBuilder: React.FC<AtlasResumeBuilderProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const [recognitionScore, setRecognitionScore] = useState<number | null>(null);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  
  const [activeSection, setActiveSection] = useState<'personal' | 'flight' | 'aircraft' | 'licenses' | 'experience' | 'education' | 'certifications' | 'preview'>('personal');
  const [resumeData, setResumeData] = useState<AtlasResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      nationality: '',
      languages: ['English'],
    },
    summary: '',
    flightHours: {
      total: 0,
      pic: 0,
      sic: 0,
      crossCountry: 0,
      night: 0,
      ifr: 0,
      multiEngine: 0,
      simulator: 0,
      dualReceived: 0,
    },
    aircraftTypes: [],
    licenses: [],
    ratings: [],
    workExperience: [],
    education: [],
    certifications: [],
    skills: [],
    coreCompetencies: [],
    template: 'modern',
    targetRole: 'commercial',
    createdAt: new Date(),
    updatedAt: new Date(),
    isCertified: false,
  });

  const [analytics, setAnalytics] = useState({
    views: 0,
    downloads: 0,
    shares: 0,
    applications: 0,
  });

  const [showAirlineModal, setShowAirlineModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser?.uid) {
        // Check subscription
        const sub = await getUserSubscription(currentUser.uid);
        setSubscription(sub);
        const canAccess = checkFeatureAccess(sub, 'premium');
        setHasPremiumAccess(canAccess);
        
        // Load recognition score
        try {
          const { data, error } = await supabase
            .from('pilot_recognition_scores')
            .select('overall_score')
            .eq('user_id', currentUser.uid)
            .single();
          
          if (!error && data) {
            setRecognitionScore(data.overall_score);
          }
        } catch (err) {
          console.error('Error loading recognition score:', err);
        }
        setScoreLoading(false);
        
        // Load existing resume data
        loadResumeData(currentUser.uid);
        loadAnalytics(currentUser.uid);
      }
    };
    loadData();
  }, [currentUser?.uid]);

  const loadResumeData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('atlas_resumes')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setResumeData(data);
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
    }
  };

  const loadAnalytics = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('resume_analytics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setAnalytics({
          views: data.views || 0,
          downloads: data.downloads || 0,
          shares: data.shares || 0,
          applications: data.applications || 0,
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const saveResume = async () => {
    if (!currentUser?.uid) return;

    try {
      const { error } = await supabase
        .from('atlas_resumes')
        .upsert({
          user_id: currentUser.uid,
          ...resumeData,
          updated_at: new Date(),
        });

      if (error) throw error;
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume');
    }
  };

  const generateShareLink = async () => {
    if (!currentUser?.uid) return;

    try {
      const shareToken = Math.random().toString(36).substring(2, 15);
      const shareUrl = `${window.location.origin}/resume/${shareToken}`;

      const { error } = await supabase
        .from('resume_shares')
        .insert({
          resume_id: resumeData.id || crypto.randomUUID(),
          user_id: currentUser.uid,
          share_token: shareToken,
          share_url: shareUrl,
          is_public: false,
          created_at: new Date(),
        });

      if (error) throw error;

      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
      
      // Update analytics
      await supabase
        .from('resume_analytics')
        .upsert({
          user_id: currentUser.uid,
          shares: analytics.shares + 1,
          updated_at: new Date(),
        });
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link');
    }
  };

  const exportPDF = () => {
    window.print();
  };

  const certifyResume = async () => {
    if (!hasPremiumAccess) {
      alert('Atlas Résumé Certification is a premium feature. Please upgrade to access this feature.');
      return;
    }

    try {
      const { error } = await supabase
        .from('atlas_resumes')
        .update({
          is_certified: true,
          certification_date: new Date(),
          updated_at: new Date(),
        })
        .eq('user_id', currentUser?.uid);

      if (error) throw error;

      setResumeData(prev => ({
        ...prev,
        isCertified: true,
        certificationDate: new Date(),
      }));

      alert('Your resume has been certified as Atlas Résumé Certified!');
    } catch (error) {
      console.error('Error certifying resume:', error);
      alert('Failed to certify resume');
    }
  };

  const shareWithAirlines = async (selectedAirlines: string[]) => {
    if (!currentUser?.uid || !resumeData.id) return;

    try {
      // First save the resume if not saved
      const { data: savedResume, error: saveError } = await supabase
        .from('atlas_resumes')
        .upsert({
          user_id: currentUser.uid,
          ...resumeData,
          updated_at: new Date(),
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Get airline details
      const { data: airlines, error: airlinesError } = await supabase
        .from('enterprise_accounts')
        .select('id, airline_name')
        .in('id', selectedAirlines);

      if (airlinesError) throw airlinesError;

      // Create applications for each selected airline
      const applications = airlines.map(airline => ({
        resume_id: savedResume.id,
        user_id: currentUser.uid,
        airline_id: airline.id,
        airline_name: airline.airline_name,
        status: 'submitted',
        application_status: 'pending',
        applied_at: new Date(),
        updated_at: new Date(),
      }));

      const { error: appError } = await supabase
        .from('resume_airline_applications')
        .insert(applications);

      if (appError) throw appError;

      // Update analytics
      await supabase
        .from('resume_analytics')
        .upsert({
          user_id: currentUser.uid,
          resume_id: savedResume.id,
          applications: analytics.applications + selectedAirlines.length,
          updated_at: new Date(),
        });

      alert(`Successfully shared your résumé with ${selectedAirlines.length} airline(s)!`);
    } catch (error) {
      console.error('Error sharing with airlines:', error);
      alert('Failed to share résumé with airlines');
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'flight', label: 'Flight Hours', icon: Clock },
    { id: 'aircraft', label: 'Aircraft Types', icon: Plane },
    { id: 'licenses', label: 'Licenses & Ratings', icon: Shield },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'preview', label: 'Preview', icon: Eye },
  ];

  if (!hasPremiumAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Atlas Résumé Builder</h2>
          <p className="text-slate-600 mb-6">
            Create industry-standard aviation resumes with certification, analytics, and direct airline sharing.
          </p>
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-900 mb-2">Premium Features</h3>
            <ul className="text-sm text-purple-700 space-y-1 text-left">
              <li>• Atlas Résumé Certified badge</li>
              <li>• Resume analytics (views, downloads)</li>
              <li>• Direct airline sharing</li>
              <li>• Multiple aviation role templates</li>
              <li>• Shareable verification links</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.href = '/subscription'}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  ← Back
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Atlas Résumé Builder</h1>
                <p className="text-sm text-slate-600">Industry-standard aviation resume format</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!scoreLoading && recognitionScore && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">
                    Score: {recognitionScore}
                  </span>
                </div>
              )}
              <button
                onClick={saveResume}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                Save
              </button>
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={generateShareLink}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              {hasPremiumAccess && (
                <button
                  onClick={() => setShowAirlineModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Share with Airlines
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>

              {/* Analytics */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Resume Analytics
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Views
                    </span>
                    <span className="font-semibold text-slate-900">{analytics.views}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <DownloadIcon className="w-4 h-4" />
                      Downloads
                    </span>
                    <span className="font-semibold text-slate-900">{analytics.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Shares
                    </span>
                    <span className="font-semibold text-slate-900">{analytics.shares}</span>
                  </div>
                </div>
              </div>

              {/* Certification Status */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                {resumeData.isCertified ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <Award className="w-5 h-5" />
                      <span className="font-semibold text-sm">Atlas Certified</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Certified on {resumeData.certificationDate?.toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={certifyResume}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Get Certified
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'preview' && (
              <ResumePreview data={resumeData} recognitionScore={recognitionScore || undefined} />
            )}
            {activeSection === 'personal' && (
              <PersonalInfoSection data={resumeData.personalInfo} onChange={(data) => setResumeData(prev => ({ ...prev, personalInfo: data }))} />
            )}
            {activeSection === 'flight' && (
              <FlightHoursSection data={resumeData.flightHours} onChange={(data) => setResumeData(prev => ({ ...prev, flightHours: data }))} />
            )}
            {activeSection === 'aircraft' && (
              <AircraftTypesSection data={resumeData.aircraftTypes} onChange={(data) => setResumeData(prev => ({ ...prev, aircraftTypes: data }))} />
            )}
            {activeSection === 'licenses' && (
              <LicensesSection data={resumeData.licenses} onChange={(data) => setResumeData(prev => ({ ...prev, licenses: data }))} />
            )}
            {activeSection === 'experience' && (
              <ExperienceSection data={resumeData.workExperience} onChange={(data) => setResumeData(prev => ({ ...prev, workExperience: data }))} />
            )}
            {activeSection === 'education' && (
              <EducationSection data={resumeData.education} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />
            )}
            {activeSection === 'certifications' && (
              <CertificationsSection data={resumeData.certifications} onChange={(data) => setResumeData(prev => ({ ...prev, certifications: data }))} />
            )}
          </div>
        </div>
      </div>

      {/* Airline Selection Modal */}
      <AirlineSelectionModal
        isOpen={showAirlineModal}
        onClose={() => setShowAirlineModal(false)}
        onShare={shareWithAirlines}
        resumeData={resumeData}
      />
    </div>
  );
};

// Section Components (simplified for brevity - full implementation would include detailed forms)
const PersonalInfoSection: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
        <input
          type="text"
          value={data.location}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nationality</label>
        <input
          type="text"
          value={data.nationality}
          onChange={(e) => onChange({ ...data, nationality: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  </div>
);

const FlightHoursSection: React.FC<{ data: FlightHours; onChange: (data: FlightHours) => void }> = ({ data, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-slate-900">Flight Hours</h2>
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange({ ...data, [key]: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ))}
    </div>
  </div>
);

const AircraftTypesSection: React.FC<{ data: AircraftType[]; onChange: (data: AircraftType[]) => void }> = ({ data, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-slate-900">Aircraft Types</h2>
    <p className="text-slate-600">Add aircraft types you have experience with</p>
    {/* Simplified - would include full form for adding aircraft */}
    <div className="bg-slate-50 rounded-lg p-4 text-center text-slate-500">
      Aircraft types form coming soon
    </div>
  </div>
);

const LicensesSection: React.FC<{ 
  licenses: License[]; 
  ratings: Rating[];
  onLicensesChange: (data: License[]) => void;
  onRatingsChange: (data: Rating[]) => void;
}> = ({ licenses, ratings, onLicensesChange, onRatingsChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-slate-900">Licenses & Ratings</h2>
    <div className="bg-slate-50 rounded-lg p-4 text-center text-slate-500">
      Licenses and ratings form coming soon
    </div>
  </div>
);

const ExperienceSection: React.FC<{ data: WorkExperience[]; onChange: (data: WorkExperience[]) => void }> = ({ data, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-slate-900">Work Experience</h2>
    <div className="bg-slate-50 rounded-lg p-4 text-center text-slate-500">
      Work experience form coming soon
    </div>
  </div>
);

const EducationSection: React.FC<{ data: Education[]; onChange: (data: Education[]) => void }> = ({ data, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-slate-900">Education</h2>
    <div className="bg-slate-50 rounded-lg p-4 text-center text-slate-500">
      Education form coming soon
    </div>
  </div>
);

const CertificationsSection: React.FC<{ data: Certification[]; onChange: (data: Certification[]) => void }> = ({ data, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-slate-900">Certifications</h2>
    <div className="bg-slate-50 rounded-lg p-4 text-center text-slate-500">
      Certifications form coming soon
    </div>
  </div>
);

const ResumePreview: React.FC<{ data: AtlasResumeData; recognitionScore?: number }> = ({ data, recognitionScore }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-slate-900">Resume Preview</h2>
    <div className="bg-slate-50 rounded-lg p-8 text-center text-slate-500">
      Resume preview coming soon
    </div>
  </div>
);

export default AtlasResumeBuilder;
