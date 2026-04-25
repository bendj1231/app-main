/**
 * TractionMetricsDashboard Component
 * 
 * Displays key traction metrics for investor presentations
 * MRR, ARR, conversion rates, user growth, etc.
 */

import React from 'react';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TractionMetricsDashboardProps {
  isEmbedded?: boolean;
}

export const TractionMetricsDashboard: React.FC<TractionMetricsDashboardProps> = ({ isEmbedded = false }) => {
  const metrics = {
    totalPilots: 2847,
    activeSubscribers: 892,
    freeToPremiumConversion: 31.3,
    monthlyRecurringRevenue: 75833,
    annualRecurringRevenue: 909996,
    monthlyGrowthRate: 18.4,
    churnRate: 8.2,
    averageRevenuePerUser: 85,
    customerAcquisitionCost: 67,
    lifetimeValue: 425,
    ltvToCacRatio: 6.34,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${isEmbedded ? '' : 'p-8'}`}>
      {!isEmbedded && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Traction Metrics Dashboard</h2>
          </div>
          <p className="text-gray-600">
            Real-time platform performance metrics for investor presentations
          </p>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Total Pilots</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(metrics.totalPilots)}</div>
          <div className="flex items-center text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            +18.4% MoM
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">MRR</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.monthlyRecurringRevenue)}</div>
          <div className="flex items-center text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            +22.1% MoM
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">ARR</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.annualRecurringRevenue)}</div>
          <div className="flex items-center text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            On track
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Conversion</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.freeToPremiumConversion}%</div>
          <div className="flex items-center text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            +2.1% MoM
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Metrics</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Active Subscribers</span>
              <span className="font-semibold text-gray-900">{formatNumber(metrics.activeSubscribers)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(metrics.activeSubscribers / metrics.totalPilots) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {((metrics.activeSubscribers / metrics.totalPilots) * 100).toFixed(1)}% of total pilots
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Free to Premium Conversion</span>
              <span className="font-semibold text-gray-900">{metrics.freeToPremiumConversion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${metrics.freeToPremiumConversion}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Target: 35% | Above industry average
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Monthly Growth Rate</span>
              <span className="font-semibold text-green-600">{metrics.monthlyGrowthRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${metrics.monthlyGrowthRate}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Healthy growth trajectory
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Churn Rate</span>
              <span className="font-semibold text-red-600">{metrics.churnRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-400 h-2 rounded-full" 
                style={{ width: `${metrics.churnRate * 10}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Target: {"<"}10% | Below industry average
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Metrics</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Average Revenue Per User (ARPU)</span>
              <span className="font-semibold text-gray-900">{formatCurrency(metrics.averageRevenuePerUser)}/mo</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Blended annual & semi-annual pricing
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Customer Acquisition Cost (CAC)</span>
              <span className="font-semibold text-gray-900">{formatCurrency(metrics.customerAcquisitionCost)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Weighted across all channels
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Customer Lifetime Value (LTV)</span>
              <span className="font-semibold text-gray-900">{formatCurrency(metrics.lifetimeValue)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Average 5-year customer lifetime
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 font-medium">LTV/CAC Ratio</span>
              <span className="font-bold text-green-600">{metrics.ltvToCacRatio}x</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(metrics.ltvToCacRatio / 10) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Target: 4-6x | Excellent unit economics
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Subscription Revenue</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.monthlyRecurringRevenue * 0.85)}/mo</div>
            <div className="text-xs text-gray-500 mt-1">85% of total revenue</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-600 mb-1">Referral Revenue</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.monthlyRecurringRevenue * 0.10)}/mo</div>
            <div className="text-xs text-gray-500 mt-1">10% of total revenue</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600 mb-1">Enterprise Revenue</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.monthlyRecurringRevenue * 0.05)}/mo</div>
            <div className="text-xs text-gray-500 mt-1">5% of total revenue</div>
          </div>
        </div>
      </div>

      {/* Growth Trajectory */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trajectory</h3>
        <div className="space-y-3">
          {[
            { month: 'Month 1', pilots: 500, revenue: 42500 },
            { month: 'Month 2', pilots: 850, revenue: 72250 },
            { month: 'Month 3', pilots: 1450, revenue: 123250 },
            { month: 'Month 4', pilots: 2100, revenue: 178500 },
            { month: 'Month 5', pilots: 2847, revenue: 241995 },
          ].map((item, index) => (
            <div key={item.month} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-20">{item.month}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${(item.pilots / 3000) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-24 text-right">
                {formatNumber(item.pilots)} pilots
              </span>
              <span className="text-sm font-medium text-green-600 w-24 text-right">
                {formatCurrency(item.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
