import React, { useState, useEffect } from 'react';
import styles from './LoadingCard.module.css';

const LOADING_MESSAGES = [
    "INITIALIZING FLIGHT PARAMETERS...",
    "FETCHING MENTORSHIP DATA...",
    "CALIBRATING SIMULATOR INTERFACE...",
    "VERIFYING PILOT CREDENTIALS...",
    "LOADING CURRICULUM ASSETS...",
    "SYNCHRONIZING TRAINING LOGS..."
];

export const LoadingCard: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.loadingContainer}>
            <div className={styles.backgroundGradient1} />
            <div className={styles.backgroundGradient2} />
            <div className={styles.loadingCard}>
                {/* Left Side (Dark Info Panel) */}
                <div className={styles.loadingInfoPanel}>
                    <div className={styles.infoPanelGradient1} />
                    <div className={styles.infoPanelGradient2} />
                    <div className={styles.logo}>
                        <img src="/logo.png" alt="PilotRecognition Logo" />
                    </div>
                    <div className={styles.pageLabel}>SYSTEM LOADING</div>
                    <h2 className={styles.panelTitle}>Loading Portal</h2>
                    <p className={styles.panelDescription}>
                        <strong>Please wait while we prepare your PilotRecognition experience.</strong> We're loading your personalized dashboard and training materials.
                    </p>
                </div>
                
                {/* Right Side (Loading Panel) */}
                <div className={styles.loadingPanel}>
                    <div className={styles.loadingHeader}>
                        <h2 className={styles.loadingTitle}>Loading Your Dashboard</h2>
                        <p className={styles.loadingSubtitle}>
                            Please wait while we load your personalized experience
                        </p>
                    </div>
                    <p className={styles.loadingMessage}>
                        {LOADING_MESSAGES[messageIndex]}
                    </p>
                    <div className={styles.spinnerContainer}>
                        <div className={styles.spinner}></div>
                    </div>
                    <div className={styles.loadingFooter}>
                        ESTABLISHING SECURE CONNECTION...
                    </div>
                </div>
            </div>
        </div>
    );
};
