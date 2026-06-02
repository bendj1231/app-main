import React, { useEffect, useRef, useState } from 'react';

interface HelioPaywallProps {
  amount: number; // in USD
  recipientWallet: string; // Your USDC wallet address
  paymentType: 'enterprise_monthly' | 'enterprise_annual' | 'recognition_plus';
  userId?: string;
  userEmail?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    helioCheckout: any;
  }
}

export const HelioPaywall: React.FC<HelioPaywallProps> = ({
  amount,
  recipientWallet,
  paymentType,
  userId,
  userEmail,
  onSuccess,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Helio script
    if (!window.helioCheckout) {
      const script = document.createElement('script');
      script.src = 'https://helio-assets.s3.eu-west-1.amazonaws.com/widget/build/v2.2/widget.js';
      script.async = true;
      script.onload = () => setLoaded(true);
      script.onerror = () => {
        setError('Failed to load Helio payment widget');
        onError?.('Failed to load Helio payment widget');
      };
      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, [onError]);

  useEffect(() => {
    if (!loaded || !containerRef.current || !window.helioCheckout) return;

    try {
      window.helioCheckout.createPayment({
        paylinkId: null, // Use custom payment
        elementId: containerRef.current.id,
        amount,
        currency: 'USD',
        recipient: recipientWallet,
        network: 'solana', // or 'ethereum', 'polygon'
        token: 'USDC',
        fullScreen: false,
        theme: {
          backgroundColor: '#ffffff',
          primaryColor: '#dc2626', // red-600
          textColor: '#1e293b',
        },
        customTexts: {
          title: `Unlock ${paymentType === 'enterprise_annual' ? 'Enterprise Annual' : paymentType === 'enterprise_monthly' ? 'Enterprise Monthly' : 'Recognition+'}`,
          description: `Pay $${amount.toLocaleString()} USDC to unlock premium features. Invoice generated automatically.`,
          payButton: `Pay $${amount.toLocaleString()} USDC`,
        },
        metadata: {
          user_id: userId || '',
          user_email: userEmail || '',
          payment_type: paymentType,
          platform: 'pilotrecognition.com',
        },
        onSuccess: (event: any) => {
// [AUDIT] Removed console.log // line 79
          onSuccess?.(event.paymentId || event.transactionId);
        },
        onError: (event: any) => {
          console.error('Helio payment error:', event);
          setError(event.message || 'Payment failed');
          onError?.(event.message || 'Payment failed');
        },
      });
    } catch (err: any) {
      setError(err.message);
      onError?.(err.message);
    }
  }, [loaded, amount, recipientWallet, paymentType, userId, userEmail, onSuccess, onError]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm font-semibold mb-2">Payment Widget Error</p>
        <p className="text-red-600 text-xs">{error}</p>
        <p className="text-slate-500 text-xs mt-2">Try refreshing the page or contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!loaded && (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm text-slate-500">Loading payment widget...</span>
        </div>
      )}
      <div
        ref={containerRef}
        id={`helio-widget-${paymentType}`}
        className="min-h-[400px]"
      />
      <div className="text-center space-y-1">
        <p className="text-[10px] text-slate-400">
          Powered by <strong>Helio</strong> — Crypto Merchant of Record
        </p>
        <p className="text-[10px] text-slate-400">
          A corporate invoice will be emailed automatically after payment.
        </p>
      </div>
    </div>
  );
};
