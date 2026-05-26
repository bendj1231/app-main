import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Shield, Database, CheckCircle, Plane, FileCheck, Building2, ArrowRight } from 'lucide-react';
import { PathwaysSidebar } from '../components/website/components/pilot-recognition/PathwaysSidebar';
import { PlatformNavbar } from '../components/website/components/PlatformNavbar';

const authorities = [
  {
    code: 'FAA',
    name: 'Federal Aviation Administration',
    country: 'United States',
    description: 'The gold standard for aviation regulatory compliance. PilotRecognition integrates with FAA databases for real-time license verification, medical status, and type rating endorsements.',
    status: 'Integration Planned',
    features: ['License Verification API', 'Medical Status Sync', 'Type Rating Database', 'Pilot Records Integration'],
    color: 'blue',
  },
  {
    code: 'CAAP',
    name: 'Civil Aviation Authority of the Philippines',
    country: 'Philippines',
    description: 'Primary regulatory body for Philippine aviation. Direct integration enables instant validation of CAAP licenses, medical certificates, and training records for local pilots seeking global opportunities.',
    status: 'Partnership in Progress',
    features: ['PPL/CPL Database Access', 'Medical Certificate Validation', 'ATOC Verification', 'Examination Results Sync'],
    color: 'emerald',
  },
  {
    code: 'EASA',
    name: 'European Union Aviation Safety Agency',
    country: 'European Union',
    description: 'Comprehensive regulatory framework for European aviation. Integration provides seamless license conversion tracking and compliance monitoring for pilots transitioning to EASA jurisdictions.',
    status: 'Integration Roadmap',
    features: ['Part-FCL Compliance', 'License Conversion Tracking', 'Medical Class Monitoring', 'Training Organization Verification'],
    color: 'violet',
  },
  {
    code: 'CASA',
    name: 'Civil Aviation Safety Authority',
    country: 'Australia',
    description: 'Australian aviation regulator with stringent safety standards. Integration supports pilots seeking opportunities in the Asia-Pacific region with automated compliance checking.',
    status: 'Exploratory Discussions',
    features: ['License Validation', 'Medical Status Check', 'Type Rating Verification', 'Flight Crew Records'],
    color: 'amber',
  },
  {
    code: 'CAAC',
    name: 'Civil Aviation Administration of China',
    country: 'China',
    description: 'Regulatory authority for the world\'s fastest-growing aviation market. Integration enables Chinese pilots to showcase their credentials to international employers with verified compliance.',
    status: 'Strategic Planning',
    features: ['License Authentication', 'Medical Certificate Sync', 'Training Records Access', 'Regulatory Compliance Check'],
    color: 'red',
  },
  {
    code: 'ICAO',
    name: 'International Civil Aviation Organization',
    country: 'Global',
    description: 'United Nations specialized agency setting global standards. PilotRecognition aligns with ICAO standards to ensure cross-border license recognition and compliance transparency.',
    status: 'Standards Aligned',
    features: ['Annex 1 Compliance', 'Language Proficiency Tracking', 'Cross-Border Recognition', 'Global Standards Verification'],
    color: 'sky',
  },
];

const benefits = [
  {
    icon: Database,
    title: 'Real-Time Verification',
    description: 'Direct API connections to aviation authority databases ensure license, medical, and type rating information is always current and accurate.',
  },
  {
    icon: Shield,
    title: 'Regulatory Compliance',
    description: 'Automated monitoring of regulatory requirements across jurisdictions keeps pilots informed of upcoming renewals and compliance deadlines.',
  },
  {
    icon: CheckCircle,
    title: 'Trusted Credentials',
    description: 'Authority-verified data gives employers confidence in candidate qualifications, reducing hiring risk and accelerating recruitment decisions.',
  },
  {
    icon: Globe,
    title: 'Global Mobility',
    description: 'Cross-border license recognition and conversion tracking empowers pilots to pursue opportunities worldwide with verified compliance.',
  },
];

