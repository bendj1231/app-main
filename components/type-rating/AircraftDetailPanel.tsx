import React from 'react';
import { Star, ChevronRight, X, CheckCircle2, DollarSign, Calendar, FileText, Gauge, Building2, BookOpen, Briefcase, Users, User, Clock, Award, Plane, Globe } from 'lucide-react';
import { SketchfabThumbnail } from './SketchfabThumbnail';
import { calculateCareerScore, type AircraftTypeRating, type PilotProfile } from '../../utils/careerScoreCalculator';

const CATEGORY_LABELS: Record<string, string> = {
  'all': 'All',
  'commercial': 'Commercial',
  'private': 'Private',
  'cargo': 'Cargo',
  'regional': 'Regional',
  'helicopter': 'Helicopter',
  'military': 'Military',
  'legacy': 'Legacy (Retired)',
  'flagship': 'Flagship',
};

interface AircraftDetailPanelProps {
  selectedAircraft: AircraftTypeRating;
  activeTab: string;
  onTabChange: (tab: string) => void;
  showExtendedInfo: boolean;
  onExtendedInfoToggle: (show: boolean) => void;
  getManufacturer: (aircraft: AircraftTypeRating) => { id: string; name: string; logo: string; reputation_score: number; } | undefined;
  detailRef: React.RefObject<HTMLDivElement>;
}

