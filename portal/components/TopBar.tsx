import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../icons';
import { User, Settings, Camera, ChevronDown, MessageCircle, Home, LogOut } from 'lucide-react';
import styles from './TopBar.module.css';

interface TopBarProps {
    userFirstName: string;
    userProfile?: any;
    isDarkMode?: boolean;
    onToggleDarkMode?: () => void;
    onNavigateToModules?: () => void;
    onNavigateToProfile?: () => void;
    onNavigateToApplications?: () => void;
    onAccessWebsite?: () => void;
    onNavigateToHome?: () => void;
    onLogout?: () => void;
    onContactSupport?: () => void;
    onGuidance?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
    userFirstName,
    userProfile,
    isDarkMode = false,
    onToggleDarkMode,
    onNavigateToModules,
    onNavigateToProfile,
    onNavigateToApplications,
    onAccessWebsite,
    onNavigateToHome,
    onLogout,
    onContactSupport,
    onGuidance
}) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileImageUrl = userProfile?.profile_image_url || '';
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    // Debug: Log userProfile prop changes
    useEffect(() => {
        console.log('🔍 [TOPBAR DEBUG] userProfile prop changed:', {
            hasUserProfile: !!userProfile,
            userProfileEmail: userProfile?.email,
            userProfileFirstName: userProfile?.firstName,
            userProfileDisplayName: userProfile?.displayName,
            userProfileProfileImage: userProfile?.profile_image_url,
            calculatedProfileImageUrl: profileImageUrl
        });
    }, [userProfile, profileImageUrl]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        if (isProfileDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isProfileDropdownOpen]);

    return (
        <div className={styles.topBarContainer}>
            <div className={styles.leftButtons}>
                <button onClick={onNavigateToHome} className={`${styles.actionButton} ${styles.homeButton}`}>
                    <Home size={18} />
                    <span>Home</span>
                </button>
                <button onClick={() => {
                    console.log('🔴 [TOPBAR LOGOUT] Logout button clicked');
                    console.log('🔴 [TOPBAR LOGOUT] Calling onLogout callback');
                    onLogout?.();
                    console.log('🔴 [TOPBAR LOGOUT] onLogout callback called');
                }} className={`${styles.actionButton} ${styles.logoutButton}`}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>

            <div className={styles.welcomeSection}>
                <p>WELCOME BACK</p>
                <div className={styles.userGreeting}>
                    <User size={20} />
                    <h2>{userFirstName}</h2>
                </div>
            </div>

            <div className={styles.actionButtons}>
                <button onClick={onToggleDarkMode} className={`${styles.actionButton} ${styles.darkModeButton}`}>
                    <Icons.Monitor />
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                <button onClick={onContactSupport} className={`${styles.actionButton} ${styles.contactButton}`}>
                    <MessageCircle size={18} />
                </button>

                <button onClick={onGuidance} className={`${styles.actionButton} ${styles.guidanceButton}`}>
                    <Settings size={18} />
                </button>

                <button onClick={onNavigateToModules} className={`${styles.actionButton} ${styles.pilotModulesButton}`}>
                    <Icons.BookOpen />
                    Pilot Modules
                </button>

                {/* Profile Button with Dropdown */}
                <div className={styles.profileDropdownContainer} ref={profileDropdownRef}>
                    <button
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className={`${styles.actionButton} ${styles.profileButton}`}
                    >
                        {profileImageUrl ? (
                            <img src={profileImageUrl} alt="Profile" className={styles.profilePhoto} />
                        ) : (
                            <div className={styles.profilePhotoPlaceholder}>
                                <User size={20} />
                            </div>
                        )}
                        <ChevronDown size={16} />
                    </button>

                    {isProfileDropdownOpen && (
                        <div className={styles.profileDropdown}>
                            <div className={styles.profileDropdownHeader}>
                                {profileImageUrl ? (
                                    <img src={profileImageUrl} alt="Profile" className={styles.profileDropdownPhoto} />
                                ) : (
                                    <div className={styles.profileDropdownPlaceholder}>
                                        <User size={24} />
                                    </div>
                                )}
                                <div className={styles.profileDropdownInfo}>
                                    <div className={styles.profileName}>{userFirstName}</div>
                                    <div className={styles.profileEmail}>{userProfile?.email || ''}</div>
                                </div>
                            </div>
                            <div className={styles.profileDropdownDivider}></div>
                            <button onClick={() => { onNavigateToProfile?.(); setIsProfileDropdownOpen(false); }} className={styles.dropdownItem}>
                                <User size={16} />
                                View Profile
                            </button>
                            <button onClick={() => { onLogout?.(); setIsProfileDropdownOpen(false); }} className={styles.dropdownItem}>
                                <Icons.LogOut />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>

                {/* Settings Button with Gear Icon */}
                <button onClick={onNavigateToApplications} className={`${styles.actionButton} ${styles.settingsButton}`}>
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
};