export default function GlobalAviationAuthoritiesPage() {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Navigation Bar */}
      <PlatformNavbar
        onNavigate={handleNavigate}
        currentPage="pathways"
      />

      {/* Sidebar Navigation */}
      <PathwaysSidebar activeSection="aviation-authorities" onNavigate={handleNavigate} />

      {/* Main Content with sidebar margin */}
      <div style={{ marginLeft: '280px', paddingTop: '2rem' }}>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              <span>Global Regulatory Network</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-normal mb-6 leading-tight">
              Global Aviation{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Authorities Search
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              PilotRecognition is building direct integrations with civil aviation authorities worldwide. 
              Our platform will enable real-time license verification, regulatory compliance tracking, 
              and seamless credential validation — giving pilots an unmatched competitive edge in the global market.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/become-member')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Join the Network
              </button>
              <button
                onClick={() => navigate('/pathways-modern')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Plane className="w-4 h-4" />
                Explore Pathways
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authorities Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif mb-4">Regulatory Authority Integrations</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We are establishing partnerships with aviation authorities globally to provide 
            pilots with verified, up-to-date credentials that employers can trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorities.map((authority) => (
            <div
              key={authority.code}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                    authority.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    authority.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                    authority.color === 'violet' ? 'bg-violet-500/20 text-violet-400' :
                    authority.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                    authority.color === 'red' ? 'bg-red-500/20 text-red-400' :
                    'bg-sky-500/20 text-sky-400'
                  }`}>
                    <Shield className="w-3 h-3" />
                    {authority.code}
                  </div>
                  <h3 className="text-lg font-semibold">{authority.name}</h3>
                  <p className="text-xs text-slate-500">{authority.country}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  authority.color === 'blue' ? 'bg-blue-500/10' :
                  authority.color === 'emerald' ? 'bg-emerald-500/10' :
                  authority.color === 'violet' ? 'bg-violet-500/10' :
                  authority.color === 'amber' ? 'bg-amber-500/10' :
                  authority.color === 'red' ? 'bg-red-500/10' :
                  'bg-sky-500/10'
                }`}>
                  <FileCheck className={`w-5 h-5 ${
                    authority.color === 'blue' ? 'text-blue-400' :
                    authority.color === 'emerald' ? 'text-emerald-400' :
                    authority.color === 'violet' ? 'text-violet-400' :
                    authority.color === 'amber' ? 'text-amber-400' :
                    authority.color === 'red' ? 'text-red-400' :
                    'text-sky-400'
                  }`} />
                </div>
              </div>
              
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">{authority.description}</p>
              
              <div className="mb-4">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Integration Status</span>
                <p className="text-sm font-medium text-white mt-1">{authority.status}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Planned Features</span>
                {authority.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className={`w-1 h-1 rounded-full ${
                      authority.color === 'blue' ? 'bg-blue-400' :
                      authority.color === 'emerald' ? 'bg-emerald-400' :
                      authority.color === 'violet' ? 'bg-violet-400' :
                      authority.color === 'amber' ? 'bg-amber-400' :
                      authority.color === 'red' ? 'bg-red-400' :
                      'bg-sky-400'
                    }`} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 border-t border-white/10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-white/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif mb-4">
                Be Part of the Regulatory Revolution
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Join PilotRecognition today and be among the first pilots to benefit from 
                direct aviation authority integrations. Your verified profile will become 
                your passport to global aviation opportunities.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/become-member')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 text-center">
                <p className="text-3xl font-bold text-blue-400">6+</p>
                <p className="text-xs text-slate-400 mt-1">Authorities in Pipeline</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 text-center">
                <p className="text-3xl font-bold text-emerald-400">190+</p>
                <p className="text-xs text-slate-400 mt-1">Countries Covered</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 text-center">
                <p className="text-3xl font-bold text-violet-400">Real-Time</p>
                <p className="text-xs text-slate-400 mt-1">License Verification</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 text-center">
                <p className="text-3xl font-bold text-amber-400">100%</p>
                <p className="text-xs text-slate-400 mt-1">Verified Data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-white/10">
        <p className="text-center text-xs text-slate-500">
          PilotRecognition is actively pursuing partnerships with civil aviation authorities worldwide.
          Features and integrations are subject to regulatory approval and data sharing agreements.
          Timeline for individual authority integrations will vary based jurisdiction.
        </p>
      </div>
      </div>{/* Close main content wrapper */}
    </div>
  );
}
