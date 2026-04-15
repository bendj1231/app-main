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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '60%' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>News & Updates</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Latest announcements
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="News & Updates" className={styles.hubCardBgImage} />
                            <div className={styles.hubCardArrow}>
                                <Icons.ArrowRight />
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'applications' ? styles.active : ''}`}
                            onClick={() => onNavigate('applications')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '60%' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>Pilot Portfolio</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Flight logs
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <img src="/Captain-Paperwork-Medium.jpg" alt="Pilot Portfolio" className={styles.hubCardBgImage} />
                            <div className={styles.hubCardArrow}>
                                <Icons.ArrowRight />
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'programs' ? styles.active : ''}`}
                            onClick={() => onNavigate('programs')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '60%' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>Programs</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Training programs
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <img src="/Gemini_Generated_Image_7awns87awns87awn.png" alt="Programs" className={styles.hubCardBgImage} />
                            <div className={styles.hubCardArrow}>
                                <Icons.ArrowRight />
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'pathways' ? styles.active : ''}`}
                            onClick={() => onNavigate('pathways')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '60%' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>Pathways</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Career roadmaps
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <img src="/shutterstock_1698112222.jpg" alt="Pathways" className={styles.hubCardBgImage} />
                            <div className={styles.hubCardArrow}>
                                <Icons.ArrowRight />
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'recognition' ? styles.active : ''}`}
                            onClick={() => onNavigate('recognition')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '60%' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>Recognition</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Awards
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <img src="/Gemini_Generated_Image_tka3njtka3njtka3.png" alt="Recognition & Achievements" className={styles.hubCardBgImage} />
                            <div className={styles.hubCardArrow}>
                                <Icons.ArrowRight />
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'wingmentor-network' ? styles.active : ''}`}
                            onClick={() => onNavigate('wingmentor-network')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '60%' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>Network</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Community hub
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <img src="/Networking.jpg" alt="WingMentor Network" className={styles.hubCardBgImage} />
                            <div className={styles.hubCardArrow}>
                                <Icons.ArrowRight />
                            </div>
                        </div>

                        <div 
                            className={`${styles.horizontalCard} ${mainView === 'w1000' ? styles.active : ''}`}
                            onClick={() => onNavigate('w1000')}
                        >
                            <div className={styles.horizontalCardContentWrapper}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '60%' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className={styles.horizontalCardContent}>
                                        <h3 className={styles.horizontalCardTitle}>W1000</h3>
                                        <p className={styles.horizontalCardDesc}>
                                            Advanced training
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <img src="/Gemini_Generated_Image_7awns87awns87awn.png" alt="W1000" className={styles.hubCardBgImage} />
                            <div className={styles.hubCardArrow}>
                                <Icons.ArrowRight />
                            </div>
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
