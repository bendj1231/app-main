import { Metadata } from 'next';
import { typeRatingService, ManufacturerCamel } from '@/src/services/typeRatingService';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const manufacturer = await typeRatingService.getManufacturerById(params.id);
  
  if (!manufacturer) {
    return {
      title: 'Manufacturer Not Found',
    };
  }

  return {
    title: `${manufacturer.name} Expectations - Pilotrecognition.com | Aviation Career Recognition Platform`,
    description: `Learn about expectations, requirements, and career progression for ${manufacturer.name} pilots. Operated by WM Pilot Group.`,
    keywords: `${manufacturer.name}, pilot expectations, type rating, aviation career, pilot jobs, ${manufacturer.id}`,
    authors: [{ name: 'WM Pilot Group' }],
    openGraph: {
      title: `${manufacturer.name} Expectations - Pilotrecognition.com`,
      description: `Learn about expectations, requirements, and career progression for ${manufacturer.name} pilots.`,
      url: `https://pilotrecognition.com/manufacturer/${manufacturer.id}/expectations`,
      siteName: 'Pilotrecognition.com',
      images: [
        {
          url: manufacturer.logo || 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
          width: 1200,
          height: 630,
          alt: `${manufacturer.name} Logo`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${manufacturer.name} Expectations - Pilotrecognition.com`,
      description: `Learn about expectations, requirements, and career progression for ${manufacturer.name} pilots.`,
      images: [manufacturer.logo || 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://pilotrecognition.com/manufacturer/${manufacturer.id}/expectations`,
    },
  };
}

export default async function ManufacturerExpectationsPage({ params }: PageProps) {
  const manufacturer = await typeRatingService.getManufacturerById(params.id);
  
  if (!manufacturer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-sky-500/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-6 mb-8">
            <img
              src={manufacturer.logo}
              alt={manufacturer.name}
              className="w-24 h-12 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{manufacturer.name} Expectations</h1>
              <p className="text-slate-300">
                Understanding requirements, career progression, and expectations for {manufacturer.name} pilots
              </p>
            </div>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
          >
            ← Back to Type Rating Search
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-slate-300 leading-relaxed">{manufacturer.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-slate-400 text-sm">Founded</p>
                  <p className="text-white font-semibold">{manufacturer.founded}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Headquarters</p>
                  <p className="text-white font-semibold">{manufacturer.headquarters}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Reputation Score</p>
                  <p className="text-white font-semibold">{manufacturer.reputationScore}/10</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Aircraft</p>
                  <p className="text-white font-semibold">{manufacturer.totalAircraftCount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Training Requirements Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Training Requirements</h2>
              {manufacturer.expectations ? (
                <div className="space-y-4">
                  <p className="text-slate-300">{manufacturer.expectations.overview}</p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">Key Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                      {manufacturer.expectations.trainingRequirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-slate-300">
                  <p>
                    {manufacturer.name} pilots typically require specific training programs and certifications. 
                    Requirements vary by aircraft type and regional regulations.
                  </p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-2">Key Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Valid pilot license (CPL/ATPL as applicable)</li>
                      <li>Type rating for specific aircraft models</li>
                      <li>Medical certificate (Class 1 for commercial operations)</li>
                      <li>English language proficiency (ICAO Level 4+)</li>
                      <li>Recurrent training and simulator checks</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Career Progression Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Career Progression</h2>
              {manufacturer.expectations ? (
                <div className="space-y-4">
                  <p className="text-slate-300">{manufacturer.expectations.careerPath}</p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">Key Skills</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                      {manufacturer.expectations.keySkills.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  {manufacturer.expectations.additionalNotes && (
                    <p className="text-slate-400 text-sm mt-4 italic">
                      <strong>Note:</strong> {manufacturer.expectations.additionalNotes}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-300">
                    Career progression information varies by airline and region. Typically follows the path from 
                    First Officer to Captain to senior management roles.
                  </p>
                  {manufacturer.careerProgression && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Career Path</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <div>
                            <p className="text-white font-semibold">{manufacturer.careerProgression.entryLevel}</p>
                            <p className="text-slate-400 text-sm">Entry Level</p>
                          </div>
                          <div className="text-slate-400">→</div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <div>
                            <p className="text-white font-semibold">{manufacturer.careerProgression.midLevel}</p>
                            <p className="text-slate-400 text-sm">Mid Level</p>
                          </div>
                          <div className="text-slate-400">→</div>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <p className="text-white font-semibold">{manufacturer.careerProgression.seniorLevel}</p>
                            <p className="text-slate-400 text-sm">Senior Level</p>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mt-4">
                          <strong>Timeline:</strong> {manufacturer.careerProgression.timeline}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Salary & Demand Section */}
            {manufacturer.expectations && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Salary & Demand</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Salary Range</p>
                      <p className="text-white font-semibold">{manufacturer.expectations.salaryRange}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Demand Outlook</p>
                      <p className="text-white font-semibold">{manufacturer.expectations.demandOutlook}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-2">Common Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {manufacturer.expectations.commonRoles.map((role, idx) => (
                        <span key={idx} className="px-3 py-1 bg-sky-500/20 text-sky-300 text-sm rounded-full">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Training Centers Section */}
            {manufacturer.trainingCenters && manufacturer.trainingCenters.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Training Centers</h2>
                <div className="space-y-4">
                  {manufacturer.trainingCenters.map((center) => (
                    <div key={center.id} className="bg-white/5 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-1">{center.name}</h3>
                      <p className="text-slate-400 text-sm mb-2">
                        {center.location}, {center.country}
                      </p>
                      <p className="text-slate-300 text-sm mb-2">
                        <strong>Offers:</strong> {center.offers.join(', ')}
                      </p>
                      {center.website && (
                        <a
                          href={center.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:text-sky-300 text-sm"
                        >
                          Visit Website →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">Website</p>
                  <a
                    href={manufacturer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 text-sm"
                  >
                    {manufacturer.website}
                  </a>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Market Demand</p>
                  <p className="text-white font-semibold">
                    {manufacturer.marketDemandStatistics?.demandLevel || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Growth Rate</p>
                  <p className="text-white font-semibold">
                    {manufacturer.marketDemandStatistics?.growthRate || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Need More Information?</h3>
              <p className="text-slate-300 text-sm mb-4">
                Contact us for detailed information about {manufacturer.name} training programs and career opportunities.
              </p>
              <button className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
