import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plane, Check, Building2, Filter, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '@/shared/lib/supabase';

interface AirlineSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (selectedAirlines: string[]) => void;
  resumeData?: any;
}

interface EnterpriseAccount {
  id: string;
  airline_name: string;
  airline_iata_code: string;
  airline_logo_url: string;
  country: string;
  base_locations: string[];
  account_type: string;
  is_active: boolean;
  fleet_information?: any;
}

const AIRLINE_LIST = [
  'ANA All Nippon','Aegean Airlines','Aeromexico','Air Canada','Air China',
  'Air France','Air India','Air India Express','Asiana Airlines','Austrian Airlines',
  'Avianca','Biman Bangladesh','British Airways','Brussels Airlines','Cathay Dragon',
  'Cathay Pacific','Cebu Pacific','China Eastern','China Southern','Copa Airlines',
  'Czech Airlines','Delta Air Lines','EgyptAir','El Al Israel','Ethiopian Airlines',
  'Etihad Airways','Emirates','Finnair','GOL Linhas','Garuda Indonesia',
  'HK Express','Iberia','ITA Airways','Icelandair','IndiGo',
  'Japan Airlines','JetBlue Airways','Jetstar Asia','KLM','Korean Air',
  'LOT Polish','LATAM Airlines','Lufthansa','Malaysia Airlines','Nepal Airlines',
  'Norwegian','Oman Air','Peach Aviation','Philippine Airlines','Qantas',
  'Qatar Airways','Royal Jordanian','SAS Scandinavian','Saudia','Scoot',
  'Singapore Airlines','South African Airways','Southwest Airlines','SpiceJet',
  'Spring Airlines','SriLankan Airlines','Swiss International','TAP Portugal',
  'Thai Airways','Turkish Airlines','United Airlines','Vietnam Airlines',
  'Virgin Australia','WestJet','Alaska Airlines','American Airlines',
  'Other / Not listed',
].sort();

const AirlineSelectionModal: React.FC<AirlineSelectionModalProps> = ({
  isOpen,
  onClose,
  onShare,
  resumeData
}) => {
  const [enterpriseAirlines, setEnterpriseAirlines] = useState<EnterpriseAccount[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showRecommended, setShowRecommended] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadEnterpriseAirlines();
    }
  }, [isOpen]);

  const loadEnterpriseAirlines = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enterprise_accounts')
        .select('*')
        .eq('is_active', true)
        .order('airline_name');

      if (error) throw error;
      setEnterpriseAirlines(data || []);
    } catch (err) {
      console.error('Error loading airlines:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAirline = (airlineId: string) => {
    const newSelected = new Set(selectedAirlines);
    if (newSelected.has(airlineId)) {
      newSelected.delete(airlineId);
    } else {
      newSelected.add(airlineId);
    }
    setSelectedAirlines(newSelected);
  };

  const toggleAll = () => {
    const filtered = getFilteredAirlines();
    if (selectedAirlines.size === filtered.length) {
      setSelectedAirlines(new Set());
    } else {
      setSelectedAirlines(new Set(filtered.map(a => a.id)));
    }
  };

  const getFilteredAirlines = () => {
    let filtered = enterpriseAirlines;

    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.airline_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.airline_iata_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCountry !== 'all') {
      filtered = filtered.filter(a => a.country === filterCountry);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.account_type === filterType);
    }

    return filtered;
  };

  const getRecommendedAirlines = () => {
    if (!resumeData) return [];
    
    const recommendations = enterpriseAirlines.filter(airline => {
      // Recommend based on aircraft types in resume
      if (resumeData.aircraftTypes && resumeData.aircraftTypes.length > 0) {
        const aircraftTypes = resumeData.aircraftTypes.map((at: any) => 
          at.manufacturer?.toLowerCase() + ' ' + at.model?.toLowerCase()
        );
        const airlineFleet = airline.fleet_information as any;
        if (airlineFleet?.aircraft_types) {
          const hasMatchingAircraft = aircraftTypes.some((type: string) =>
            airlineFleet.aircraft_types.some((fa: any) =>
              fa.toLowerCase().includes(type) || type.includes(fa.toLowerCase())
            )
          );
          if (hasMatchingAircraft) return true;
        }
      }
      
      // Recommend based on target role
      if (resumeData.targetRole === 'commercial' && airline.account_type === 'airline') {
        return true;
      }
      if (resumeData.targetRole === 'cargo' && airline.account_type === 'airline') {
        return airline.airline_name.toLowerCase().includes('cargo') || 
               airline.airline_name.toLowerCase().includes('freight');
      }
      
      return false;
    });

    return recommendations.slice(0, 5);
  };

  const countries = Array.from(new Set(enterpriseAirlines.map(a => a.country))).sort();
  const accountTypes = Array.from(new Set(enterpriseAirlines.map(a => a.account_type))).sort();
  const filteredAirlines = getFilteredAirlines();
  const recommendedAirlines = getRecommendedAirlines();

  const handleShare = async () => {
    setSharing(true);
    try {
      await onShare(Array.from(selectedAirlines));
      setSelectedAirlines(new Set());
      onClose();
    } catch (err) {
      console.error('Error sharing resume:', err);
    } finally {
      setSharing(false);
    }
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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Plane className="w-6 h-6" />
                  Share with Airlines
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Select airlines to share your Atlas Résumé with
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search airlines..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={filterCountry}
                onChange={e => setFilterCountry(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {accountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAll}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {selectedAirlines.size === filteredAirlines.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-slate-500 text-sm">
                  {selectedAirlines.size} selected
                </span>
              </div>
              {recommendedAirlines.length > 0 && (
                <button
                  onClick={() => setShowRecommended(!showRecommended)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  <Filter className="w-4 h-4" />
                  {showRecommended ? 'Show All' : 'Show Recommended'}
                </button>
              )}
            </div>
          </div>

          {/* Airline List */}
          <div className="overflow-y-auto max-h-[500px] p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : showRecommended && recommendedAirlines.length > 0 ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-700 bg-purple-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    Recommended for you based on your aircraft experience
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {recommendedAirlines.map(airline => (
                    <AirlineCard
                      key={airline.id}
                      airline={airline}
                      selected={selectedAirlines.has(airline.id)}
                      onToggle={() => toggleAirline(airline.id)}
                    />
                  ))}
                </div>
              </>
            ) : filteredAirlines.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No airlines found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredAirlines.map(airline => (
                  <AirlineCard
                    key={airline.id}
                    airline={airline}
                    selected={selectedAirlines.has(airline.id)}
                    onToggle={() => toggleAirline(airline.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Sharing with <span className="font-semibold text-slate-900">{selectedAirlines.size}</span> airline{selectedAirlines.size !== 1 ? 's' : ''}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  disabled={selectedAirlines.size === 0 || sharing}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sharing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      Share Résumé
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface AirlineCardProps {
  airline: EnterpriseAccount;
  selected: boolean;
  onToggle: () => void;
}

const AirlineCard: React.FC<AirlineCardProps> = ({ airline, selected, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          {airline.airline_logo_url ? (
            <img
              src={airline.airline_logo_url}
              alt={airline.airline_name}
              className="w-10 h-10 object-contain rounded-lg"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 truncate">{airline.airline_name}</p>
            {airline.airline_iata_code && (
              <p className="text-xs text-slate-500">{airline.airline_iata_code}</p>
            )}
          </div>
        </div>
        {selected && (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="capitalize">{airline.account_type}</span>
        <span>•</span>
        <span>{airline.country}</span>
      </div>
    </button>
  );
};

export default AirlineSelectionModal;
