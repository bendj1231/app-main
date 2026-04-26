import React, { useEffect } from 'react';
import { manufacturers } from '@/data/aircraft-manufacturers';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from '@/components/website/components/TopNavbar';

const ManufacturerExpectationsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Debugging
  useEffect(() => {
    console.log('[ManufacturerExpectationsPage] Component mounted');
    console.log('[ManufacturerExpectationsPage] ID from URL:', id);
    console.log('[ManufacturerExpectationsPage] Available manufacturers:', manufacturers.map(m => m.id));
    const manufacturer = manufacturers.find(m => m.id === id);
    console.log('[ManufacturerExpectationsPage] Found manufacturer:', manufacturer?.name);
  }, [id]);

  const manufacturer = manufacturers.find(m => m.id === id);

  if (!manufacturer) {
    console.log('[ManufacturerExpectationsPage] Manufacturer not found, showing error');
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <div className="pt-32 pb-12 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-serif text-slate-900 mb-4">Manufacturer Not Found</h1>
            <p className="text-slate-700 mb-8">The manufacturer with ID "{id}" could not be found.</p>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Pathways
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('[ManufacturerExpectationsPage] Rendering manufacturer:', manufacturer.name);

  const expectationsContent = [
    {
      title: "Company Overview",
      description: `${manufacturer.name} is a leading aircraft manufacturer founded in ${manufacturer.founded}, headquartered in ${manufacturer.headquarters}. With a reputation score of ${manufacturer.reputationScore}/10 and ${manufacturer.totalAircraftCount.toLocaleString()} aircraft in service, ${manufacturer.name} plays a significant role in the global aviation industry. ${manufacturer.description}`
    },
    {
      title: "Training Requirements",
      description: manufacturer.expectations ? manufacturer.expectations.overview : `${manufacturer.name} pilots typically require specific training programs and certifications. Requirements vary by aircraft type and regional regulations. Key requirements include valid pilot license (CPL/ATPL as applicable), type rating for specific aircraft models, medical certificate (Class 1 for commercial operations), English language proficiency (ICAO Level 4+), and recurrent training and simulator checks.`
    },
    {
      title: "Type Rating Process",
      description: `The type rating process for ${manufacturer.name} aircraft involves comprehensive training including ground school, simulator sessions, and flight training. Training centers worldwide offer ${manufacturer.name} type ratings, with programs designed to meet regulatory requirements and airline standards. The duration and cost vary by aircraft type and training provider.`
    },
    {
      title: "Career Progression",
      description: manufacturer.careerProgression && manufacturer.careerProgression.stages ? manufacturer.careerProgression.stages.map(stage => stage.title).join(', ') : `Career progression typically follows standard aviation pathways from entry-level positions to captain roles, with opportunities for specialization in different aircraft types. ${manufacturer.name} offers various career paths for pilots with appropriate experience and qualifications.`
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <TopNavbar onNavigate={(page) => window.location.href = `/${page}`} onLogin={() => {}} forceScrolled={true} isLight={true} />

      {/* Header Section */}
      <div className="pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-20">
          <img
            src={manufacturer.logo}
            alt={`${manufacturer.name} Logo`}
            className="mx-auto w-32 h-auto object-contain mb-4"
          />
          <p className="text-xl font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
            Manufacturer Expectations
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
            {manufacturer.name}
          </h1>
          <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
            Type Rating | Requirements | Career Progression
          </span>
          <div className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed pt-8">
            <p>
              Understanding expectations, requirements, and career progression for {manufacturer.name} pilots. 
              Learn about training requirements, type rating processes, and career opportunities in the {manufacturer.name} ecosystem.
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Pathways
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Founded</p>
            <p className="text-2xl font-bold text-slate-900">{manufacturer.founded}</p>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Headquarters</p>
            <p className="text-2xl font-bold text-slate-900">{manufacturer.headquarters}</p>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Reputation Score</p>
            <p className="text-2xl font-bold text-slate-900">{manufacturer.reputationScore}/10</p>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Aircraft in Service</p>
            <p className="text-2xl font-bold text-slate-900">{manufacturer.totalAircraftCount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Expectations Content */}
      <div className="mb-16">
        <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
            {manufacturer.name}
          </p>
          <h2 style={{
            margin: '0.5rem 0 0',
            fontSize: '4rem',
            fontWeight: 'normal',
            fontFamily: 'Georgia, serif',
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            Expectations
          </h2>
          <p style={{ margin: '0.5rem 0 0', color: '#475569', fontSize: '1.1rem' }}>
            Requirements and career progression for {manufacturer.name} pilots
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
            Training & Requirements
          </p>
          <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-8">
            {manufacturer.name} Pilot Requirements
          </h2>
          <div className="text-left space-y-8">
            {expectationsContent.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-base text-slate-700 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training Centers Section */}
      {manufacturer.trainingCenters && manufacturer.trainingCenters.length > 0 && (
        <div className="py-12 px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
              Training Centers
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-8">
              Authorized Training Centers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {manufacturer.trainingCenters.slice(0, 6).map((center, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-xl">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{center.name}</h3>
                  <p className="text-sm text-slate-600">{center.location}, {center.country}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* External Resources */}
      <div className="py-12 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
            Resources
          </p>
          <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-8">
            External Resources
          </h2>
          <div className="text-center">
            <a
              href={manufacturer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl hover:bg-slate-800"
            >
              Visit {manufacturer.name} Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerExpectationsPage;
