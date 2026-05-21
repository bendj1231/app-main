import React from 'react';
import { useParams } from 'react-router-dom';
import { TopNavbar } from '@/components/website/components/TopNavbar';
import { VerificationReceipt } from '@/components/verification/VerificationReceipt';
import { ArrowLeft, Download, Share2 } from 'lucide-react';

// Demo data - in production this would come from Supabase
const DEMO_VERIFICATION = {
  pilotName: "Benjamin Tiger Bowler",
  pilotId: "792250be-00fc-4bbf-b4a5-8673de7484f3",
  verificationId: "ver_7a8f9e2d4c6b5a1",
  status: 'VERIFIED' as const,
  initiatedAt: "2026-05-19T08:00:00Z",
  completedAt: "2026-05-19T08:00:03Z",
  
  triangulation: {
    pilotLogbookHash: "a3f7c8d9e2b1f5e6a4c8d7b9f3e1a2b5c6d7e8f9a1b2c3d4e5f6a7b8c9d0e1f2",
    atoScheduleHash: "a3f7c8d9e2b1f5e6a4c8d7b9f3e1a2b5c6d7e8f9a1b2c3d4e5f6a7b8c9d0e1f2",
    caapAirframeHash: "a3f7c8d9e2b1f5e6a4c8d7b9f3e1a2b5c6d7e8f9a1b2c3d4e5f6a7b8c9d0e1f2",
    alignmentStatus: 'ALIGNED' as const,
    matchTimestamp: "2026-05-19T08:00:03Z"
  },
  
  atoNode: {
    name: "WCC Aviation College",
    nodeId: "ato_wcc_ph_001",
    trustedStatus: 'ACTIVE' as const,
    subscriptionExpiry: "2027-05-19"
  },
  
  flightRecord: {
    tailNumber: "RP-C1234",
    aircraftType: "Cessna 172S",
    date: "2025-04-15",
    blockTime: "2.5 hours",
    picHours: 2.5,
    sicHours: 0,
    flightReleaseCertificate: "FRC-WCC-2025-0415-001",
    hobbsStart: "245.7",
    hobbsEnd: "248.2"
  },
  
  caapRegistry: {
    referenceNumber: "CAAP-AF-2025-RP-C1234-01542",
    registryCheckTimestamp: "2026-05-19T08:00:02Z",
    airframeStatus: 'ACTIVE' as const
  },
  
  paymentProof: {
    verificationFee: 99.00,
    atoDividend: 5.00,
    dividendReleased: true,
    releaseTransactionHash: "0x7f8e9d2c4b6a5f3e1d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7"
  }
};

export default function EnterpriseVerifiedPilotPage() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-slate-100">
        {/* Coded by Benjamin Bowler */}
      <TopNavbar 
        onNavigate={(page) => console.log(page)} 
        onLogin={() => {}} 
        forceScrolled={true} 
        isLight={true} 
      />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Verified Pilot Profile</h1>
                <p className="text-slate-600">CAAP-Level Triangulated Verification Receipt</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Trust Indicator */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-green-900">This pilot has passed CAAP-Level Verification</p>
              <p className="text-sm text-green-700">
                All flight hours have been cryptographically triangulated between the pilot's logbook, 
                the ATO's internal scheduling database, and the CAAP Master Airframe Registry. 
                No human approval was involved in this verification.
              </p>
            </div>
          </div>

          {/* The Receipt */}
          <VerificationReceipt {...DEMO_VERIFICATION} />

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
              Contact Pilot for Interview
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Add to Shortlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
