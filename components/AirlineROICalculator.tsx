/**
 * AirlineROICalculator Component
 * 
 * Interactive ROI calculator for airlines to estimate partnership benefits
 */

import React, { useState } from 'react';
import { Calculator, TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

interface ROICalculatorProps {
  isEmbedded?: boolean;
}

export const AirlineROICalculator: React.FC<ROICalculatorProps> = ({ isEmbedded = false }) => {
  const [annualHires, setAnnualHires] = useState(50);
  const [currentCostPerHire, setCurrentCostPerHire] = useState(20000);
  const [currentTimeToHire, setCurrentTimeToHire] = useState(9);
  const [currentRetentionRate, setCurrentRetentionRate] = useState(72);
  const [partnershipModel, setPartnershipModel] = useState<'standard' | 'premium' | 'strategic'>('premium');

  const partnershipCosts = {
    standard: 0,
    premium: 180000, // $15,000/month * 12
    strategic: 0, // Revenue share model
  };

  const perHireFees = {
    standard: 3000,
    premium: 1500,
    strategic: 0, // Revenue share
  };

  const calculateROI = () => {
    const cost = partnershipCosts[partnershipModel];
    const perHireFee = perHireFees[partnershipModel];
    
    // Cost savings from reduced cost-per-hire (40% reduction)
    const newCostPerHire = currentCostPerHire * 0.6;
    const costPerHireSavings = (currentCostPerHire - newCostPerHire) * annualHires;
    
    // Cost savings from reduced time-to-hire (60% reduction)
    const newTimeToHire = currentTimeToHire * 0.4;
    const timeSavingsPerHire = (currentTimeToHire - newTimeToHire) * 160; // $100/hour recruiter time
    const timeSavings = timeSavingsPerHire * annualHires;
    
    // Cost savings from improved retention (15% improvement)
    const newRetentionRate = Math.min(currentRetentionRate + 15, 95);
    const turnoverReduction = (newRetentionRate - currentRetentionRate) / 100;
    const replacementCostSavings = annualHires * turnoverReduction * currentCostPerHire;
    
    // Partnership fees
    const partnershipFees = (cost) + (annualHires * perHireFee);
    
    // Strategic model: revenue share (20% of placement value)
    let strategicRevenue = 0;
    if (partnershipModel === 'strategic') {
      const avgPilotSalary = 120000;
      const placementValue = avgPilotSalary * 0.5; // 50% of first-year salary
      strategicRevenue = annualHires * placementValue * 0.2;
    }
    
    const totalSavings = costPerHireSavings + timeSavings + replacementCostSavings;
    const totalCost = partnershipFees - strategicRevenue;
    const netROI = totalSavings - totalCost;
    const roiPercentage = totalCost > 0 ? ((netROI / totalCost) * 100) : 0;
    
    return {
      cost,
      perHireFee,
      costPerHireSavings,
      timeSavings,
      replacementCostSavings,
      totalSavings,
      partnershipFees,
      strategicRevenue,
      totalCost,
      netROI,
      roiPercentage,
      newCostPerHire,
      newTimeToHire,
      newRetentionRate,
    };
  };

  const roi = calculateROI();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${isEmbedded ? '' : 'p-8'}`}>
      {!isEmbedded && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Airline ROI Calculator</h2>
          </div>
          <p className="text-gray-600">
            Estimate the financial benefits of partnering with Atlas Aviation for pilot recruitment
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Metrics</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Pilot Hires
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={annualHires}
              onChange={(e) => setAnnualHires(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>10</span>
              <span className="font-semibold text-blue-600">{annualHires}</span>
              <span>200</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Cost Per Hire
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={currentCostPerHire}
                onChange={(e) => setCurrentCostPerHire(parseInt(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="5000"
                max="50000"
                step="1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Time-to-Hire (months)
            </label>
            <input
              type="range"
              min="3"
              max="18"
              step="1"
              value={currentTimeToHire}
              onChange={(e) => setCurrentTimeToHire(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>3 mo</span>
              <span className="font-semibold text-blue-600">{currentTimeToHire} mo</span>
              <span>18 mo</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current First-Year Retention Rate
            </label>
            <input
              type="range"
              min="50"
              max="90"
              step="1"
              value={currentRetentionRate}
              onChange={(e) => setCurrentRetentionRate(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>50%</span>
              <span className="font-semibold text-blue-600">{currentRetentionRate}%</span>
              <span>90%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partnership Model
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['standard', 'premium', 'strategic'] as const).map((model) => (
                <button
                  key={model}
                  onClick={() => setPartnershipModel(model)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    partnershipModel === model
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <div className="text-xs uppercase mb-1">{model}</div>
                  <div className="text-sm font-semibold">
                    {model === 'standard' ? '$3K/hire' : model === 'premium' ? '$15K/mo+$1.5K/hire' : 'Rev Share'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projected Savings</h3>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Net Annual Savings</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(roi.netROI)}
            </div>
            <div className={`text-sm font-semibold mt-1 ${roi.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roi.roiPercentage >= 0 ? '+' : ''}{roi.roiPercentage.toFixed(0)}% ROI
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Cost-Per-Hire Savings</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(roi.costPerHireSavings)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                40% reduction from {formatCurrency(currentCostPerHire)} to {formatCurrency(roi.newCostPerHire)}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Time Savings</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(roi.timeSavings)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                60% faster hiring from {currentTimeToHire} to {roi.newTimeToHire.toFixed(1)} months
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Retention Savings</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(roi.replacementCostSavings)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                15% retention improvement from {currentRetentionRate}% to {roi.newRetentionRate.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Partnership Cost</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(roi.totalCost)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Savings</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(roi.totalSavings)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Improvements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(roi.newCostPerHire)}
            </div>
            <div className="text-sm text-gray-600 mt-1">New Cost Per Hire</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {roi.newTimeToHire.toFixed(1)} mo
            </div>
            <div className="text-sm text-gray-600 mt-1">New Time-to-Hire</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {roi.newRetentionRate.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">New Retention Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
