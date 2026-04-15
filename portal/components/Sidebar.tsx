import React from 'react';
import { Icons } from '../icons';
import styles from './Sidebar.module.css';

interface SidebarProps {
    mainView: any;
    onLogout: () => void;
    onNavigate: (view: any) => void;
    isDarkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ mainView, onLogout, onNavigate, isDarkMode = false }) => {
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebarContent}>
                <button 
                    onClick={onLogout}
                    className={styles.logoutButton}
                >
                    <Icons.LogOut />
                    Logout
                </button>
                
                {/* Sidebar Logo */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarLogo}>
                        <img src="/logo.png" alt="WingMentor Logo" />
                    </div>
                    <div className={styles.sidebarSubtitle}>CONNECTING PILOTS TO THE INDUSTRY</div>
                </div>

                <section className={styles.dashboardSection}>
                    <div className={styles.cardsList}>
                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'news' ? styles.active : ''}`}
                            onClick={() => onNavigate('news')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '65%' }}>
                                    <div style={{ fontSize: '1rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>News & Updates</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Latest announcements and industry insights
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.hubCardArrow}>
                                    <Icons.ArrowRight />
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'dashboard' ? styles.active : ''}`}
                            onClick={() => onNavigate('dashboard')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '65%' }}>
                                    <div style={{ fontSize: '1rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>Dashboard</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Your personalized training dashboard
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.hubCardArrow}>
                                    <Icons.ArrowRight />
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'programs' ? styles.active : ''}`}
                            onClick={() => onNavigate('programs')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '65%' }}>
                                    <div style={{ fontSize: '1rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>Programs</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Foundational and transition programs
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.hubCardArrow}>
                                    <Icons.ArrowRight />
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'pathways' ? styles.active : ''}`}
                            onClick={() => onNavigate('pathways')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '65%' }}>
                                    <div style={{ fontSize: '1rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>Pathways</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Airline pathway programs
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.hubCardArrow}>
                                    <Icons.ArrowRight />
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'wingmentor-network' ? styles.active : ''}`}
                            onClick={() => onNavigate('wingmentor-network')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '65%' }}>
                                    <div style={{ fontSize: '1rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>WingMentor Network</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Recognition hub and community
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.hubCardArrow}>
                                    <Icons.ArrowRight />
                                </div>
                            </div>
                            <img src="/Networking.jpg" alt="WingMentor Network" className={styles.hubCardBgImage} />
                        </div>
                    </div>
                </section>
                
                {/* Sidebar Footer */}
                <div className={styles.sidebarFooter}>
                    <div className={styles.sidebarFooterButtons}>
                        <button onClick={() => onNavigate('contact')} className={styles.footerButton}>
                            <Icons.MessageCircle />
                            Contact Support
                        </button>
                        <button onClick={() => onNavigate('contact')} className={styles.footerButton}>
                            <Icons.Settings />
                            Guidance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
