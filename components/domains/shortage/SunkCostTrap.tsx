'use client';

import { AlertTriangle, Clock, XCircle } from 'lucide-react';

export default function SunkCostTrap() {
  const investments = [
    { name: 'CPL Training', expiry: 'N/A', refundable: 'No', highlight: false },
    { name: 'Type Rating (A320)', expiry: '6 months', refundable: 'No', highlight: true },
    { name: 'Medical Certificate', expiry: '1 year', refundable: 'No', highlight: true },
    { name: 'Hours Building', expiry: 'N/A', refundable: 'No', highlight: false },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-bold">The Investment Trap</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">The Sunk Cost Trap</h2>
            <p className="text-xl text-gray-400">
              $50,000–$200,000 invested. Expiring credentials. No ROI. No exit.
            </p>
          </div>

          {/* The Math */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-8">
            <div className="grid grid-cols-3 gap-4 text-center mb-8">
              <div>
                <div className="text-4xl font-bold text-[#c41e3a]">$50K</div>
                <div className="text-gray-400 text-sm">Minimum Investment</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#c41e3a]">$200K</div>
                <div className="text-gray-400 text-sm">Maximum Investment</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-500">0%</div>
                <div className="text-gray-400 text-sm">ROI</div>
              </div>
            </div>

            <p className="text-center text-gray-300 text-lg">
              Just a <span className="text-white font-bold">privilege</span> that costs everything
              and returns nothing.
            </p>
          </div>

          {/* The Table */}
          <div className="bg-white rounded-2xl text-gray-900 overflow-hidden">
            <div className="p-6 bg-gray-100 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#1e3a5f]">
                Every Investment. No Return. No Refund.
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {investments.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-6 flex items-center justify-between ${item.highlight ? 'bg-red-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    {item.highlight ? (
                      <Clock className="w-6 h-6 text-[#c41e3a]" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-400" />
                    )}
                    <span className="font-bold text-lg">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <div className="text-gray-500">Expires</div>
                      <div className={`font-bold ${item.highlight ? 'text-[#c41e3a]' : ''}`}>
                        {item.expiry}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500">Refundable?</div>
                      <div className="font-bold text-red-600">{item.refundable}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Tragedy */}
          <div className="mt-8 text-center">
            <p className="text-xl text-gray-300 mb-2">Type ratings expire every 6 months.</p>
            <p className="text-xl text-gray-300 mb-2">Medical certificates expire yearly.</p>
            <p className="text-xl text-gray-300 mb-4">
              <strong>Can't be refunded. Can't be given back.</strong>
            </p>
            <p className="text-2xl text-[#c41e3a] font-bold">
              The privilege keeps costing. Forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
