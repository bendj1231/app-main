import React from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle,
  Database,
  Plane,
  FileCheck,
  Hash,
  Clock,
  AlertTriangle,
  Lock,
  Server,
  Radio
} from 'lucide-react';

interface VerificationReceiptProps {
  pilotName: string;
  pilotId: string;
  verificationId: string;
  status: 'VERIFIED' | 'FAILED' | 'PENDING';
  initiatedAt: string;
  completedAt?: string;
  
  // Three-way triangulation data
  triangulation: {
    pilotLogbookHash: string;
    atoScheduleHash: string;
    caapAirframeHash: string;
    alignmentStatus: 'ALIGNED' | 'MISMATCH';
    matchTimestamp: string;
  };
  
  // ATO/Flight School data
  atoNode: {
    name: string;
    nodeId: string;
    trustedStatus: 'ACTIVE' | 'REVIEW' | 'SUSPENDED';
    subscriptionExpiry: string;
  };
  
  // Flight details
  flightRecord: {
    tailNumber: string;
    aircraftType: string;
    date: string;
    blockTime: string;
    picHours: number;
    sicHours: number;
    flightReleaseCertificate: string;
    hobbsStart: string;
    hobbsEnd: string;
  };
  
  // CAAP Registry reference
  caapRegistry: {
    referenceNumber: string;
    registryCheckTimestamp: string;
    airframeStatus: 'ACTIVE' | 'MAINTENANCE' | 'DEREGISTERED';
  };
  
  // Economic proof
  paymentProof: {
    verificationFee: number;
    atoDividend: number;
    dividendReleased: boolean;
    releaseTransactionHash?: string;
  };
}

