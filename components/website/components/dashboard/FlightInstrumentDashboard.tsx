/**
 * Flight Instrument Dashboard Component
 * 
 * Maps R-Formula components to actual flight instruments:
 * - Altimeter: Total Career Height (Total Hours vs. Goal)
 * - Airspeed: Current Momentum (Program completion speed)
 * - VSI: Score Trend (Profile score going up/down)
 * - Annunciator Panel: Warning lights for compliance
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import RFormulaEngine from '@/lib/r-formula-engine';
import { FlightInstrumentMetrics } from '@/lib/r-formula-engine';

interface FlightInstrumentDashboardProps {
  userId: string;
  className?: string;
}

const FlightInstrumentDashboard: React.FC<FlightInstrumentDashboardProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [metrics, setMetrics] = useState<FlightInstrumentMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [userId]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll generate mock metrics
      // In production, this would fetch from the database
      const engine = RFormulaEngine.getInstance();
      const mockProfile = {
        user_id: userId,
        total_flight_hours: 2500,
        pic_hours: 1200,
        multi_engine_hours: 800,
        instrument_hours: 600,
        night_hours: 400,
        last_flight_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        medical_expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        license_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        completed_programs: ['foundation_program', 'transition_program'],
        type_ratings: ['A320', 'B737'],
        behavioral_scores: {
          sjt_score: 85,
          psychometric_score: 78,
          cognitive_workload: 82,
          stress_management: 88,
          decision_making: 91,
          crm_assessment: 86
        },
        language_scores: {
          icao_level: 'Level 5',
          cultural_adaptability: 75,
          international_experience: true,
          cross_cultural_comm: 80
        },
        technical_skills: {
          weather_ops: 85,
          terrain_complexity: 72,
          emergency_procedures: 90,
          type_rating_diversity: 80,
          instrument_approaches: 88
        }
      };
      
      const generatedMetrics = await engine.generateFlightInstrumentMetrics(mockProfile);
      setMetrics(generatedMetrics);
    } catch (err) {
      setError('Failed to load flight instrument metrics');
      console.error('Error loading metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInstrumentIcon = (type: string) => {
    switch (type) {
      case 'altimeter':
        return <Target className="w-5 h-5" />;
      case 'airspeed':
        return <Activity className="w-5 h-5" />;
      case 'vsi':
        return <TrendingUp className="w-5 h-5" />;
      case 'annunciator':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getWarningColor = (level: string) => {
    switch (level) {
      case 'green':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'yellow':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'red':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      default:
        return 'text-slate-400 border-slate-400/30 bg-slate-400/10';
    }
  };

  const getInstrumentLabel = (type: string) => {
    switch (type) {
      case 'altimeter':
        return 'Career Altitude';
      case 'airspeed':
        return 'Progress Velocity';
      case 'vsi':
        return 'Score Trend';
      case 'annunciator':
        return 'System Status';
      default:
        return 'Unknown';
    }
  };

  const getInstrumentDescription = (type: string) => {
    switch (type) {
      case 'altimeter':
        return 'Total flight hours vs. career goal';
      case 'airspeed':
        return 'Program completion momentum';
      case 'vsi':
        return 'Recognition score trend';
      case 'annunciator':
        return 'Compliance & currency warnings';
      default:
        return 'Instrument reading';
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-none p-6 shadow-2xl shadow-black/50 ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">» FLIGHT INSTRUMENT DASHBOARD</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-none p-4 animate-pulse">
              <div className="h-4 bg-slate-700 rounded-none mb-2"></div>
              <div className="h-8 bg-slate-700 rounded-none mb-2"></div>
              <div className="h-3 bg-slate-700 rounded-none"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-none p-6 shadow-2xl shadow-black/50 ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">» FLIGHT INSTRUMENT DASHBOARD</h3>
        </div>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-none p-6 shadow-2xl shadow-black/50 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">» FLIGHT INSTRUMENT DASHBOARD</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.instrument_type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative bg-slate-900/50 border rounded-none p-4 overflow-hidden
              transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/70
              ${getWarningColor(metric.warning_level)}
            `}
          >
            {/* Instrument Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-current/10`}>
                  {getInstrumentIcon(metric.instrument_type)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">
                    {getInstrumentLabel(metric.instrument_type)}
                  </h4>
                  <p className="text-slate-400 text-xs">
                    {getInstrumentDescription(metric.instrument_type)}
                  </p>
                </div>
              </div>
              {getTrendIcon(metric.trend_direction)}
            </div>

            {/* Instrument Reading */}
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  {Math.round(metric.current_value)}
                </span>
                <span className="text-slate-400 text-sm">%</span>
                {metric.target_value && (
                  <span className="text-slate-500 text-xs">/ {metric.target_value}</span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-slate-800 rounded-none h-2">
                <div 
                  className={`h-2 rounded-none transition-all duration-500 ${
                    metric.warning_level === 'green' ? 'bg-green-400' :
                    metric.warning_level === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${metric.current_value}%` }}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {metric.trend_direction === 'up' && '+'}
                {metric.trend_percentage}%
              </span>
              <span className={`capitalize ${
                metric.warning_level === 'green' ? 'text-green-400' :
                metric.warning_level === 'yellow' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {metric.warning_level}
              </span>
            </div>

            {/* Specific Indicator Details */}
            {metric.instrument_type === 'annunciator' && metric.warning_level === 'red' && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <div className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-red-400">Attention required</span>
                </div>
              </div>
            )}

            {metric.instrument_type === 'altimeter' && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <div className="text-xs text-slate-400">
                  Career progression: {metric.current_value >= 80 ? 'On track' : 'Needs attention'}
                </div>
              </div>
            )}

            {metric.instrument_type === 'airspeed' && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <div className="text-xs text-slate-400">
                  Momentum: {metric.trend_direction === 'up' ? 'Accelerating' : 'Steady'}
                </div>
              </div>
            )}

            {metric.instrument_type === 'vsi' && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <div className="text-xs text-slate-400">
                  Score trend: {metric.trend_direction === 'up' ? 'Climbing' : metric.trend_direction === 'down' ? 'Descending' : 'Level'}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Dashboard Legend */}
      <div className="mt-6 p-4 bg-slate-900/30 border border-slate-700 rounded-none">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-bold">INSTRUMENT GUIDE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div>
            <strong className="text-white">Career Altitude:</strong> Total flight hours progress toward career goals
          </div>
          <div>
            <strong className="text-white">Progress Velocity:</strong> Speed of program completion and skill development
          </div>
          <div>
            <strong className="text-white">Score Trend:</strong> Recognition score trajectory over time
          </div>
          <div>
            <strong className="text-white">System Status:</strong> Medical, license, and currency compliance warnings
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightInstrumentDashboard;
