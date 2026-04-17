import React from 'react';
import { Icons } from '../icons';
import styles from './TopBar.module.css';

interface TopBarProps {
    userFirstName: string;
    isDarkMode?: boolean;
    onToggleDarkMode?: () => void;
    onNavigateToModules?: () => void;
    onNavigateToProfile?: () => void;
    onNavigateToApplications?: () => void;
    onAccessWebsite?: () => void;
    onNavigateToHome?: () => void;
    onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
    userFirstName,
    isDarkMode = false,
    onToggleDarkMode,
    onNavigateToModules,
    onNavigateToProfile,
    onNavigateToApplications,
    onAccessWebsite,
    onNavigateToHome,
    onLogout
}) => {
    return (
        <div className={styles.topBarContainer}>
            <div className={styles.welcomeSection}>
                <p>WELCOME BACK</p>
                <div className={styles.userGreeting}>
                    <Icons.User />
                    <h2>{userFirstName}</h2>
                </div>
            </div>

            <div className={styles.actionButtons}>
                <button onClick={onToggleDarkMode} className={`${styles.actionButton} ${styles.darkModeButton}`}>
                    <Icons.Monitor />
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                <button onClick={onNavigateToModules} className={`${styles.actionButton} ${styles.pilotModulesButton}`}>
                    <Icons.BookOpen />
                    Pilot Modules
                </button>

                <button onClick={onNavigateToProfile} className={`${styles.actionButton} ${styles.profileButton}`}>
                    <Icons.User />
                    Profile
                </button>

                <button onClick={onNavigateToApplications} className={`${styles.actionButton} ${styles.settingsButton}`}>
                    <Icons.Settings />
                    Settings
                </button>

                <button onClick={onAccessWebsite} className={`${styles.actionButton} ${styles.accessWebsiteButton}`}>
                    <Icons.Globe />
                    Access Website
                </button>

                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.25rem' }}></div>

                {onNavigateToHome && (
                    <button onClick={onNavigateToHome} className={`${styles.actionButton} ${styles.homeButton}`}>
                        <Icons.Home />
                        Home
                    </button>
                )}

                {onLogout && (
                    <button onClick={onLogout} className={`${styles.actionButton} ${styles.logoutButton}`}>
                        <Icons.LogOut />
                        Sign Out
                    </button>
                )}
            </div>
        </div>
    );
};
