import React from 'react';
import { ChevronRight } from 'lucide-react';
import SubscriptionDashboard from '@/components/SubscriptionDashboard';
import { useAuth } from '@/src/contexts/AuthContext';

interface SubscriptionPageProps {
  onBack: () => void;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onBack }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication Required</h2>
          <p className="text-slate-600">Please log in to access subscription management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Subscription & Billing</h1>
          <p className="text-slate-600 mt-1">Manage your subscription plan and billing information</p>
        </div>
      </div>

      {/* Subscription Dashboard */}
      <SubscriptionDashboard userId={currentUser.uid} />
    </div>
  );
};
