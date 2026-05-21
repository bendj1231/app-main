'use client';

import React, { useState } from 'react';

export default function EnterpriseAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  
  // Mock data for the dashboard
  const stats = {
    totalPilots: 1247,
    newThisMonth: 89,
    avgRecognitionScore: 67,
    pathwaysPublished: 12,
    interestSubmissions: 156,
    verifiedProfiles: 423
  };

  const topPathways = [
    { name: 'Etihad Cadet Program 2026', interest: 45, avgScore: 72, conversion: '8%' },
    { name: 'FedEx First Officer - 767', interest: 38, avgScore: 78, conversion: '12%' },
    { name: 'VistaJet Corporate Pilot', interest: 32, avgScore: 85, conversion: '15%' },
    { name: 'Dubai Credential - Philippines', interest: 28, avgScore: 45, conversion: '22%' }
  ];

  const pilotPoolBreakdown = [
    { category: '0-500 hours', count: 312, percentage: 25 },
    { category: '500-1500 hours', count: 534, percentage: 43 },
    { category: '1500-3000 hours', count: 289, percentage: 23 },
    { category: '3000+ hours', count: 112, percentage: 9 }
  ];

  return (
        {/* Coded by Benjamin Bowler */}
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enterprise Analytics</h1>
              <p className="text-sm text-gray-500 mt-1">Real-time insights into your pilot pipeline</p>
            </div>
            <div className="flex gap-2">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Pilots</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPilots}</p>
            <p className="text-xs text-green-600 mt-1">+{stats.newThisMonth} this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg Recognition Score</p>
            <p className="text-3xl font-bold text-gray-900">{stats.avgRecognitionScore}</p>
            <p className="text-xs text-gray-500 mt-1">out of 100</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Pathways Published</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pathwaysPublished}</p>
            <p className="text-xs text-blue-600 mt-1">3 new this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Interest Submissions</p>
            <p className="text-3xl font-bold text-gray-900">{stats.interestSubmissions}</p>
            <p className="text-xs text-green-600 mt-1">+23% vs last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Verified Profiles</p>
            <p className="text-3xl font-bold text-gray-900">{stats.verifiedProfiles}</p>
            <p className="text-xs text-gray-500 mt-1">34% of pool</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-gray-900">12.4%</p>
            <p className="text-xs text-green-600 mt-1">+2.1% vs last month</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Pathways */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Top Performing Pathways</h2>
              <p className="text-sm text-gray-500">By interest submissions and conversion</p>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">Pathway Name</th>
                    <th className="pb-3 font-medium text-center">Interest</th>
                    <th className="pb-3 font-medium text-center">Avg Score</th>
                    <th className="pb-3 font-medium text-center">Conversion</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {topPathways.map((pathway, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="py-4 font-medium text-gray-900">{pathway.name}</td>
                      <td className="py-4 text-center">{pathway.interest}</td>
                      <td className="py-4 text-center">
                        <span className={`font-semibold ${pathway.avgScore >= 80 ? 'text-green-600' : pathway.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {pathway.avgScore}
                        </span>
                      </td>
                      <td className="py-4 text-center text-green-600 font-medium">{pathway.conversion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pilot Pool Breakdown */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Pilot Pool by Hours</h2>
              <p className="text-sm text-gray-500">Experience distribution</p>
            </div>
            <div className="p-6">
              {pilotPoolBreakdown.map((item, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.category}</span>
                    <span className="font-medium text-gray-900">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recognition Score Distribution */}
        <div className="mt-8 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Recognition Score Distribution</h2>
            <p className="text-sm text-gray-500">Platinum (80+), Gold (60-79), Silver (40-59), Bronze (&lt;40)</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-300">Platinum</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
                <p className="text-sm text-gray-500">7% of pool</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">Gold</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">312</p>
                <p className="text-sm text-gray-500">25% of pool</p>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-2xl font-bold text-gray-500">Silver</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">534</p>
                <p className="text-sm text-gray-500">43% of pool</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">Bronze</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">312</p>
                <p className="text-sm text-gray-500">25% of pool</p>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="mt-8 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Geographic Distribution</h2>
            <p className="text-sm text-gray-500">Pilot location by region</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { region: 'Middle East', count: 412, growth: '+15%' },
                { region: 'Europe', count: 389, growth: '+8%' },
                { region: 'Asia-Pacific', count: 267, growth: '+22%' },
                { region: 'North America', count: 134, growth: '+5%' },
                { region: 'Africa', count: 45, growth: '+35%' }
              ].map((region, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900">{region.region}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{region.count}</p>
                  <p className="text-sm text-green-600">{region.growth}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
