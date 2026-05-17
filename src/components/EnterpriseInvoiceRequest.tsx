import React, { useState } from 'react';

interface EnterpriseInvoiceRequestProps {
  onSubmitted?: () => void;
}

export const EnterpriseInvoiceRequest: React.FC<EnterpriseInvoiceRequestProps> = ({ onSubmitted }) => {
  const [formData, setFormData] = useState({
    flightSchoolName: '',
    billingContactName: '',
    flightSchoolEmail: '',
    flightSchoolAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    flightSchoolTaxId: '',
    plan: 'enterprise_monthly' as 'enterprise_monthly' | 'enterprise_annual',
    pilotCount: '',
    paymentMethod: 'invoice' as 'invoice' | 'checkout',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    invoiceUrl?: string;
    pdfUrl?: string;
    checkoutUrl?: string;
    paymentMethod?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/create-enterprise-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.details || data.error || 'Failed to create invoice');

      // If checkout method, redirect to Stripe Checkout immediately
      if (data.paymentMethod === 'checkout' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setResult({
        success: true,
        message: data.message,
        invoiceUrl: data.invoiceUrl,
        pdfUrl: data.pdfUrl,
        paymentMethod: data.paymentMethod,
      });
      onSubmitted?.();
    } catch (err: any) {
      setResult({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (result?.success) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-green-200 shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl font-bold">✓</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Invoice Sent Successfully</h3>
        <p className="text-slate-600 mb-6">{result.message}</p>

        <div className="space-y-3">
          {result.invoiceUrl && (
            <a
              href={result.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
            >
              View Invoice on Stripe
            </a>
          )}
          {result.pdfUrl && (
            <a
              href={result.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Download PDF Invoice
            </a>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-6">
          The invoice is issued by Stripe, Inc. — a registered US corporation.
          Your accountant will receive a fully compliant commercial document.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-8 space-y-6">
      <div className="text-center mb-2">
        <h3 className="text-xl font-bold text-slate-900">Request Enterprise Invoice</h3>
        <p className="text-sm text-slate-500 mt-1">
          We will generate a professional invoice via Stripe for your flight school or training organization.
        </p>
      </div>

      {/* Payment method */}
      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-slate-700">Choose Payment Method</p>
        <div className="grid grid-cols-2 gap-3">
          <label className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
            formData.paymentMethod === 'invoice'
              ? 'border-red-500 bg-white'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="invoice"
              checked={formData.paymentMethod === 'invoice'}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as typeof formData.paymentMethod })}
              className="sr-only"
            />
            <p className="text-sm font-bold text-slate-900">Send Invoice</p>
            <p className="text-[10px] text-slate-500 mt-1">Net 14 days</p>
            <p className="text-[10px] text-slate-500">For accounting</p>
          </label>

          <label className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
            formData.paymentMethod === 'checkout'
              ? 'border-red-500 bg-white'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="checkout"
              checked={formData.paymentMethod === 'checkout'}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as typeof formData.paymentMethod })}
              className="sr-only"
            />
            <p className="text-sm font-bold text-slate-900">Pay Now</p>
            <p className="text-[10px] text-slate-500 mt-1">Instant access</p>
            <p className="text-[10px] text-green-600 font-semibold">Apple Pay / Google Pay</p>
          </label>
        </div>

        {formData.paymentMethod === 'invoice' && (
          <p className="text-xs text-slate-500">
            A professional invoice from Stripe, Inc. will be emailed to your billing contact.
            Payment terms: Net 14 days.
          </p>
        )}
        {formData.paymentMethod === 'checkout' && (
          <p className="text-xs text-slate-500">
            You will be redirected to Stripe Checkout. Apple Pay and Google Pay will appear automatically on supported devices.
            Instant account activation after payment.
          </p>
        )}
      </div>

      {/* Plan selection */}
      <div className="grid grid-cols-2 gap-3">
        <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
          formData.plan === 'enterprise_monthly'
            ? 'border-red-500 bg-red-50'
            : 'border-slate-200 hover:border-slate-300'
        }`}>
          <input
            type="radio"
            name="plan"
            value="enterprise_monthly"
            checked={formData.plan === 'enterprise_monthly'}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value as typeof formData.plan })}
            className="sr-only"
          />
          <p className="text-lg font-bold text-slate-900">$1,000</p>
          <p className="text-xs text-slate-500">/ month</p>
          <p className="text-[10px] text-red-600 font-semibold mt-1">Most flexible</p>
        </label>

        <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
          formData.plan === 'enterprise_annual'
            ? 'border-red-500 bg-red-50'
            : 'border-slate-200 hover:border-slate-300'
        }`}>
          <input
            type="radio"
            name="plan"
            value="enterprise_annual"
            checked={formData.plan === 'enterprise_annual'}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value as typeof formData.plan })}
            className="sr-only"
          />
          <p className="text-lg font-bold text-slate-900">$10,000</p>
          <p className="text-xs text-slate-500">/ year</p>
          <p className="text-[10px] text-green-600 font-semibold mt-1">2 months free</p>
        </label>
      </div>

      {/* School info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Flight School / Organization Name *</label>
          <input
            type="text"
            required
            value={formData.flightSchoolName}
            onChange={(e) => setFormData({ ...formData, flightSchoolName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
            placeholder="e.g., European Flight Academy"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Billing Contact Name *</label>
          <input
            type="text"
            required
            value={formData.billingContactName}
            onChange={(e) => setFormData({ ...formData, billingContactName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
            placeholder="e.g., Finance Director"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Billing Email *</label>
          <input
            type="email"
            required
            value={formData.flightSchoolEmail}
            onChange={(e) => setFormData({ ...formData, flightSchoolEmail: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
            placeholder="finance@flightschool.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Tax ID / VAT Number</label>
          <input
            type="text"
            value={formData.flightSchoolTaxId}
            onChange={(e) => setFormData({ ...formData, flightSchoolTaxId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
            placeholder="e.g., VAT IE1234567X or EIN 12-3456789"
          />
          <p className="text-xs text-slate-400 mt-1">Used for tax compliance on the invoice.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Pilot Count</label>
          <input
            type="number"
            min="1"
            value={formData.pilotCount}
            onChange={(e) => setFormData({ ...formData, pilotCount: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
            placeholder="e.g., 50"
          />
        </div>

        {/* Address */}
        <div className="border-t border-slate-100 pt-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Billing Address (optional)</label>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              value={formData.flightSchoolAddress.line1}
              onChange={(e) => setFormData({ ...formData, flightSchoolAddress: { ...formData.flightSchoolAddress, line1: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
              placeholder="Street address"
            />
            <input
              type="text"
              value={formData.flightSchoolAddress.line2}
              onChange={(e) => setFormData({ ...formData, flightSchoolAddress: { ...formData.flightSchoolAddress, line2: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
              placeholder="Suite, building, floor (optional)"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.flightSchoolAddress.city}
                onChange={(e) => setFormData({ ...formData, flightSchoolAddress: { ...formData.flightSchoolAddress, city: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                placeholder="City"
              />
              <input
                type="text"
                value={formData.flightSchoolAddress.state}
                onChange={(e) => setFormData({ ...formData, flightSchoolAddress: { ...formData.flightSchoolAddress, state: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                placeholder="State / Province"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.flightSchoolAddress.postalCode}
                onChange={(e) => setFormData({ ...formData, flightSchoolAddress: { ...formData.flightSchoolAddress, postalCode: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                placeholder="Postal code"
              />
              <input
                type="text"
                value={formData.flightSchoolAddress.country}
                onChange={(e) => setFormData({ ...formData, flightSchoolAddress: { ...formData.flightSchoolAddress, country: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                placeholder="Country"
              />
            </div>
          </div>
        </div>
      </div>

      {result && !result.success && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3">
          {result.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-red-700 transition-all disabled:opacity-50"
      >
        {loading
          ? formData.paymentMethod === 'checkout'
            ? 'Redirecting to Checkout...'
            : 'Generating Invoice...'
          : formData.paymentMethod === 'checkout'
            ? 'Pay Now with Stripe'
            : 'Generate & Send Invoice'
        }
      </button>

      <div className="text-center space-y-1">
        <p className="text-[10px] text-slate-400">
          Payment processed by <strong>Stripe, Inc.</strong> — a registered US corporation (Tax ID: 46-4602340).
        </p>
        <p className="text-[10px] text-slate-400">
          {formData.paymentMethod === 'invoice'
            ? 'Your accountant will receive a fully compliant commercial invoice with tax ID and business address.'
            : 'Your card statement will show "STRIPE* PILOTREC" — a recognized payment processor.'
          }
        </p>
      </div>
    </form>
  );
};
