/**
 * GDPR Consent Banner
 * 
 * This component manages user consent for analytics and tracking:
 * - Cookie consent management
 * - Analytics opt-in/opt-out
 * - GDPR compliance
 * - User preference persistence
 */

import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean; // Always true
}

export interface ConsentBannerProps {
  onAccept?: (preferences: ConsentPreferences) => void;
  onDecline?: () => void;
  customMessage?: string;
  showLink?: boolean;
}

const CONSENT_STORAGE_KEY = 'analytics-consent-preferences';
const CONSENT_TIMESTAMP_KEY = 'analytics-consent-timestamp';

export const ConsentBanner: React.FC<ConsentBannerProps> = ({
  onAccept,
  onDecline,
  customMessage,
  showLink = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: false,
    marketing: false,
    functional: true,
    necessary: true
  });

  useEffect(() => {
    // Check if user has already made a choice
    const storedPreferences = localStorage.getItem(CONSENT_STORAGE_KEY);
    const timestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY);

    if (!storedPreferences || !timestamp) {
      // Show banner if no consent has been given
      setIsVisible(true);
    } else {
      // Check if consent is older than 1 year (GDPR requires re-consent)
      const consentDate = new Date(timestamp);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (consentDate < oneYearAgo) {
        setIsVisible(true);
      } else {
        // Load existing preferences
        setPreferences(JSON.parse(storedPreferences));
      }
    }
  }, []);

  const handleAccept = (all: boolean = false) => {
    const newPreferences: ConsentPreferences = all
      ? { analytics: true, marketing: true, functional: true, necessary: true }
      : preferences;

    savePreferences(newPreferences);
    setIsVisible(false);
    onAccept?.(newPreferences);
  };

  const handleDecline = () => {
    const newPreferences: ConsentPreferences = {
      analytics: false,
      marketing: false,
      functional: true,
      necessary: true
    };

    savePreferences(newPreferences);
    setIsVisible(false);
    onDecline?.();
  };

  const savePreferences = (prefs: ConsentPreferences) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
    setPreferences(prefs);
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'necessary') return; // Necessary cookies cannot be disabled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white shadow-2xl border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Cookie Preferences</h3>
              <p className="text-slate-300 text-sm mb-4">
                {customMessage || 'We use cookies and similar technologies to help personalize content, measure effectiveness, and provide a safer experience. By clicking accept, you agree to our use of cookies.'}
              </p>

              {showDetails && (
                <div className="space-y-3 mt-4 p-4 bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Necessary</span>
                      <p className="text-xs text-slate-400">Required for the site to function</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Analytics</span>
                      <p className="text-xs text-slate-400">Help us improve our website</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => togglePreference('analytics')}
                      className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Marketing</span>
                      <p className="text-xs text-slate-400">Used for advertising and personalization</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => togglePreference('marketing')}
                      className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Functional</span>
                      <p className="text-xs text-slate-400">Enable enhanced features</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => togglePreference('functional')}
                      className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              <button
                onClick={() => handleAccept(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Accept Selected
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleAccept(true)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Accept All
              </button>

              <button
                onClick={handleDecline}
                className="px-4 py-2 bg-transparent hover:bg-slate-800 text-slate-300 rounded-lg font-medium transition-colors"
              >
                Decline
              </button>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-slate-400 hover:text-white transition-colors underline"
              >
                {showDetails ? 'Show Less' : 'Customize Preferences'}
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook to check and manage consent
export function useConsent() {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      const prefs = JSON.parse(stored);
      setPreferences(prefs);
      setHasConsented(true);
    }
  }, []);

  const updateConsent = (newPreferences: ConsentPreferences) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newPreferences));
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
    setPreferences(newPreferences);
    setHasConsented(true);
  };

  const clearConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
    setPreferences(null);
    setHasConsented(false);
  };

  return {
    preferences,
    hasConsented,
    updateConsent,
    clearConsent,
    canTrackAnalytics: preferences?.analytics ?? false,
    canTrackMarketing: preferences?.marketing ?? false
  };
}
