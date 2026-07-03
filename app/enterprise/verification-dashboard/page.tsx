import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { TopNavbar } from '@/components/website/components/TopNavbar';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText,
  Plane,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface VerificationDirective {
  id: string;
  pilot_name: string;
  pilot_id: string;
  directive_type: 'QUALIFICATIONS' | 'FLIGHT_HOURS';
  status: 'PENDING' | 'CAAP_REDIRECTED' | 'ATO_RESPONDED' | 'VERIFIED' | 'REJECTED';
  initiated_at: string;
  caap_redirected_at?: string;
  ato_responded_at?: string;
  verified_at?: string;
  ato_name: string;
  caap_ref: string;
  verification_hash: string;
  seat_hours_breakdown?: {
    pic_hours: number;
    sic_hours: number;
    total_hours: number;
    aircraft_types: string[];
  };
  qualifications_snapshot?: {
    license_type: string;
    medical_class: string;
    medical_expiry: string;
    ratings: string[];
  };
}

const STATUS_CONFIG = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  CAAP_REDIRECTED: { color: 'bg-blue-100 text-blue-800', icon: Plane, label: 'CAAP Redirected' },
  ATO_RESPONDED: { color: 'bg-purple-100 text-purple-800', icon: FileText, label: 'ATO Responded' },
  VERIFIED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Verified' },
  REJECTED: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Rejected' },
};

export default function EnterpriseVerificationDashboard() {
  const { user, isAuthenticated } = useAuth0();
  const [directives, setDirectives] = useState<VerificationDirective[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'QUALIFICATIONS' | 'FLIGHT_HOURS'>('ALL');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDirectives();
    }
  }, [isAuthenticated]);

  const { callApi } = useWorkerAuth();

  const fetchDirectives = async () => {
    try {
      const rows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'verification_directives',
        operation: 'select',
        limit: 50,
      });
      const data = (rows || []).sort((a: any, b: any) => {
        const ia = a.initiated_at || '';
        const ib = b.initiated_at || '';
        return ib.localeCompare(ia);
      });
      setDirectives(data as any);
    } finally {
      setLoading(false);
    }
  };

  const filteredDirectives = filter === 'ALL' 
    ? directives 
    : directives.filter(d => d.directive_type === filter);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
        {/* Coded by Benjamin Bowler */}
      <TopNavbar 
        onNavigate={(page) => console.log(page)} 
        onLogin={() => {}} 
        forceScrolled={true} 
        isLight={true} 
      />

      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Verification Directive Tracking
            </h1>
          </div>
          <p className="text-slate-600">
            Real-time visibility into CAAP-redirected Flight Directives and verification receipts 
            for pilots in your recruitment pipeline.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Total Directives</p>
            <p className="text-2xl font-bold text-slate-900">{directives.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">CAAP Redirected</p>
            <p className="text-2xl font-bold text-blue-600">
              {directives.filter(d => d.status === 'CAAP_REDIRECTED').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {directives.filter(d => d.status === 'VERIFIED').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Pending Response</p>
            <p className="text-2xl font-bold text-yellow-600">
              {directives.filter(d => d.status === 'ATO_RESPONDED').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['ALL', 'QUALIFICATIONS', 'FLIGHT_HOURS'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === f 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All Directives' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Directive List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading directives...</div>
          ) : filteredDirectives.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No verification directives found.
            </div>
          ) : (
            filteredDirectives.map((directive) => {
              const statusConfig = STATUS_CONFIG[directive.status];
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedId === directive.id;

              return (
                <div 
                  key={directive.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Header Row */}
                  <div 
                    onClick={() => toggleExpand(directive.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${statusConfig.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{directive.pilot_name}</p>
                        <p className="text-sm text-slate-500">
                          {directive.directive_type === 'QUALIFICATIONS' 
                            ? 'License & Medical Verification' 
                            : 'Flight Hours & Seat Time Validation'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="text-right">
                        <p className="font-medium text-slate-700">{directive.ato_name}</p>
                        <p className="text-xs">ATO</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs">{directive.caap_ref}</p>
                        <p className="text-xs">CAAP Ref</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 p-4 bg-slate-50">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Timeline */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Directive Timeline
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Initiated</span>
                              <span className="font-mono text-slate-900">
                                {new Date(directive.initiated_at).toLocaleString()}
                              </span>
                            </div>
                            {directive.caap_redirected_at && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">CAAP Redirected</span>
                                <span className="font-mono text-blue-700">
                                  {new Date(directive.caap_redirected_at).toLocaleString()}
                                </span>
                              </div>
                            )}
                            {directive.ato_responded_at && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">ATO Responded</span>
                                <span className="font-mono text-purple-700">
                                  {new Date(directive.ato_responded_at).toLocaleString()}
                                </span>
                              </div>
                            )}
                            {directive.verified_at && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">Verified</span>
                                <span className="font-mono text-green-700">
                                  {new Date(directive.verified_at).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Verification Receipt */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Verification Receipt
                          </h4>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-slate-900">
                                Cryptographic Hash Verified
                              </span>
                            </div>
                            <code className="block text-xs font-mono text-slate-600 break-all">
                              {directive.verification_hash}
                            </code>
                          </div>
                          {directive.qualifications_snapshot && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-slate-700 mb-1">
                                License: {directive.qualifications_snapshot.license_type}
                              </p>
                              <p className="text-sm text-slate-600">
                                Medical: {directive.qualifications_snapshot.medical_class} — 
                                Expires {directive.qualifications_snapshot.medical_expiry}
                              </p>
                              <p className="text-sm text-slate-600">
                                Ratings: {directive.qualifications_snapshot.ratings.join(', ')}
                              </p>
                            </div>
                          )}
                          {directive.seat_hours_breakdown && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-slate-700 mb-1">
                                Total Hours: {directive.seat_hours_breakdown.total_hours}
                              </p>
                              <p className="text-sm text-slate-600">
                                PIC: {directive.seat_hours_breakdown.pic_hours} / 
                                SIC: {directive.seat_hours_breakdown.sic_hours}
                              </p>
                              <p className="text-sm text-slate-600">
                                Aircraft: {directive.seat_hours_breakdown.aircraft_types.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          View Full Pilot Profile
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                          <FileText className="w-4 h-4" />
                          Download Verification PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
