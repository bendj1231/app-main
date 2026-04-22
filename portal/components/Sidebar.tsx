import React from 'react';
import { Icons } from '../icons';
import { MessageCircle, Settings, Home, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
    mainView: any;
    onLogout: () => void;
    onNavigate: (view: any) => void;
    onNavigateToMainApp?: () => void;
    isDarkMode?: boolean;
}

const navItems = [
    { id: 'news', title: 'News & Updates', subtitle: 'Latest announcements' },
    { id: 'pilot-portfolio', title: 'Dashboard', subtitle: 'Flight logs' },
    { id: 'programs', title: 'Programs', subtitle: 'Training programs' },
    { id: 'pathways', title: 'Pathways', subtitle: 'Career roadmaps' },
    { id: 'recognition', title: 'Recognition', subtitle: 'Awards' },
    { id: 'wingmentor-network', title: 'Network', subtitle: 'Community hub' },
    { id: 'w1000', title: 'W1000', subtitle: 'Advanced training' },
];

export const Sidebar: React.FC<SidebarProps> = ({ mainView, onLogout, onNavigate, onNavigateToMainApp, isDarkMode = false }) => {
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebarContent}>
                {/* Sidebar Logo */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarLogo}>
                        <img src="/logo.png" alt="WingMentor Logo" className={styles.logoImage} />
                    </div>
                    <div className={styles.sidebarLogoText}>
                        <span className={styles.logoText}>Pilot portal</span>
                    </div>
                    <div className={styles.sidebarSubtitle}>CONNECTING PILOTS TO THE INDUSTRY</div>
                </div>

                <section className={styles.navSection}>
                    <div className={styles.navList}>
                        {navItems.map((item) => {
                            const isActive = mainView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                    onClick={() => onNavigate(item.id)}
                                >
                                    <div className={styles.navItemContent}>
                                        <div className={styles.navItemTitle}>{item.title}</div>
                                        <div className={styles.navItemSubtitle}>{item.subtitle}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};
