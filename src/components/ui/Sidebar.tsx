import React from 'react';
import {
    LayoutDashboard,
    BookOpen,
    ExternalLink,
    LineChart,
    Globe,
    Zap,
    Briefcase,
    Cpu,
    AppWindow,
    Tablet,
    Book,
    LayoutGrid,
    FileText,
    Award,
    LogOut,
    FileSignature,
    TrendingUp,
    Users,
    Settings
} from 'lucide-react';
// import { ChevronRight } from './Icons';
import { useAuth } from '@/src/contexts/AuthContext';

const LOGO_URL = "https://cdn.shopify.com/s/files/1/0807/5801/4243/files/logo_3.png?v=1738739665";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const NavItem = ({ id, icon: Icon, label, active, onNavigate, onClose }: any) => (
    <div
        onClick={() => { onNavigate(id); if (window.innerWidth <= 768) onClose(); }}
        className={`nav-link ${active ? 'active' : ''}`}
    >
        <Icon size={18} />
        <span>{label}</span>
        {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 12px #4ade80' }} />}
    </div>
);

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const Sidebar = ({ activePage, onNavigate, isOpen, onClose }: { activePage: string, onNavigate: (page: any) => void, isOpen: boolean, onClose: () => void }) => {
    const { logout, currentUser } = useAuth();
    
    // Check if user is admin (you can adjust this logic based on your admin criteria)
    const isAdmin = currentUser?.email?.includes('admin') || currentUser?.email?.includes('benjamin') || currentUser?.email?.includes('karl');

    return (
        <>
            <div className={`mobile-overlay ${isOpen ? 'sidebar-open' : ''}`} onClick={onClose} />
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <img src={LOGO_URL} alt="PilotRecognition" className="sidebar-logo fade-in-up" />

                <div className="nav-links fade-in-up" style={{ animationDelay: '0.1s', overflowY: 'auto', paddingRight: 4 }}>

                    <div style={{ marginBottom: 24 }}>
                        <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activePage === 'dashboard'} onNavigate={onNavigate} onClose={onClose} />
                    </div>

                    <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#aaa', paddingLeft: 16, marginBottom: 8, letterSpacing: '0.1em' }}>PROGRAMS</p>
                        <NavItem id="foundational-verification" icon={BookOpen} label="Foundational" active={activePage === 'foundational-verification'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="transition-platform" icon={ExternalLink} label="Transition" active={activePage === 'transition-platform'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="progress_analytics" icon={LineChart} label="My Progress" active={activePage === 'progress_analytics'} onNavigate={onNavigate} onClose={onClose} />
                    </div>

                    <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#aaa', paddingLeft: 16, marginBottom: 8, letterSpacing: '0.1em' }}>PATHWAYS</p>
                        <NavItem id="emirates-atpl-platform" icon={Globe} label="Emirates ATPL" active={activePage === 'emirates-atpl-platform'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="air-taxi-platform" icon={Zap} label="Air Taxi" active={activePage === 'air-taxi-platform'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="private-charter-platform" icon={Briefcase} label="Private Charter" active={activePage === 'private-charter-platform'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="piloted-drones-platform" icon={Cpu} label="Piloted Drones" active={activePage === 'piloted-drones-platform'} onNavigate={onNavigate} onClose={onClose} />
                    </div>

                    <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#aaa', paddingLeft: 16, marginBottom: 8, letterSpacing: '0.1em' }}>APPLICATIONS</p>
                        <NavItem id="w1000-suite" icon={AppWindow} label="W1000 Suite" active={activePage === 'w1000-suite'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="pilot_apps" icon={Tablet} label="EFB Apps" active={activePage === 'pilot_apps'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="handbook" icon={Book} label="Handbook" active={activePage === 'handbook'} onNavigate={onNavigate} onClose={onClose} />
                    </div>

                    <div style={{ paddingBottom: 12, marginBottom: 12 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#aaa', paddingLeft: 16, marginBottom: 8, letterSpacing: '0.1em' }}>SYSTEMS</p>
                        <NavItem id="airbus" icon={LayoutGrid} label="Airbus Suite" active={activePage === 'airbus'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="atlas-cv" icon={FileText} label="ATLAS CV" active={activePage === 'atlas-cv'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="insights" icon={Globe} label="Airline Insights" active={activePage === 'insights'} onNavigate={onNavigate} onClose={onClose} />
                        <NavItem id="pilot-recognition" icon={Award} label="Recognition" active={activePage === 'pilot-recognition'} onNavigate={onNavigate} onClose={onClose} />
                    </div>

                    {/* Admin-only strategic documents section */}
                    {isAdmin && (
                        <div style={{ paddingBottom: 12, marginBottom: 12, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#aaa', paddingLeft: 16, marginBottom: 8, letterSpacing: '0.1em' }}>ADMIN STRATEGY</p>
                            <NavItem id="moa-executive-summary" icon={FileSignature} label="CAAP MOA" active={activePage === 'moa-executive-summary'} onNavigate={onNavigate} onClose={onClose} />
                            <NavItem id="investor-pitch" icon={TrendingUp} label="Investor Pitch" active={activePage === 'investor-pitch'} onNavigate={onNavigate} onClose={onClose} />
                            <NavItem id="government-promotion" icon={Users} label="Gov Promotion" active={activePage === 'government-promotion'} onNavigate={onNavigate} onClose={onClose} />
                            <NavItem id="veremark-pricing" icon={Settings} label="Veremark API" active={activePage === 'veremark-pricing'} onNavigate={onNavigate} onClose={onClose} />
                        </div>
                    )}

                </div>

                <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
                    <div className="nav-link" onClick={logout}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#ccc', textAlign: 'center', marginTop: 16 }}>v2.4.0 • PilotRecognition Inc.</p>
                </div>
            </aside>
        </>
    );
};