export const VerificationReceipt: React.FC<VerificationReceiptProps> = ({
  pilotName,
  pilotId,
  verificationId,
  status,
  initiatedAt,
  completedAt,
  triangulation,
  atoNode,
  flightRecord,
  caapRegistry,
  paymentProof
}) => {
  const isVerified = status === 'VERIFIED';
  const isFailed = status === 'FAILED';
  
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className={`p-6 ${isVerified ? 'bg-green-50' : isFailed ? 'bg-red-50' : 'bg-yellow-50'} border-b border-slate-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isVerified ? 'bg-green-100' : isFailed ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              {isVerified ? (
                <Shield className="w-8 h-8 text-green-600" />
              ) : isFailed ? (
                <XCircle className="w-8 h-8 text-red-600" />
              ) : (
                <Clock className="w-8 h-8 text-yellow-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isVerified ? 'CAAP-Level Verification Complete' : isFailed ? 'Verification Failed' : 'Verification in Progress'}
              </h2>
              <p className="text-slate-600">
                Pilot: <span className="font-semibold">{pilotName}</span> • 
                ID: <span className="font-mono text-xs">{pilotId}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              isVerified 
                ? 'bg-green-100 text-green-800' 
                : isFailed 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isVerified ? (
                <><CheckCircle className="w-4 h-4" /> TRIPLICATE MATCH CONFIRMED</>
              ) : isFailed ? (
                <><XCircle className="w-4 h-4" /> REGISTRY MISMATCH</>
              ) : (
                <><Clock className="w-4 h-4" /> AWAITING ATO RESPONSE</>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-mono">{verificationId}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Triangulation Visualization */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Three-Way Cryptographic Triangulation
          </h3>
          
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-slate-300 -translate-y-1/2" />
            
            <div className="grid grid-cols-3 gap-4">
              {/* Pilot Logbook */}
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-sm">Pilot Logbook</span>
                </div>
                <code className="block text-xs font-mono text-slate-600 break-all bg-slate-100 p-2 rounded">
                  {triangulation.pilotLogbookHash.slice(0, 16)}...{triangulation.pilotLogbookHash.slice(-16)}
                </code>
                <p className="text-xs text-slate-500 mt-2">Electronic logbook hash</p>
              </div>

              {/* Alignment Status */}
              <div className="flex flex-col items-center justify-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  triangulation.alignmentStatus === 'ALIGNED' 
                    ? 'bg-green-100 border-4 border-green-500' 
                    : 'bg-red-100 border-4 border-red-500'
                }`}>
                  {triangulation.alignmentStatus === 'ALIGNED' ? (
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-600" />
                  )}
                </div>
                <p className={`text-sm font-bold mt-2 ${
                  triangulation.alignmentStatus === 'ALIGNED' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {triangulation.alignmentStatus === 'ALIGNED' ? 'PERFECT ALIGNMENT' : 'MISMATCH DETECTED'}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(triangulation.matchTimestamp).toLocaleString()}
                </p>
              </div>

              {/* ATO Schedule */}
              <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-sm">ATO Schedule DB</span>
                </div>
                <code className="block text-xs font-mono text-slate-600 break-all bg-slate-100 p-2 rounded">
                  {triangulation.atoScheduleHash.slice(0, 16)}...{triangulation.atoScheduleHash.slice(-16)}
                </code>
                <p className="text-xs text-slate-500 mt-2">Flight school internal records</p>
              </div>
            </div>

            {/* CAAP Registry - Bottom Center */}
            <div className="mt-6 flex justify-center">
              <div className="bg-white rounded-lg p-4 border-2 border-amber-200 w-full max-w-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-sm">CAAP Master Airframe Registry</span>
                </div>
                <code className="block text-xs font-mono text-slate-600 break-all bg-slate-100 p-2 rounded text-center">
                  {triangulation.caapAirframeHash.slice(0, 16)}...{triangulation.caapAirframeHash.slice(-16)}
                </code>
                <p className="text-xs text-slate-500 mt-2 text-center">National airframe transponder logs</p>
              </div>
            </div>
          </div>

          {/* Anti-Fraud Notice */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Server-to-Server Verification Only</p>
              <p className="text-xs text-blue-700">
                No human "Approve" button exists. This verification was triggered exclusively by 
                programmatic hash alignment between the three independent databases. Any manual attempt 
                to force validation would result in immediate registry contradiction detection.
              </p>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Flight Record Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Tail Number</span>
                <span className="font-mono font-semibold">{flightRecord.tailNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Aircraft Type</span>
                <span className="font-semibold">{flightRecord.aircraftType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Flight Date</span>
                <span className="font-semibold">{flightRecord.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Block Time</span>
                <span className="font-semibold">{flightRecord.blockTime}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">PIC Hours</span>
                  <span className="font-bold text-green-600">{flightRecord.picHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SIC Hours</span>
                  <span className="font-bold text-blue-600">{flightRecord.sicHours}</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-slate-500 mb-1">Flight Release Certificate</p>
                <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                  {flightRecord.flightReleaseCertificate}
                </code>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Hobbs: {flightRecord.hobbsStart} → {flightRecord.hobbsEnd}</span>
              </div>
            </div>
          </div>

          {/* CAAP Registry & ATO Node */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                CAAP Registry Reference
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Registry Ref #</span>
                  <code className="font-mono text-sm">{caapRegistry.referenceNumber}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check Timestamp</span>
                  <span className="text-sm">
                    {new Date(caapRegistry.registryCheckTimestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Airframe Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    caapRegistry.airframeStatus === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : caapRegistry.airframeStatus === 'MAINTENANCE'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {caapRegistry.airframeStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-4">ATO Validator Node</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Flight School</span>
                  <span className="font-semibold">{atoNode.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Node ID</span>
                  <code className="font-mono text-xs">{atoNode.nodeId}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Trusted Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    atoNode.trustedStatus === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : atoNode.trustedStatus === 'REVIEW'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {atoNode.trustedStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subscription Valid Until</span>
                  <span className="text-sm">{new Date(atoNode.subscriptionExpiry).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Economic Proof */}
        <div className="bg-slate-900 rounded-xl p-5 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Verification Payment Proof
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Verification Fee Paid</p>
              <p className="text-2xl font-bold">${paymentProof.verificationFee.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">ATO Node Dividend</p>
              <p className="text-2xl font-bold text-green-400">${paymentProof.atoDividend.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Dividend Status</p>
              <p className={`text-lg font-bold ${paymentProof.dividendReleased ? 'text-green-400' : 'text-yellow-400'}`}>
                {paymentProof.dividendReleased ? 'RELEASED' : 'HELD IN ESCROW'}
              </p>
              {paymentProof.releaseTransactionHash && (
                <code className="text-xs font-mono text-slate-400 block mt-1">
                  Tx: {paymentProof.releaseTransactionHash.slice(0, 20)}...
                </code>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            <strong>Programmatic Release:</strong> The $5 dividend was released automatically upon 
            cryptographic hash alignment confirmation. No human authorization was involved.
          </p>
        </div>

        {/* Slashing Warning (if applicable) */}
        {atoNode.trustedStatus === 'REVIEW' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">Node Under Regulatory Review</p>
              <p className="text-sm text-red-700">
                This ATO node has registered multiple failed manual inputs or registry mismatches. 
                Their verification privileges are suspended pending CAAP compliance review. All 
                associated verification dividends are frozen.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 p-4 text-center">
        <p className="text-xs text-slate-500">
          This verification receipt is cryptographically signed and immutable. 
          Hash: <code className="font-mono">{verificationId}</code> • 
          Generated: {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
};

export default VerificationReceipt;
