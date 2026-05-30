'use client';

// Region type (should match the one in ShortageApp)
type Region = {
  code: string;
  name: string;
  flag: string;
  currency: string;
  price: string;
};

interface ShortageLandingProps {
  region?: Region;
}

// Region-specific content
const getRegionContent = (region: Region) => {
  const contents: Record<string, { 
    tagline: string; 
    features: string[];
    paymentMethods: string;
  }> = {
    'en-ph': {
      tagline: 'Solving the Philippines Pilot Shortage',
      features: [
        'CAAP License Verification',
        'NBI Clearance Check',
        'Member Directory Access',
        'Direct Airline Pathways',
        'Community Forum'
      ],
      paymentMethods: 'GCash or Bank Transfer'
    },
    'en-us': {
      tagline: 'Solving the US Pilot Shortage',
      features: [
        'FAA License Verification',
        'Background Check',
        'Member Directory Access',
        'Direct Airline Pathways',
        'Community Forum'
      ],
      paymentMethods: 'Credit Card or PayPal'
    },
    'en-gb': {
      tagline: 'Solving the UK Pilot Shortage',
      features: [
        'CAA License Verification',
        'Background Check',
        'Member Directory Access',
        'Direct Airline Pathways',
        'Community Forum'
      ],
      paymentMethods: 'Credit Card or Direct Debit'
    },
    'default': {
      tagline: `Solving the ${region.name} Pilot Shortage`,
      features: [
        'License Verification',
        'Background Check',
        'Member Directory Access',
        'Direct Airline Pathways',
        'Community Forum'
      ],
      paymentMethods: 'Credit Card or Bank Transfer'
    }
  };
  
  return contents[region.code] || contents['default'];
};

export default function ShortageLanding({ region }: ShortageLandingProps) {
  const currentRegion = region || { code: 'en-ph', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', price: '₱1,500' };
  const content = getRegionContent(currentRegion);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-6">
          {currentRegion.flag} Global Pilot Shortage Initiative
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-black">The Pilot </span>
          <span className="text-red-500">Shortage</span>
          <span className="text-black"> Association</span>
        </h1>
        <p className="text-2xl md:text-3xl mb-4 text-gray-700">
          {content.tagline}
        </p>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-500">
          Join the global movement. Get verified. Get connected. Get hired.
        </p>
        
        {/* Pricing Card */}
        <div className="bg-gray-50 text-black rounded-2xl p-8 max-w-md mx-auto shadow-2xl border border-gray-200">
          <div className="text-red-500 font-bold text-lg mb-2">Founding Member</div>
          <div className="text-4xl font-bold text-black mb-2">
            {currentRegion.price}<span className="text-lg text-gray-500">/year</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">Limited to first 100 members per region</p>
          
          <ul className="text-left text-sm space-y-3 mb-6">
            {content.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-red-500">✓</span> <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors">
            Join the Association
          </button>
          
          <div className="mt-4 text-xs text-gray-500">
            Payment via {content.paymentMethods}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Creating Pathways</h2>
          <p className="text-gray-500 mb-8">Global partner network announcements coming soon</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40">
            <div className="text-xl font-bold text-gray-400">Major Flight Schools</div>
            <div className="text-xl font-bold text-gray-400">National Carriers</div>
            <div className="text-xl font-bold text-gray-400">Regional Airlines</div>
            <div className="text-xl font-bold text-gray-400">Cargo Operators</div>
          </div>
        </div>
      </div>
    </div>
  );
}
