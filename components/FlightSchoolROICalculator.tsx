/**
 * FlightSchoolROICalculator Component
 * 
 * Interactive ROI calculator for flight schools to estimate partnership benefits
 */

import React, { useState } from 'react';
import { Calculator, TrendingUp, Users, DollarSign, Award } from 'lucide-react';

interface ROICalculatorProps {
  isEmbedded?: boolean;
}

export const FlightSchoolROICalculator: React.FC<ROICalculatorProps> = ({ isEmbedded = false }) => {
  const [studentCount, setStudentCount] = useState(200);
  const [currentPlacementRate, setCurrentPlacementRate] = useState(18);
  const [targetPlacementRate, setTargetPlacementRate] = useState(40);
  const [avgTuition, setAvgTuition] = useState(75000);
  const [partnershipTier, setPartnershipTier] = useState<'basic' | 'premium' | 'strategic'>('premium');

  const partnershipCosts = {
    basic: 0,
    premium: 30000, // $2,500/month * 12
    strategic: 50000, // Custom pricing
  };

  const subscriptionRevenueShare = {
    basic: 0,
    premium: 0.15,
    strategic: 0.25,
  };

  const placementSuccessFee = {
    basic: 0,
    premium: 500,
    strategic: 1000,
  };

  const calculateROI = () => {
    const cost = partnershipCosts[partnershipTier];
    
    // Revenue from subscription sharing
    const subscriptionRevenue = studentCount * 50 * 12 * subscriptionRevenueShare[partnershipTier]; // $50/month avg subscription
    
    // Revenue from placement success fees
    const additionalPlacements = Math.floor(
      studentCount * ((targetPlacementRate - currentPlacementRate) / 100)
    );
    const placementRevenue = additionalPlacements * placementSuccessFee[partnershipTier];
    
    // Revenue from increased enrollment (10% increase due to better placement outcomes)
    const enrollmentIncrease = Math.floor(studentCount * 0.1);
    const enrollmentRevenue = enrollmentIncrease * avgTuition;
    
    const totalRevenue = subscriptionRevenue + placementRevenue + enrollmentRevenue;
    const netROI = totalRevenue - cost;
    const roiPercentage = cost > 0 ? ((netROI / cost) * 100) : 0;
    
    return {
      cost,
      subscriptionRevenue,
      placementRevenue,
      enrollmentRevenue,
      totalRevenue,
      netROI,
      roiPercentage,
      additionalPlacements,
      enrollmentIncrease,
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
            <h2 className="text-2xl font-bold text-gray-900">Flight School ROI Calculator</h2>
          </div>
          <p className="text-gray-600">
            Estimate the financial benefits of partnering with Atlas Aviation
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Active Students
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={studentCount}
              onChange={(e) => setStudentCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>50</span>
              <span className="font-semibold text-blue-600">{studentCount}</span>
              <span>1,000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Placement Rate (6 months)
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={currentPlacementRate}
              onChange={(e) => setCurrentPlacementRate(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>5%</span>
              <span className="font-semibold text-blue-600">{currentPlacementRate}%</span>
              <span>50%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Placement Rate with Atlas
            </label>
            <input
              type="range"
              min="20"
              max="70"
              step="5"
              value={targetPlacementRate}
              onChange={(e) => setTargetPlacementRate(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>20%</span>
              <span className="font-semibold text-blue-600">{targetPlacementRate}%</span>
              <span>70%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Tuition per Student
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={avgTuition}
                onChange={(e) => setAvgTuition(parseInt(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10000"
                max="200000"
                step="5000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partnership Tier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['basic', 'premium', 'strategic'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setPartnershipTier(tier)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    partnershipTier === tier
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <div className="text-xs uppercase mb-1">{tier}</div>
                  <div className="text-sm font-semibold">
                    {tier === 'basic' ? 'Free' : tier === 'premium' ? '$30K/yr' : '$50K/yr'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projected Benefits</h3>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Net Annual ROI</span>
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
                <span className="font-medium text-gray-900">Subscription Revenue Share</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(roi.subscriptionRevenue)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {subscriptionRevenueShare[partnershipTier] * 100}% of {studentCount} student subscriptions
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Placement Success Fees</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(roi.placementRevenue)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {roi.additionalPlacements} additional placements × ${placementSuccessFee[partnershipTier]}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Increased Enrollment Revenue</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(roi.enrollmentRevenue)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {roi.enrollmentIncrease} additional students × {formatCurrency(avgTuition)} tuition
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Partnership Cost</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(roi.cost)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(roi.totalRevenue)}
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
              +{targetPlacementRate - currentPlacementRate}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Placement Rate Improvement</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {roi.additionalPlacements}
            </div>
            <div className="text-sm text-gray-600 mt-1">Additional Placements</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {roi.enrollmentIncrease}
            </div>
            <div className="text-sm text-gray-600 mt-1">Additional Students</div>
          </div>
        </div>
      </div>
    </div>
  );
};
