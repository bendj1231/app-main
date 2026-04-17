import React, { useState } from 'react';
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
    LogOut
} from 'lucide-react';
import { ChevronRight } from './Icons';
import { useAuth } from '@/src/contexts/AuthContext';

const LOGO_URL = "https://cdn.shopify.com/s/files/1/0807/5801/4243/files/logo_3.png?v=1738739665";

export const Sidebar = ({ activePage, onNavigate, isOpen, onClose }: { activePage: string, onNavigate: (page: any) => void, isOpen: boolean, onClose: () => void }) => {
    const { logout } = useAuth();
    const NavItem = ({ id, icon: Icon, label, active }: any) => (
        <div
            onClick={() => { onNavigate(id); if (window.innerWidth <= 768) onClose(); }}
            className={`nav-link ${active ? 'active' : ''}`}
        >
            <Icon size={18} />
            <span>{label}</span>
            {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 12px #4ade80' }} />}
        </div>
    );

    return (
        <>
            <div className={`mobile-overlay ${isOpen ? 'sidebar-open' : ''}`} onClick={onClose} />
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <img src={LOGO_URL} alt="WingMentor" className="sidebar-logo fade-in-up" />

                <div className="nav-links fade-in-up" style={{ animationDelay: '0.1s', overflowY: 'auto', paddingRight: 4 }}>

                    <div style={{ marginBottom: 24 }}>
                        <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" active={activePage === 'dashboard'} />
                    </div>

                    <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#aaa', paddingLeft: 16, marginBottom: 8, letterSpacing: '0.1em' }}>PROGRAMS</p>
                        <NavItem id="foundational-verification" icon={BookOpen} label="Foundational" active={activePage === 'foundational-verification'} />
                        <NavItem id="transition-platform" icon={ExternalLink} label="Transition" active={activePage === 'transition-platform'} />
                        <NavItem id="progress_analytics" icon={LineChart} label="My Progress" active={activePage === 'progress_analytics'} />
                    </div>

                    <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#aaa', paddingLeft: 16, marginBottom: 8, letterSpacing: '0.1em' }}>PATHWAYS</p>
                        <NavItem id="emirates-atpl-platform" icon={Globe} label="Emirates ATPL" active={activePage === 'emirates-atpl-platform'} />
                        <NavItem id="air-taxi-platform" icon={Zap} label="Air Taxi" active={activePage === 'air-taxi-platform'} />
                        <NavItem id="private-charter-platform" icon={Briefcase} label="Private Charter" active={activePage === 'private-charter-platform'} />
                        <NavItem id="piloted-drones-platform" icon={Cpu} label="Piloted Drones" active={activePage === 'piloted-drones-platform'} />
                    </div>

                    <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#aaa', paddingLeft: 16, marginBottom: 8, letterSpacing: '0.1em' }}>APPLICATIONS</p>
                        <NavItem id="w1000-suite" icon={AppWindow} label="W1000 Suite" active={activePage === 'w1000-suite'} />
                        <NavItem id="pilot_apps" icon={Tablet} label="EFB Apps" active={activePage === 'pilot_apps'} />
                        <NavItem id="handbook" icon={Book} label="Handbook" active={activePage === 'handbook'} />
                    </div>

                    <div style={{ paddingBottom: 12, marginBottom: 12 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#aaa', paddingLeft: 16, marginBottom: 8, letterSpacing: '0.1em' }}>SYSTEMS</p>
                        <NavItem id="airbus" icon={LayoutGrid} label="Airbus Suite" active={activePage === 'airbus'} />
                        <NavItem id="atlas-cv" icon={FileText} label="ATLAS CV" active={activePage === 'atlas-cv'} />
                        <NavItem id="insights" icon={Globe} label="Airline Insights" active={activePage === 'insights'} />
                        <NavItem id="pilot-recognition" icon={Award} label="Recognition" active={activePage === 'pilot-recognition'} />
                    </div>

                </div>

                <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
                    <div className="nav-link" onClick={logout}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#ccc', textAlign: 'center', marginTop: 16 }}>v2.4.0 • WingMentor Inc.</p>
                </div>
            </aside>
        </>
    );
};
