"use client";

import React from 'react';
import { X, MapPin, Plane, Building2, Globe, Briefcase, Award, TrendingUp, Shield, ChevronRight } from 'lucide-react';
import { airlineDetailsMap, AirlineDetail } from './airline-detail-data';

interface Airline {
  id: string;
  name: string;
  location: string;
  salaryRange: string;
  flightHours: string;
  tags: string[];
  image: string;
  description: string;
  locationFlag?: string;
  fleet?: string;
}

interface AirlineDetailModalProps {
  airline: Airline;
  onClose: () => void;
  matchScore?: number;
  prScore?: number;
}

export const AirlineDetailModal: React.FC<AirlineDetailModalProps> = ({
  airline,
  onClose,
  matchScore = 0,
  prScore = 1
}) => {
  const details = airlineDetailsMap[airline.id] || null;

  if (!details) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Glassy X Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Hero Section */}
          <div className="relative h-64">
            <img src={airline.image} alt={airline.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-4xl font-serif text-white mb-2">{airline.name}</h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{airline.location}</span>
                <span className="flex items-center gap-1"><Plane className="w-4 h-4" />{details.fleetDetails.reduce((a,b) => a+b.count,0)} Aircraft</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" />{details.destinations.reduce((a,b) => a+b.count,0)} Destinations</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-4">About {airline.name}</h2>
              <p className="text-slate-600 leading-relaxed mb-4">{details.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Established
                  </div>
                  <p className="text-slate-600">{details.established}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Headquarters
                  </div>
                  <p className="text-slate-600 text-sm">{details.headquarters}</p>
                </div>
              </div>
            </section>

            {/* Fleet Section */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-4">Fleet</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.fleetDetails.map((fleet, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      {fleet.type}
                    </div>
                    <p className="text-slate-800 font-medium">{fleet.aircraft}</p>
                    <p className="text-slate-500 text-sm">{fleet.count} aircraft</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Destinations Section */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-4">Routes & Destinations</h2>
              <div className="space-y-4">
                {details.destinations.map((dest, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-800">{dest.region}</h3>
                      <span className="text-blue-600 font-bold">{dest.count} destinations</span>
                    </div>
                    <p className="text-slate-500 text-sm">{dest.highlights.join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Offices Section */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-4">Offices & Branches</h2>
              <div className="bg-slate-50 p-4 rounded-xl">
                <div className="mb-3">
                  <h3 className="font-semibold text-slate-800 mb-2">Hub Airports</h3>
                  {details.hubAirports.map((hub, idx) => (
                    <p key={idx} className="text-slate-600 text-sm">{hub}</p>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Worldwide Branches</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.branches.map((branch, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* PR Comparison Section */}
            <section className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif text-slate-900">Pilot Recognition Match</h2>
                <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border">Pilot-Recognition Engine Powered By WingMentor</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Match Score */}
                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-600 font-medium">Match Percentage</span>
                    <span className="text-3xl font-bold text-red-600">{matchScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: `${matchScore}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Overall compatibility score</p>
                </div>

                {/* PR Score */}
                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-600 font-medium">PR Score</span>
                    <span className="text-3xl font-bold text-blue-600">{prScore}/10</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`flex-1 h-2 rounded ${i < prScore ? 'bg-blue-600' : 'bg-slate-100'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Profile match on 1-10 scale</p>
                </div>
              </div>

              {/* Pete Mitchell Mock Profile */}
              <div className="mt-6 bg-white p-5 rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Sample Profile: Pete Mitchell
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Total Flight Hours</p>
                    <p className="font-semibold text-slate-800">2,500 hrs</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Type Ratings</p>
                    <p className="font-semibold text-slate-800">A320, B737</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Experience</p>
                    <p className="font-semibold text-slate-800">Regional Airline</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Training</p>
                    <p className="font-semibold text-slate-800">EBT CBTA</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Job Listings */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                Current Openings
              </h2>
              <div className="space-y-3">
                {details.jobs.map((job, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">{job.title}</h3>
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</p>
                        <p className="text-slate-400 text-xs mt-1">{job.type}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Apply</span>
                    </div>
                    <p className="text-slate-600 text-sm mt-2">{job.requirements}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