export function AircraftDetailPanel({
  selectedAircraft,
  activeTab,
  onTabChange,
  showExtendedInfo,
  onExtendedInfoToggle,
  getManufacturer,
  detailRef,
}: AircraftDetailPanelProps) {
  return (
    <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-12">
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">

        {/* Hero image with overlay */}
        <div className="relative h-64 md:h-80">
          {selectedAircraft.sketchfab_id ? (
            <SketchfabThumbnail
              sketchfab_id={selectedAircraft.sketchfab_id}
              alt={selectedAircraft.model}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={selectedAircraft.image}
              alt={selectedAircraft.model}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30`}>
                {CATEGORY_LABELS[selectedAircraft.category]}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{selectedAircraft.model}</h2>
            <div className="flex items-center gap-4 flex-wrap mb-3">
              <span className="flex items-center gap-1.5 text-sky-300 text-sm">
                <img src={getManufacturer(selectedAircraft)?.logo || '/logo.png'} alt="Manufacturer" className="h-4 w-auto object-contain opacity-80" />
                {getManufacturer(selectedAircraft)?.name}
              </span>
            </div>
            {/* Indicators */}
            <div className="flex flex-wrap gap-2">
              {selectedAircraft.career_score ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white border-2 border-sky-400 backdrop-blur-xl shadow-lg">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  Career Score: {selectedAircraft.career_score}/100
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white border-2 border-sky-400 backdrop-blur-xl shadow-lg">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  Career Score: {calculateCareerScore(selectedAircraft)}/100
                </div>
              )}
              {selectedAircraft.demand_level && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                  selectedAircraft.demand_level === 'high' ? 'bg-emerald-500 text-white border-emerald-400' :
                  selectedAircraft.demand_level === 'low' ? 'bg-amber-500 text-white border-amber-400' :
                  'bg-red-500 text-white border-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    selectedAircraft.demand_level === 'high' ? 'bg-white' :
                    selectedAircraft.demand_level === 'low' ? 'bg-white' :
                    'bg-white'
                  }`} />
                  Demand: {selectedAircraft.demand_level === 'high' ? 'High' : selectedAircraft.demand_level === 'low' ? 'Low' : 'None'}
                </div>
              )}
              {selectedAircraft.conditionally_new && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                  selectedAircraft.conditionally_new === 'green' ? 'bg-emerald-500 text-white border-emerald-400' :
                  selectedAircraft.conditionally_new === 'amber' ? 'bg-amber-500 text-white border-amber-400' :
                  'bg-red-500 text-white border-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    selectedAircraft.conditionally_new === 'green' ? 'bg-white' :
                    selectedAircraft.conditionally_new === 'amber' ? 'bg-white' :
                    'bg-white'
                  }`} />
                  Conditionally New
                </div>
              )}
              {selectedAircraft.lifecycle_stage && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                  selectedAircraft.lifecycle_stage === 'early-career' ? 'bg-emerald-500 text-white border-emerald-400' :
                  selectedAircraft.lifecycle_stage === 'mid-career' ? 'bg-amber-500 text-white border-amber-400' :
                  'bg-red-500 text-white border-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    selectedAircraft.lifecycle_stage === 'early-career' ? 'bg-white' :
                    selectedAircraft.lifecycle_stage === 'mid-career' ? 'bg-white' :
                    'bg-white'
                  }`} />
                  Lifecycle: {selectedAircraft.lifecycle_stage === 'early-career' ? 'Early Career' : selectedAircraft.lifecycle_stage === 'mid-career' ? 'Mid Career' : 'End of Life'}
                </div>
              )}
              {selectedAircraft.operator_count && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white border-2 border-amber-400 backdrop-blur-xl">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  Operators: {selectedAircraft.operator_count}+
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info bar — manufacturer + cost + age */}
        <div className="px-6 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src={getManufacturer(selectedAircraft)?.logo || '/logo.png'} alt={getManufacturer(selectedAircraft)?.name} className="h-8 object-contain" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Manufacturer</p>
              <p className="text-sm font-semibold text-slate-800">{getManufacturer(selectedAircraft)?.name}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">First Flight</p>
            <p className="text-sm font-semibold text-slate-800">{selectedAircraft.first_flight}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Category</p>
            <p className="text-sm font-semibold text-slate-800 capitalize">{selectedAircraft.category}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Reputation</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-slate-800">{getManufacturer(selectedAircraft)?.reputation_score}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 px-6 md:px-8 bg-white">
          <div className="flex gap-1 overflow-x-auto">
            {['Overview', 'Training', 'Hiring', 'Compensation', 'Comparison'].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Description Section — requirements + specs */}
        <div className="p-6 md:p-8 border-b border-slate-100">
          {activeTab === 'Overview' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Description</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{selectedAircraft.description}</p>
                
                {selectedAircraft.why_choose_rating && (
                  <>
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">Why Should a Pilot Choose This Rating?</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{selectedAircraft.why_choose_rating}</p>
                    {selectedAircraft.show_career_outlook && (
                      <button
                        onClick={() => onExtendedInfoToggle(true)}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        View Full Career Outlook
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Technical Specifications</h3>
                <div className="space-y-2">
                  {selectedAircraft.specifications && Object.entries(selectedAircraft.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-sm font-medium text-slate-800">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Overview' && selectedAircraft.news && selectedAircraft.news.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Latest News</h3>
              <div className="space-y-3">
                {selectedAircraft.news.map((news: any, i: number) => (
                  <div key={news.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">{news.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">{news.date}</p>
                        <p className="text-sm text-slate-600">{news.summary}</p>
                      </div>
                      <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
                        Read More →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Training' && selectedAircraft.training_curriculum && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Training Curriculum</h3>
              <div className="space-y-4">
                {selectedAircraft.training_curriculum.map((phase, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{phase.phase}</h4>
                      <span className="text-sm text-sky-600 font-medium">{phase.duration}</span>
                    </div>
                    <ul className="space-y-1">
                      {phase.topics.map((topic, topicIdx) => (
                        <li key={topicIdx} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Training' && selectedAircraft.simulator_details && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Simulator Details</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Type</p>
                    <p className="text-sm font-medium text-slate-800">{selectedAircraft.simulator_details.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Locations</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAircraft.simulator_details.locations.map((loc, idx) => (
                        <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-slate-200">{loc}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-slate-500 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAircraft.simulator_details.features.map((feat, idx) => (
                      <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-slate-200">{feat}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Training' && selectedAircraft.training_requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-900">Training Requirements</h3>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Minimum Flight Hours: {selectedAircraft.training_requirements.minimum_hours}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Ground School: {selectedAircraft.training_requirements.ground_school_hours} hours
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Simulator Training: {selectedAircraft.training_requirements.simulator_hours} hours
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Flight Training: {selectedAircraft.training_requirements.flight_hours} hours
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'Hiring' && selectedAircraft.hiring_requirements && (
            <div>
              {selectedAircraft.hiring_requirements.airline_specific && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Hiring Requirements by Airline Type</h3>
                  <div className="space-y-3">
                    {selectedAircraft.hiring_requirements.airline_specific.map((req: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <h4 className="font-semibold text-slate-900 mb-2">{req.airline_type}</h4>
                        <ul className="space-y-1.5 text-sm text-slate-600">
                          <li><strong>Total Flight Time:</strong> {req.total_flight_time}</li>
                          {req.multi_engine_turbine_time && (
                            <li><strong>Multi-Engine/Turbine Time:</strong> {req.multi_engine_turbine_time}</li>
                          )}
                          <li><strong>License:</strong> {req.license}</li>
                          {req.medical && (
                            <li><strong>Medical:</strong> {req.medical}</li>
                          )}
                          {req.english_proficiency && (
                            <li><strong>English Proficiency:</strong> {req.english_proficiency}</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAircraft.hiring_requirements.career_opportunities && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Career Opportunities</h3>
                  <div className="space-y-2 mb-4">
                    {selectedAircraft.hiring_requirements.career_opportunities.sign_on_bonuses && (
                      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                        <h4 className="text-sm font-semibold text-emerald-800 mb-1">Sign-on Bonuses</h4>
                        <p className="text-xs text-emerald-700">{selectedAircraft.hiring_requirements.career_opportunities.sign_on_bonuses}</p>
                      </div>
                    )}
                    {selectedAircraft.hiring_requirements.career_opportunities.fast_track_command && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Fast-Track Command</h4>
                        <p className="text-xs text-blue-700">{selectedAircraft.hiring_requirements.career_opportunities.fast_track_command}</p>
                      </div>
                    )}
                    {selectedAircraft.hiring_requirements.career_opportunities.neo_growth && (
                      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                        <h4 className="text-sm font-semibold text-emerald-800 mb-1">The Neo Growth</h4>
                        <p className="text-xs text-emerald-700">{selectedAircraft.hiring_requirements.career_opportunities.neo_growth}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Compensation' && selectedAircraft.compensation_data && (
            <div>
              {selectedAircraft.compensation_data.title && (
                <h3 className="text-lg font-semibold mb-3 text-slate-900">{selectedAircraft.compensation_data.title}</h3>
              )}
              {selectedAircraft.compensation_data.description && (
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{selectedAircraft.compensation_data.description}</p>
              )}
              {selectedAircraft.compensation_data.salary_ranges && (
                <div className="space-y-3">
                  {selectedAircraft.compensation_data.salary_ranges.map((range: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{range.position}</h4>
                        <span className="text-sm font-medium text-emerald-600">{range.salary}</span>
                      </div>
                      <p className="text-xs text-slate-500">{range.notes}</p>
                    </div>
                  ))}
                </div>
              )}
              {selectedAircraft.compensation_data.benefits && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Benefits</h3>
                  <ul className="space-y-2">
                    {selectedAircraft.compensation_data.benefits.map((benefit: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Comparison' && selectedAircraft.comparison_data && (
            <div>
              {selectedAircraft.comparison_data.title && <h3 className="text-lg font-semibold mb-3 text-slate-900">{selectedAircraft.comparison_data.title}</h3>}
              {selectedAircraft.comparison_data.common_type_rating && <div className="mb-4 p-3 bg-sky-50 rounded-lg border border-sky-200 text-sm text-sky-700">{selectedAircraft.comparison_data.common_type_rating}</div>}
              {selectedAircraft.comparison_data.variant_comparison && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">{selectedAircraft.comparison_data.variant_comparison.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {selectedAircraft.comparison_data.variant_comparison.description}
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-100 (The "Sports Car")</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-300 (The "Workhorse")</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAircraft.comparison_data.variant_comparison.features.map((feature: any, idx: number) => (
                          <tr key={idx}>
                            <td className="p-2 border border-slate-200 font-semibold">{feature.feature}</td>
                            <td className="p-2 border border-slate-200">{feature.a220_100}</td>
                            <td className="p-2 border border-slate-200">{feature.a220_300}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {selectedAircraft.comparison_data.airlines_by_variant && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">{selectedAircraft.comparison_data.airlines_by_variant.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    {selectedAircraft.comparison_data.airlines_by_variant.description}
                  </p>
                  <div className="space-y-2">
                    {selectedAircraft.comparison_data.airlines_by_variant.airlines.map((airline: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 text-sm">{airline.name}</span>
                          <span className="text-xs text-slate-500">{airline.fleet}</span>
                        </div>
                        <p className="text-xs text-slate-600">{airline.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedAircraft.comparison_data.advice && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="text-sm font-bold text-amber-800 mb-2">Advice for Pilots</h3>
                  <p className="text-sm text-amber-700">{selectedAircraft.comparison_data.advice}</p>
                </div>
              )}
              {selectedAircraft.comparison_data.pilot_recognition_verdict && (
                <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
                  <h3 className="text-sm font-bold text-sky-800 mb-2">Pilot Recognition Verdict</h3>
                  <p className="text-sm text-sky-700">{selectedAircraft.comparison_data.pilot_recognition_verdict}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
