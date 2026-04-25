/**
 * Market Intelligence Dashboard Component
 * 
 * Displays comprehensive market intelligence data including:
 * - Market health indicators
 * - Geographic demand heatmap
 * - Salary trends
 * - Industry trends
 * - Top opportunities
 */

import React, { useState, useEffect } from 'react';

interface MarketHealthIndicator {
  indicator: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
}

interface GeographicDemandData {
  region: string;
  demand: number;
  growth: number;
  averageSalary: string;
  competition: 'low' | 'medium' | 'high';
}

interface IndustryTrend {
  trend: string;
  impact: 'high' | 'medium' | 'low';
  status: 'emerging' | 'growing' | 'mature' | 'declining';
  description: string;
  opportunities: string[];
}

interface MarketIntelligenceData {
  overallMarketHealth: number;
  healthIndicators: MarketHealthIndicator[];
  geographicDemand: GeographicDemandData[];
  industryTrends: IndustryTrend[];
  topOpportunities: any[];
  recommendations: string[];
}

export const MarketIntelligenceDashboard: React.FC = () => {
  const [data, setData] = useState<MarketIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'geographic' | 'trends' | 'opportunities'>('overview');

  useEffect(() => {
    fetchMarketIntelligence();
  }, []);

  const fetchMarketIntelligence = async () => {
    try {
      // In production, this would call the API
      // const response = await fetch('/api/market/intelligence');
      // const data = await response.json();
      
      // For now, use mock data
      const mockData: MarketIntelligenceData = {
        overallMarketHealth: 78,
        healthIndicators: [
          { indicator: 'Pilot Shortage Index', value: 85, trend: 'up', change: 5, description: 'Global shortage intensifying' },
          { indicator: 'Fleet Expansion Rate', value: 72, trend: 'up', change: 8, description: 'Airlines expanding fleets' },
          { indicator: 'Hiring Activity', value: 88, trend: 'up', change: 12, description: 'Strong hiring activity' },
          { indicator: 'Salary Growth', value: 68, trend: 'up', change: 6, description: 'Healthy salary growth' },
        ],
        geographicDemand: [
          { region: 'Asia Pacific', demand: 92, growth: 15, averageSalary: '$85,000 - $180,000', competition: 'low' },
          { region: 'Middle East', demand: 88, growth: 12, averageSalary: '$95,000 - $200,000', competition: 'medium' },
          { region: 'North America', demand: 75, growth: 6, averageSalary: '$80,000 - $160,000', competition: 'high' },
          { region: 'Europe', demand: 68, growth: 4, averageSalary: '$70,000 - $140,000', competition: 'high' },
        ],
        industryTrends: [
          { trend: 'Urban Air Mobility', impact: 'high', status: 'emerging', description: 'eVTOL opportunities emerging', opportunities: ['Early certification', 'Technology training'] },
          { trend: 'Sustainable Aviation', impact: 'high', status: 'growing', description: 'Electric aircraft development', opportunities: ['Green certification', 'New aircraft types'] },
          { trend: 'Asia Pacific Expansion', impact: 'high', status: 'growing', description: 'Massive demand in Asia', opportunities: ['International careers', 'Language skills'] },
        ],
        topOpportunities: [
          { opportunity: 'Asia Pacific First Officer', region: 'Asia Pacific', urgency: 'high', description: 'Massive hiring surge' },
          { opportunity: 'Middle East Captain', region: 'Middle East', urgency: 'high', description: 'Premium compensation' },
          { opportunity: 'Cargo Aviation', region: 'Global', urgency: 'medium', description: 'E-commerce growth' },
        ],
        recommendations: [
          'Leverage pilot shortage for career advancement',
          'Consider opportunities in Asia Pacific',
          'Prepare for sustainable aviation trends',
        ]
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Failed to fetch market intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading market intelligence...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Failed to load market intelligence</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Market Intelligence Dashboard</h2>
        <p className="text-blue-100">Real-time aviation job market insights and analytics</p>
      </div>

      {/* Overall Market Health */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Overall Market Health</h3>
          <span className={`text-3xl font-bold ${data.overallMarketHealth > 70 ? 'text-green-600' : data.overallMarketHealth > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {data.overallMarketHealth}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${data.overallMarketHealth > 70 ? 'bg-green-600' : data.overallMarketHealth > 50 ? 'bg-yellow-600' : 'text-red-600'}`}
            style={{ width: `${data.overallMarketHealth}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'geographic', 'trends', 'opportunities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Health Indicators */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Market Health Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.healthIndicators.map((indicator, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{indicator.indicator}</span>
                    <span className={`text-sm ${indicator.trend === 'up' ? 'text-green-600' : indicator.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      {indicator.trend === 'up' ? '↑' : indicator.trend === 'down' ? '↓' : '→'} {indicator.change}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${indicator.value}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{indicator.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Market Recommendations</h3>
            <ul className="space-y-2">
              {data.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedTab === 'geographic' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Geographic Demand Analysis</h3>
          <div className="space-y-4">
            {data.geographicDemand.map((region, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg">{region.region}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    region.competition === 'low' ? 'bg-green-100 text-green-800' :
                    region.competition === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {region.competition} competition
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Demand</span>
                    <div className="text-2xl font-bold text-blue-600">{region.demand}%</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Growth</span>
                    <div className="text-2xl font-bold text-green-600">+{region.growth}%</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Avg Salary</span>
                    <div className="text-sm font-semibold text-gray-800">{region.averageSalary}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${region.demand}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'trends' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Industry Trends</h3>
          <div className="space-y-4">
            {data.industryTrends.map((trend, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg">{trend.trend}</span>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trend.impact === 'high' ? 'bg-red-100 text-red-800' :
                      trend.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {trend.impact} impact
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trend.status === 'emerging' ? 'bg-blue-100 text-blue-800' :
                      trend.status === 'growing' ? 'bg-green-100 text-green-800' :
                      trend.status === 'mature' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {trend.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{trend.description}</p>
                <div>
                  <span className="text-sm font-medium text-gray-700">Opportunities:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {trend.opportunities.map((opp, oppIndex) => (
                      <span key={oppIndex} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                        {opp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'opportunities' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Opportunities</h3>
          <div className="space-y-4">
            {data.topOpportunities.map((opp, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg">{opp.opportunity}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    opp.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    opp.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {opp.urgency} urgency
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Region:</span> {opp.region}
                </div>
                <p className="text-gray-700">{opp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
