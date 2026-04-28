import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';
import styles from './SupabaseVerificationLoader.module.css';

interface SupabaseVerificationLoaderProps {
  onComplete: () => void;
}

export const SupabaseVerificationLoader: React.FC<SupabaseVerificationLoaderProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<'connecting' | 'verifying' | 'success' | 'error'>('connecting');
  const [message, setMessage] = useState('Establishing secure connection...');

  useEffect(() => {
    const verifyConnection = async () => {
      try {
        setStatus('connecting');
        setMessage('Establishing secure connection to Supabase...');
        
        // Test basic connection
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        if (error) {
          setStatus('error');
          setMessage('Connection failed. Please check your network.');
          console.error('Supabase connection error:', error);
          return;
        }

        setStatus('verifying');
        setMessage('Verifying user credentials and permissions...');
        
        // Simulate verification process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus('success');
        setMessage('Verification complete. Loading foundation program...');
        
        // Complete after success
        setTimeout(() => {
          onComplete();
        }, 1000);
        
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
        console.error('Verification error:', error);
      }
    };

    verifyConnection();
  }, [onComplete]);

  const getStatusTitle = () => {
    switch (status) {
      case 'connecting': return 'Connecting to Database';
      case 'verifying': return 'Verifying Credentials';
      case 'success': return 'Connection Successful';
      case 'error': return 'Connection Failed';
    }
  };

  const getStatusClass = () => {
    return status;
  };

  return (
    <div className={styles.verificationLoaderContainer}>
      <div className={styles.verificationCard}>
        {/* Left Side (Dark Info Panel) */}
        <div className={styles.infoPanel}>
          <div className={styles.infoPanelGradient1} />
          <div className={styles.infoPanelGradient2} />
          <div className={styles.logo}>
            <img src="/logo.png" alt="PilotRecognition Logo" />
          </div>
          <div className={styles.pageLabel}>BRIDGING THE GAP</div>
          <h2 className={styles.panelTitle}>Loading Portal</h2>
          <p className={styles.panelDescription}>
            <strong>Please wait while we prepare your PilotRecognition experience.</strong> We're loading your personalized dashboard and training materials.
          </p>
        </div>
        
        {/* Right Side (Verification Panel) */}
        <div className={styles.verificationPanel}>
          <div className={styles.verificationHeader}>
            <h2 className={styles.verificationTitle}>System Verification</h2>
            <p className={styles.verificationSubtitle}>
              Please wait while we verify your credentials
            </p>
          </div>

          <div className={styles.statusSection}>
            <div className={`${styles.statusIcon} ${styles[getStatusClass()]}`}>
              {status === 'connecting' && <Icons.Loader />}
              {status === 'verifying' && <Icons.Loader />}
              {status === 'success' && <Icons.CheckCircle />}
              {status === 'error' && <Icons.AlertTriangle />}
            </div>

            <div className={styles.statusMessage}>
              <h2 className={`${styles.statusTitle} ${styles[getStatusClass()]}`}>
                {getStatusTitle()}
              </h2>
              <p className={styles.statusDescription}>
                {message}
              </p>
            </div>

            <div className={styles.progressBarContainer}>
              <div className={`${styles.progressBar} ${styles[getStatusClass()]}`} />
            </div>

            <div className={styles.additionalInfo}>
              <p>Powered by Supabase Database</p>
              <p>PilotRecognition Foundation Program</p>
            </div>

            {status === 'error' && (
              <button
                onClick={() => window.location.reload()}
                className={styles.retryButton}
              >
                Retry Connection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
