import React from 'react';
import {
  DollarSign,
  Clock,
  MapPin,
  Briefcase,
  Users,
  TrendingUp,
  Database,
  Calendar,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import type { Airline } from '../pages/PortalAirlineExpectationsPage';

interface QuickStatsProps {
  airline: Airline;
  hasRecognitionAccess: boolean;
  isDarkMode: boolean;
  getSalaryRange: (airline: Airline) => string;
  getAssessmentProcess: (airline: Airline) => string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  airline,
  hasRecognitionAccess,
  isDarkMode,
  getSalaryRange,
  getAssessmentProcess,
}) => {
  const text = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtext = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBase = isDarkMode
    ? 'bg-white/10 backdrop-blur-md border border-white/10'
    : 'bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm';

  return (
    <div>
      <h3 className={`text-lg font-semibold mb-3 ${text}`}>Quick Stats</h3>
      {/* PilotRecognition+ Salary Card */}
      <div className={`p-4 rounded-2xl relative overflow-hidden ${isDarkMode ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg'} mb-3`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-white/10' : 'bg-slate-100/80'}`}>
              <DollarSign className={`w-4 h-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
            </div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Salary Range</span>
          </div>
        </div>

        {/* Content - blurred when locked */}
        <div className={`relative ${!hasRecognitionAccess && airline.salaryRangeDetailed ? 'blur-sm select-none' : ''}`}>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {getSalaryRange(airline)}
          </p>
        </div>

        {/* Blur Overlay when locked */}
        {!hasRecognitionAccess && airline.salaryRangeDetailed && (
          <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900/40' : 'bg-white/40'} backdrop-blur-md rounded-2xl`}>
            <div className="text-center">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-2 ${isDarkMode ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
                <Shield className="w-3.5 h-3.5" /> PilotRecognition+
              </div>
              <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Unlock detailed salary breakdown</p>
            </div>
          </div>
        )}

        {/* Unlocked badge */}
        {hasRecognitionAccess && airline.salaryRangeDetailed && (
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
              <CheckCircle2 className="w-3 h-3" /> Unlocked
            </span>
          </div>
        )}
      </div>

      <div className={`p-4 rounded-2xl ${cardBase}`}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {/* Flight Hours */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-start gap-2.5">
              <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-sky-500/15' : 'bg-sky-100/80'}`}>
                <Clock className={`w-3.5 h-3.5 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-[11px] ${subtext}`}>Flight Hours</p>
                <p className={`font-semibold text-sm ${text}`}>{airline.flightHours}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-start gap-2.5">
              <MapPin className={`w-3.5 h-3.5 mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0`} />
              <div className="min-w-0">
                <p className={`text-[11px] ${subtext}`}>Location</p>
                <p className={`font-semibold text-sm ${text} truncate`}>{airline.location}</p>
              </div>
            </div>
          </div>

          {/* Assessment */}
          {airline.assessmentProcessPublic && (
            <div>
              <div className="flex items-start gap-2.5">
                <Briefcase className={`w-3.5 h-3.5 mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className={`text-[11px] ${subtext}`}>Assessment</p>
                  <p className={`text-xs ${text} line-clamp-2 leading-relaxed`}>{getAssessmentProcess(airline)}</p>
                  {!hasRecognitionAccess && airline.assessmentProcessDetailed && (
                    <span className={`inline-flex items-center gap-1 text-[10px] mt-0.5 px-1.5 py-0.5 rounded-full font-medium ${isDarkMode ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-100/80 text-amber-700'}`}>
                      <Shield className="w-2.5 h-2.5" /> PR+
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recruitment Status */}
          {airline.detailedInfo?.recruitmentStatus && (
            <div className="col-span-2">
              <div className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-violet-500/15' : 'bg-violet-100/80'}`}>
                  <Users className={`w-3.5 h-3.5 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-[11px] ${subtext}`}>Recruitment Status</p>
                  <p className={`font-semibold text-sm ${text}`}>
                    {airline.detailedInfo.recruitmentStatus.typeRatedPositions || airline.detailedInfo.recruitmentStatus.directEntryCaptains || 'Active recruitment'}
                  </p>
                  {(airline.detailedInfo.recruitmentStatus.typeRatedPositions && airline.detailedInfo.recruitmentStatus.directEntryCaptains) && (
                    <p className={`text-xs ${subtext} mt-0.5`}>
                      {airline.detailedInfo.recruitmentStatus.directEntryCaptains}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Roster */}
          {airline.detailedInfo?.workingConditions?.roster && (
            <div className="col-span-2">
              <div className="flex items-start gap-2.5">
                <Clock className={`w-3.5 h-3.5 mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className={`text-[11px] ${subtext}`}>Roster</p>
                  <p className={`text-xs ${text} line-clamp-2 leading-relaxed`}>{airline.detailedInfo.workingConditions.roster}</p>
                </div>
              </div>
            </div>
          )}

          {/* Training Bond */}
          {airline.detailedInfo?.workingConditions?.bonds && (
            <div>
              <div className="flex items-start gap-2.5">
                <TrendingUp className={`w-3.5 h-3.5 mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className={`text-[11px] ${subtext}`}>Training Bond</p>
                  <p className={`text-xs ${text} line-clamp-2 leading-relaxed`}>{airline.detailedInfo.workingConditions.bonds}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider + Data Source */}
        {airline.dataSource && (
          <>
            <div className={`my-3 h-px ${isDarkMode ? 'bg-white/10' : 'bg-slate-200/60'}`} />
            <div className="flex items-start gap-2.5">
              <Database className={`w-3.5 h-3.5 mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0`} />
              <div className="min-w-0">
                <p className={`text-[11px] ${subtext}`}>Data Source</p>
                <p className={`text-xs ${text} leading-relaxed`}>{airline.dataSource}</p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {airline.lastUpdated && (
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-200/70 text-slate-600'}`}>
                      <Calendar className="w-2.5 h-2.5" /> {airline.lastUpdated}
                    </span>
                  )}
                  {airline.verificationStatus && (
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      airline.verificationStatus === 'verified'
                        ? (isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100/80 text-emerald-700')
                        : airline.verificationStatus === 'pending'
                        ? (isDarkMode ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-100/80 text-amber-700')
                        : (isDarkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-100/80 text-rose-700')
                    }`}>
                      {airline.verificationStatus === 'verified' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
                      {airline.verificationStatus.charAt(0).toUpperCase() + airline.verificationStatus.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
