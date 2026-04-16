"use client";
import React, { useState, useEffect, useRef } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { IMAGES } from "@/src/lib/website-constants";
import { Mail, Lock } from "lucide-react";

interface PilotJourneyScrollProps {
  onNavigate?: (page: string) => void;
}

export const PilotJourneyScroll: React.FC<PilotJourneyScrollProps> = ({ onNavigate }) => {
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 60, y: 50 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [typingField, setTypingField] = useState<null | 'email' | 'password'>(null);
  const [loginPressed, setLoginPressed] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFoundationPlatform, setShowFoundationPlatform] = useState(false);
  const [showModulesPage, setShowModulesPage] = useState(false);
  const [showLowTimerPage, setShowLowTimerPage] = useState(false);
  const [showPilotGapPage, setShowPilotGapPage] = useState(false);
  const [showExaminationPortal, setShowExaminationPortal] = useState(false);
  const [showLicenseSelection, setShowLicenseSelection] = useState(false);
  const [showExaminationInProgress, setShowExaminationInProgress] = useState(false);
  const [showExaminationResults, setShowExaminationResults] = useState(false);
  const [showDigitalLogbook, setShowDigitalLogbook] = useState(false);
  const [showPilotRecognition, setShowPilotRecognition] = useState(false);
  const [showPilotRecognition2, setShowPilotRecognition2] = useState(false);
  const [showResultsToRecognition, setShowResultsToRecognition] = useState(false);
  const [showMentorshipLogbook, setShowMentorshipLogbook] = useState(false);
  const [modulesScrollY, setModulesScrollY] = useState(0);
  const [lowTimerScrollY, setLowTimerScrollY] = useState(0);
  const [examPortalScrollY, setExamPortalScrollY] = useState(0);
  const [examResultsScrollY, setExamResultsScrollY] = useState(0);
  const [pilotRecognitionScrollY, setPilotRecognitionScrollY] = useState(0);
  const [mentorshipLogbookScrollY, setMentorshipLogbookScrollY] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasAnimated = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            runAnimation();
          }
        });
      },
      { threshold: 0.5 }
    );
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  const runAnimation = async () => {
    // Small delay after component is visible
    await new Promise(r => setTimeout(r, 150));
      
      // Show cursor
      setCursorVisible(true);
      
      // Move cursor to email field (right side, ~60% from left, ~45% from top)
      setCursorPosition({ x: 58, y: 42 });
      await new Promise(r => setTimeout(r, 400));
      
      // Click email field
      setCursorPosition({ x: 58, y: 42 });
      await new Promise(r => setTimeout(r, 200));
      setTypingField('email');
      
      // Type email
      const email = "wingmentorprogram@gmail.com";
      for (let i = 0; i <= email.length; i++) {
        setEmailText(email.slice(0, i));
        await new Promise(r => setTimeout(r, 40));
      }
      
      // Finish typing email, pause
      setTypingField(null);
      await new Promise(r => setTimeout(r, 200));
      
      // Move mouse to password field
      setCursorPosition({ x: 58, y: 52 });
      await new Promise(r => setTimeout(r, 250));
      
      // Click on password field
      await new Promise(r => setTimeout(r, 100));
      setTypingField('password');
      await new Promise(r => setTimeout(r, 200));
      
      // Type password (dots)
      const passwordLength = 12;
      for (let i = 0; i <= passwordLength; i++) {
        setPasswordText("•".repeat(i));
        await new Promise(r => setTimeout(r, 40));
      }
      
      setTypingField(null);
      await new Promise(r => setTimeout(r, 250));
      
      // Pause before moving to login
      await new Promise(r => setTimeout(r, 150));
      
      // Move mouse to login button (positioned on the button in right panel)
      setCursorPosition({ x: 62, y: 66 });
      await new Promise(r => setTimeout(r, 450));
      
      // Hover over login button briefly
      await new Promise(r => setTimeout(r, 100));
      
      // Press login button
      setLoginPressed(true);
      await new Promise(r => setTimeout(r, 125));
      setLoginPressed(false);
      await new Promise(r => setTimeout(r, 250));
      
      // Hide cursor
      setCursorVisible(false);
      
      // Show dashboard inside iPad after login
      await new Promise(r => setTimeout(r, 200));
      setShowDashboard(true);

      // Wait for dashboard to render
      await new Promise(r => setTimeout(r, 1000));

      // Show cursor again for dashboard interaction
      setCursorVisible(true);

      // Move cursor to the "Access Platform" button on Foundational Program card
      setCursorPosition({ x: 42, y: 65 });
      await new Promise(r => setTimeout(r, 400));

      // Hover effect on the button
      await new Promise(r => setTimeout(r, 150));

      // Press the button
      setButtonPressed(true);
      await new Promise(r => setTimeout(r, 100));
      setButtonPressed(false);
      await new Promise(r => setTimeout(r, 75));

      // Hide cursor before transition
      setCursorVisible(false);
      await new Promise(r => setTimeout(r, 150));

      // Transition to Foundation Program Platform page with warp effect
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 200));
      setShowFoundationPlatform(true);
      await new Promise(r => setTimeout(r, 200));
      setIsTransitioning(false);

      // Wait for platform page to render
      await new Promise(r => setTimeout(r, 1000));

      // Show cursor again for platform interaction
      setCursorVisible(true);

      // Move cursor to the "View Details" button on Modules card
      setCursorPosition({ x: 18, y: 58 });
      await new Promise(r => setTimeout(r, 400));

      // Hover effect on the button
      await new Promise(r => setTimeout(r, 150));

      // Press the button
      setButtonPressed(true);
      await new Promise(r => setTimeout(r, 100));
      setButtonPressed(false);
      await new Promise(r => setTimeout(r, 75));

      // Hide cursor
      setCursorVisible(false);

      // Show modules page
      setShowModulesPage(true);

      // Wait for modules page to render
      await new Promise(r => setTimeout(r, 800));

      // Show cursor for scrolling
      setCursorVisible(true);

      // Move cursor to scroll position
      setCursorPosition({ x: 50, y: 60 });
      await new Promise(r => setTimeout(r, 400));

      // Animate scrolling down on modules page - single CSS transition for smoothness
      setModulesScrollY(800);
      await new Promise(r => setTimeout(r, 4000)); // Wait for scroll to complete
      
      // Hide cursor
      setCursorVisible(false);
      
      // Wait briefly then transition to Pilot Gap page
      await new Promise(r => setTimeout(r, 500));
      
      // Transition to Pilot Gap page (moved up in sequence)
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 200));
      setShowModulesPage(false);
      setShowPilotGapPage(true);
      await new Promise(r => setTimeout(r, 200));
      setIsTransitioning(false);

      // Wait for Pilot Gap page to display so users can read it
      await new Promise(r => setTimeout(r, 2000));

      // Transition to Low-Timer page
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 250));
      setShowPilotGapPage(false);
      setShowLowTimerPage(true);
      await new Promise(r => setTimeout(r, 250));
      setIsTransitioning(false);

      // Wait for Low-Timer page to render
      await new Promise(r => setTimeout(r, 800));

      // Show cursor for scrolling on Low-Timer page
      setCursorVisible(true);

      // Move cursor to scroll position
      setCursorPosition({ x: 50, y: 60 });
      await new Promise(r => setTimeout(r, 400));

      // Animate scrolling down on Low-Timer page - single CSS transition for smoothness
      setLowTimerScrollY(1500);
      await new Promise(r => setTimeout(r, 5000)); // Wait for scroll to complete
      
      // Hide cursor
      setCursorVisible(false);
      
      // Wait briefly then transition to Examination Portal
      await new Promise(r => setTimeout(r, 500));

      // Wait for Examination Portal to render
      await new Promise(r => setTimeout(r, 500));

      // Transition to Examination Portal with warp zoom effect
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 200));
      setShowLowTimerPage(false);
      setShowExaminationPortal(true);
      await new Promise(r => setTimeout(r, 200));
      setIsTransitioning(false);

      // Wait for Examination Portal to render
      await new Promise(r => setTimeout(r, 1000));

      // Show cursor for clicking Pilot Licensure Examination
      setCursorVisible(true);
      setCursorPosition({ x: 72, y: 58 }); // Position on "Select License & Start" button
      await new Promise(r => setTimeout(r, 1000));
      
      // Click animation
      setButtonPressed(true);
      await new Promise(r => setTimeout(r, 200));
      setButtonPressed(false);
      await new Promise(r => setTimeout(r, 400));
      
      // Hide cursor
      setCursorVisible(false);
      
      // Transition to License Selection page
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 250));
      setShowExaminationPortal(false);
      setShowLicenseSelection(true);
      await new Promise(r => setTimeout(r, 250));
      setIsTransitioning(false);

      // Wait for License Selection to render
      await new Promise(r => setTimeout(r, 800));
      
      // Show cursor for selecting CPL
      setCursorVisible(true);
      setCursorPosition({ x: 25, y: 50 }); // Position on CPL card
      await new Promise(r => setTimeout(r, 600));
      
      // Click on CPL
      setButtonPressed(true);
      await new Promise(r => setTimeout(r, 150));
      setButtonPressed(false);
      await new Promise(r => setTimeout(r, 200));
      
      // Hide cursor
      setCursorVisible(false);
      
      // Transition to Examination In Progress
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 250));
      setShowLicenseSelection(false);
      setShowExaminationInProgress(true);
      await new Promise(r => setTimeout(r, 250));
      setIsTransitioning(false);

      // Wait for exam to display
      await new Promise(r => setTimeout(r, 2000));
      
      // Transition to Examination Results
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 250));
      setShowExaminationInProgress(false);
      setShowExaminationResults(true);
      await new Promise(r => setTimeout(r, 250));
      setIsTransitioning(false);

      // Wait for Examination Results to render
      await new Promise(r => setTimeout(r, 800));

      // Show cursor for scrolling
      setCursorVisible(true);
      setCursorPosition({ x: 50, y: 60 });
      await new Promise(r => setTimeout(r, 400));

      // Scroll down through Examination Results - single CSS transition for smoothness
      setExamResultsScrollY(700);
      await new Promise(r => setTimeout(r, 4000)); // Wait for scroll to complete
      
      // Hide cursor
      setCursorVisible(false);

      // Wait then show results to recognition transition
      await new Promise(r => setTimeout(r, 500));

      // Show Results to Recognition transition page
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 250));
      setShowExaminationResults(false);
      setShowResultsToRecognition(true);
      await new Promise(r => setTimeout(r, 250));
      setIsTransitioning(false);

      // Wait for transition page to display
      await new Promise(r => setTimeout(r, 3000));

      // Transition to Pilot Recognition page with ATLAS CV
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 250));
      setShowResultsToRecognition(false);
      setShowPilotRecognition2(true);
      await new Promise(r => setTimeout(r, 250));
      setIsTransitioning(false);

      // Wait for Pilot Recognition page to render
      await new Promise(r => setTimeout(r, 1000));

      // Show cursor for scrolling
      setCursorVisible(true);
      setCursorPosition({ x: 50, y: 60 });
      await new Promise(r => setTimeout(r, 400));

      // Scroll down to reveal the ATLAS CV card (red header component)
      setPilotRecognitionScrollY(800);
      await new Promise(r => setTimeout(r, 3000)); // Wait for scroll to complete

      // Move cursor to "View Flight Digital Logbook" button
      setCursorPosition({ x: 25, y: 72 });
      await new Promise(r => setTimeout(r, 800));
      
      // Click the button
      setButtonPressed(true);
      await new Promise(r => setTimeout(r, 150));
      setButtonPressed(false);
      await new Promise(r => setTimeout(r, 200));
      
      // Hide cursor after click
      await new Promise(r => setTimeout(r, 300));
      setCursorVisible(false);
      await new Promise(r => setTimeout(r, 300));

      // Transition to Digital Flight Logbook
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 250));
      setShowPilotRecognition2(false);
      setShowDigitalLogbook(true);
      await new Promise(r => setTimeout(r, 250));
      setIsTransitioning(false);

      // Wait for Digital Logbook to render
      await new Promise(r => setTimeout(r, 1500));

      // Wait briefly then transition to Mentorship Logbook
      await new Promise(r => setTimeout(r, 500));

      // Transition to Mentorship Logbook
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 250));
      setShowDigitalLogbook(false);
      setShowMentorshipLogbook(true);
      await new Promise(r => setTimeout(r, 250));
      setIsTransitioning(false);

      // Wait for Mentorship Logbook to render
      await new Promise(r => setTimeout(r, 800));

      // Show cursor for scrolling
      setCursorVisible(true);
      setCursorPosition({ x: 50, y: 60 });
      await new Promise(r => setTimeout(r, 400));

      // Scroll down through Mentorship Logbook
      setMentorshipLogbookScrollY(600);
      await new Promise(r => setTimeout(r, 3000)); // Wait for scroll to complete

      // Hide cursor
      setCursorVisible(false);
      await new Promise(r => setTimeout(r, 300));

      // Wait briefly then transition to Platform Dashboard
      await new Promise(r => setTimeout(r, 500));

      // Transition to Platform Dashboard
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 250));
      setShowMentorshipLogbook(false);
      setShowDashboard(true);
      await new Promise(r => setTimeout(r, 250));
      setIsTransitioning(false);

      // Wait for Dashboard to render
      await new Promise(r => setTimeout(r, 1000));

      // Animation ends on the Platform Dashboard
      setAnimationComplete(true);
  };

  return (
    <div ref={containerRef} className="flex flex-col overflow-hidden bg-white">
      <ContainerScroll
        titleComponent={
          <>
            <img
              src={IMAGES.LOGO}
              alt="WingMentor Logo"
              className="mx-auto w-48 md:w-64 h-auto object-contain mb-6 opacity-90"
            />
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
              The Pilot Portal.
              <br />
              <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520' }}>
                Programs | Pilot Recognition | Pathways
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto mt-4 mb-3">
              <span className="font-bold text-slate-800">The first step towards your Pilot recognition.</span> Join WingMentor network to gain access to the programs, pathways, and pilot recognition.
            </p>
            <a 
              href="#" 
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm md:text-base underline cursor-pointer"
            >
              Create Account
            </a>
          </>
        }
      >

        {/* Screen Content Inside iPad Frame */}
        <div className={`relative w-full h-full rounded-[20px] overflow-hidden transition-all duration-500 ease-in-out ${
          isTransitioning ? 'scale-95 blur-md opacity-50' : 'scale-100 blur-0 opacity-100'
        }`}>
          {!showDashboard && !showFoundationPlatform && !showModulesPage && !showLowTimerPage && !showPilotGapPage && !showExaminationPortal && !showLicenseSelection && !showExaminationInProgress && !showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
            /* Login Screen */
            <div className={`relative w-full h-full flex items-center justify-center p-8 ${animationComplete ? '' : 'pointer-events-none'}`}>
              {/* Background Shader - Cloud/Sky */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop"
                  alt="Cloud background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-blue-300/20 to-white/40 backdrop-blur-[2px]" />
              </div>
              
              {/* Login Card - Smaller and more square */}
              <div className="relative z-10 w-[75%] h-[65%] rounded-[12px] overflow-hidden shadow-2xl flex pointer-events-none">
                {/* Mouse Cursor */}
                <div
                  className={`absolute z-50 pointer-events-none transition-all duration-700 ease-in-out ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    left: `${cursorPosition.x}%`,
                    top: `${cursorPosition.y}%`,
                    transform: 'translate(-100%, -20%)',
                    transitionProperty: 'left, top, opacity',
                  }}
                >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="white" stroke="#1a1a2e" strokeWidth="1"/>
              </svg>
              {/* Click ripple effect */}
              <div className={`absolute inset-0 flex items-center justify-center ${typingField ? 'scale-0' : 'scale-100'} transition-transform duration-150`}>
                <div className="w-4 h-4 rounded-full bg-blue-400/30 animate-ping" />
              </div>
            </div>

            {/* Left Side - Dark Blue */}
            <div className="w-1/2 bg-gradient-to-br from-[#0d1f35] to-[#051020] flex flex-col items-center justify-center p-5 text-center">
              <img
                src={IMAGES.LOGO}
                alt="WingMentor Logo"
                className="w-16 h-auto object-contain mb-3 opacity-90"
              />
              <p className="text-[8px] font-bold tracking-[0.25em] uppercase text-white/50 mb-1.5">
                Mentor Network
              </p>
              <h3 className="text-white font-semibold text-base mb-3">Pilot Portal</h3>
              <p className="text-white/70 text-[9px] leading-relaxed max-w-[180px] mb-3">
                Access personalized program enrollment, pathway briefs, and WingMentor Pilot Portfolio data—covering flight experience, assessments, and ATS-ready records shared with approved aviation bodies.
              </p>
              <div className="px-4 py-1.5 bg-white/10 text-white text-[9px] rounded-full border border-white/20">
                Learn more
              </div>
            </div>
            
            {/* Right Side - Light */}
            <div className="w-1/2 bg-[#eef2f6] flex flex-col justify-center p-5">
              <h2 className="text-slate-800 font-medium text-xs mb-0.5">Connecting pilots to the aviation industry</h2>
              <p className="text-slate-500 text-[9px] mb-2">Sign in with your WingMentor credentials.</p>
              
              {/* Badge - Blue pill style */}
              <div className="mb-2">
                <span className="inline-block px-2 py-0.5 bg-blue-100/80 text-blue-600 text-[8px] rounded-md font-medium">Change Optimization</span>
              </div>
              
              <p className="text-[7px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-1.5">WingMentor Account</p>
              
              {/* Form Fields */}
              <div className="space-y-1.5">
                <div className={`flex items-center gap-2 px-2.5 py-1.5 bg-white border rounded-lg text-[10px] transition-all ${typingField === 'email' ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'}`}>
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className={emailText ? 'text-slate-700' : 'text-slate-400'}>
                    {emailText || 'Email'}
                  </span>
                  {typingField === 'email' && (
                    <span className="w-0.5 h-3 bg-blue-500 animate-pulse ml-0.5" />
                  )}
                </div>
                <div className={`flex items-center gap-2 px-2.5 py-1.5 bg-white border rounded-lg text-[10px] transition-all ${typingField === 'password' ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'}`}>
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span className={passwordText ? 'text-slate-700' : 'text-slate-400'}>
                    {passwordText || 'Password'}
                  </span>
                  {typingField === 'password' && (
                    <span className="w-0.5 h-3 bg-blue-500 animate-pulse ml-0.5" />
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-1">
                <span className="text-blue-500 text-[9px]">Forgot Password?</span>
              </div>
              
              <div className={`w-full mt-1.5 py-1.5 text-white text-[10px] font-medium rounded-lg text-center flex items-center justify-center gap-1 transition-all duration-100 ${loginPressed ? 'bg-slate-600 scale-95' : 'bg-slate-800'}`}>
                Login <span>→</span>
              </div>
              
              <div className="flex items-center gap-1 mt-2">
                <div className="w-3 h-3 rounded border border-slate-300 bg-white" />
                <span className="text-slate-500 text-[9px]">Remember me</span>
              </div>
              
              <p className="text-slate-400 text-[8px] mt-2">
                Not a member? <span className="text-blue-500">Create an account</span> • <span className="text-blue-500">Visit Pilot Network</span>
              </p>
            </div>
          </div>
        </div>
          )}
          {showDashboard && !showFoundationPlatform && !showModulesPage && !showLowTimerPage && !showPilotGapPage && !showExaminationPortal && !showLicenseSelection && !showExaminationInProgress && !showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Dashboard View Inside iPad - Full Dashboard Layout */
        <div className={`w-full h-full bg-[#f0f4f8] flex relative ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Mouse Cursor */}
          <div
            className={`absolute z-50 pointer-events-none transition-all duration-700 ease-in-out ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
              left: `${cursorPosition.x}%`,
              top: `${cursorPosition.y}%`,
              transform: 'translate(-100%, -20%)',
              transitionProperty: 'left, top, opacity',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="white" stroke="#1a1a2e" strokeWidth="1"/>
            </svg>
            {/* Click ripple effect */}
            <div className="absolute inset-0 flex items-center justify-center scale-100 transition-transform duration-150">
              <div className="w-4 h-4 rounded-full bg-blue-400/30 animate-ping" />
            </div>
          </div>
          {/* Left Sidebar */}
          <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto">
            {/* Logo */}
            <div className="p-4 border-b border-slate-100">
              <img src={IMAGES.LOGO} alt="WingMentor" className="w-12 h-auto mb-2" />
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600">
                Connecting pilots to the industry
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', desc: 'Flight logs, training records, and documents', icon: '□', active: true, image: 'https://pilotnetwork.vercel.app/Captain-Paperwork-Medium.jpg' },
                { id: 'programs', label: 'Programs', desc: 'Foundational and Transition mentorship programs', icon: '○', image: 'https://pilotnetwork.vercel.app/Gemini_Generated_Image_7awns87awns87awn.png' },
                { id: 'pathways', label: 'Pathways', desc: 'Structured career roadmaps and training tracks', icon: '○', image: 'https://pilotnetwork.vercel.app/shutterstock_1698112222.jpg' },
                { id: 'recognition', label: 'Pilot Recognition', desc: 'Awards, flight hours, and certifications', icon: '○', image: 'https://pilotnetwork.vercel.app/Gemini_Generated_Image_tka3njtka3njtka3.png' },
                { id: 'network', label: 'WingMentor Network', desc: 'Recognition hub, knowledge bank, and aviation community', icon: '○', image: 'https://pilotnetwork.vercel.app/Networking.jpg' },
                { id: 'news', label: 'News & Updates', desc: 'Latest announcements and industry insights', icon: '○', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
              ].map((item) => (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-xl transition-all cursor-pointer overflow-hidden ${
                    item.active 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {item.image ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] font-bold uppercase tracking-wide mb-0.5 ${
                          item.active ? 'text-blue-900' : 'text-slate-700'
                        }`}>
                          {item.label}
                        </p>
                        <p className="text-[9px] text-slate-500 leading-tight">{item.desc}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.active ? 'bg-slate-200 text-slate-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <span className="text-xs">→</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        item.active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className="text-xs">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] font-bold uppercase tracking-wide mb-0.5 ${
                          item.active ? 'text-blue-900' : 'text-slate-700'
                        }`}>
                          {item.label}
                        </p>
                        <p className="text-[9px] text-slate-500 leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-slate-100 space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px]">?</span>
                Contact Support
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px]">!</span>
                Guidance
              </button>
              <button 
                onClick={() => setShowDashboard(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <span>→</span>
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full">
            {/* Top Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Welcome back</p>
                <p className="text-xs font-semibold text-slate-700">benjamintigerbowler</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] text-slate-600 hover:bg-slate-200 transition-colors">
                  <span>☾</span>
                  <span>Dark Mode</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] text-slate-600 hover:bg-slate-200 transition-colors">
                  <span>⊞</span>
                  <span>Pilot Modules</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] text-slate-600 hover:bg-slate-200 transition-colors">
                  <span>○</span>
                  <span>Profile</span>
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600">
                  <span>⚙</span>
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <span>🌐</span>
                  Access Website
                </button>
              </div>
            </header>

            {/* Dashboard Content */}
            <div 
              className="flex-1 p-3 overflow-y-auto"
            >
              {/* Back Link */}
              <button className="text-[9px] text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2">
                <span>←</span>
                Back to Hub
              </button>

              {/* Header */}
              <div className="text-center mb-4">
                <img src={IMAGES.LOGO} alt="WingMentor" className="w-16 h-auto mx-auto mb-2" />
                <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-1">
                  Connecting pilots to the industry
                </p>
                <h1 className="text-lg font-serif text-slate-900 mb-1">Dashboard</h1>
                <p className="text-[9px] text-slate-500">
                  Your central hub for flight logs, training records, program progress,<br />
                  and career development resources.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 mb-3"></div>

              {/* Programs Section */}
              <div className="mb-4">
                <h2 className="text-base font-serif text-slate-900 mb-1">Programs</h2>
                <p className="text-[10px] text-slate-500 mb-3">
                  Track your training progress and program enrollment<br />
                  across all WingMentor programs
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {/* Core Training Card */}
                  <div className="bg-white rounded-lg p-2 border border-slate-200 hover:shadow-md transition-shadow flex flex-col h-full">
                    <p className="text-[7px] font-bold tracking-wider text-slate-400 uppercase mb-1">Core Training</p>
                    <h3 className="text-[9px] font-semibold text-slate-900 mb-1">Foundational Program</h3>
                    <p className="text-[8px] text-slate-500 mb-2 leading-relaxed flex-1">
                      Master core aviation fundamentals, instrument procedures, and CRM techniques through structured simulator training.
                    </p>
                    <button className={`w-full py-1 text-white text-[8px] font-medium rounded-lg transition-all flex items-center justify-center gap-1 mt-auto ${buttonPressed ? 'bg-sky-600 scale-95' : 'bg-sky-400 hover:bg-sky-500'}`}>
                      Access Platform <span>→</span>
                    </button>
                  </div>

                  {/* Airbus Aligned Card */}
                  <div className="bg-white rounded-lg p-2 border border-slate-200 hover:shadow-md transition-shadow flex flex-col h-full">
                    <p className="text-[7px] font-bold tracking-wider text-slate-400 uppercase mb-1">Airbus Aligned</p>
                    <h3 className="text-[9px] font-semibold text-slate-900 mb-1">EBT CBTA Initial Pilot Recognition Interview</h3>
                    <p className="text-[8px] text-slate-500 mb-2 leading-relaxed flex-1">
                      AIRBUS-aligned Evidence-Based Training and Competency-Based Training & Assessment interview for initial pilot recognition and industry placement readiness.
                    </p>
                    <button className="w-full py-1 bg-sky-400 text-white text-[8px] font-medium rounded-lg hover:bg-sky-500 transition-colors flex items-center justify-center gap-1 mt-auto">
                      Access Interview <span>→</span>
                    </button>
                  </div>

                  {/* Assessments Card - Dark */}
                  <div className="bg-slate-800 rounded-lg p-2 text-white flex flex-col h-full">
                    <div className="flex items-start gap-2 mb-2">
                      <img 
                        src="https://pilotnetwork.vercel.app/examinationterminalapp.png" 
                        alt="Examination Terminal" 
                        className="w-6 h-6 rounded object-cover"
                      />
                      <div>
                        <p className="text-[7px] font-bold tracking-wider text-slate-400 uppercase mb-0.5">Assessments</p>
                        <h3 className="text-[9px] font-semibold">Examination Portal</h3>
                      </div>
                    </div>
                    <p className="text-[8px] text-slate-400 mb-2 leading-relaxed flex-1">
                      Access your examination portal, view results, and track your assessment progress across all modules.
                    </p>
                    <button className="w-full py-1 bg-slate-700 text-white text-[8px] font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-1 border border-slate-600 mt-auto">
                      Access Portal <span>→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Program Overview */}
              <div className="bg-white rounded-xl p-3 border border-slate-200">
                <h3 className="text-[10px] font-semibold text-slate-900 mb-2">Program Overview</h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <p className="text-base font-bold text-slate-900">0</p>
                    <p className="text-[7px] text-slate-500 uppercase tracking-wide mt-0.5">Active Programs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-slate-900">92%</p>
                    <p className="text-[7px] text-slate-500 uppercase tracking-wide mt-0.5">Completion Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-slate-900">73%</p>
                    <p className="text-[7px] text-slate-500 uppercase tracking-wide mt-0.5">Assessment Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-slate-900">50 hrs</p>
                    <p className="text-[7px] text-slate-500 uppercase tracking-wide mt-0.5">Training Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          )}
          {showFoundationPlatform && !showModulesPage && !showLowTimerPage && !showPilotGapPage && !showExaminationPortal && !showLicenseSelection && !showExaminationInProgress && !showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Foundation Program Platform View Inside iPad */
        <div className={`w-full h-full bg-white flex flex-col overflow-hidden relative ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Mouse Cursor */}
          <div
            className={`absolute z-50 pointer-events-none transition-all duration-700 ease-in-out ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
              left: `${cursorPosition.x}%`,
              top: `${cursorPosition.y}%`,
              transform: 'translate(-100%, -20%)',
              transitionProperty: 'left, top, opacity',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="white" stroke="#1a1a2e" strokeWidth="1"/>
            </svg>
            {/* Click ripple effect */}
            <div className="absolute inset-0 flex items-center justify-center scale-100 transition-transform duration-150">
              <div className="w-4 h-4 rounded-full bg-blue-400/30 animate-ping" />
            </div>
          </div>
          {/* Simple Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setShowFoundationPlatform(false)}
              className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>←</span>
              Back to Dashboard
            </button>
            <div className="flex-1"></div>
            <img src={IMAGES.LOGO} alt="WingMentor" className="w-8 h-auto" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Logo and Title */}
            <div className="text-center mb-4">
              <img
                src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                alt="WingMentor Logo"
                className="mx-auto w-20 h-auto object-contain mb-2"
              />
              <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-700 mb-2">
                WingMentor Programs
              </p>
              <h1 className="text-lg font-serif text-slate-900 mb-2">
                Foundation Program Platform
              </h1>
              <p className="text-[9px] text-blue-600">
                Welcome back, benjamintigerbowler
              </p>
            </div>

            {/* Description */}
            <p className="text-[9px] text-slate-600 text-center mb-4 max-w-md mx-auto leading-relaxed">
              Your central hub for the Foundation Program. Track your progress through structured modules, complete assessments, access your pilot portfolio, and connect with mentorship resources all in one place.
            </p>

            {/* Three Cards */}
            <div className="grid grid-cols-3 gap-2 mb-3 items-stretch">
              {/* Modules Card */}
              <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm h-full flex flex-col">
                <h3 className="text-[10px] font-bold text-slate-900 mb-1">Modules</h3>
                <p className="text-[8px] text-slate-500 mb-2 leading-relaxed flex-1">
                  Access the Foundation syllabus modules including Pilot Gap Module and Pilot Gap Module 2. Continue your mentorship journey.
                </p>
                <button className={`w-full py-1.5 text-white text-[8px] font-medium rounded transition-all mt-auto ${buttonPressed ? 'bg-blue-800 scale-95' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  View Details
                </button>
              </div>

              {/* Progress Card */}
              <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm h-full flex flex-col">
                <h3 className="text-[10px] font-bold text-slate-900 mb-1">Progress & Examination Board</h3>
                <p className="text-[8px] text-slate-500 mb-2 leading-relaxed flex-1">
                  Track your journey through the Foundation Program. View completed modules, upcoming milestones, and your overall advancement.
                </p>
                <button className="w-full py-1.5 bg-blue-600 text-white text-[8px] font-medium rounded hover:bg-blue-700 transition-colors mt-auto">
                  View Progress
                </button>
              </div>

              {/* Logbook Card */}
              <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm h-full flex flex-col">
                <h3 className="text-[10px] font-bold text-slate-900 mb-1">Mentorship Logbook</h3>
                <p className="text-[8px] text-slate-500 mb-2 leading-relaxed flex-1">
                  Record and track your mentorship sessions, hours, 50hrs certification progress tracking, and program milestones.
                </p>
                <button className="w-full py-1.5 bg-blue-600 text-white text-[8px] font-medium rounded hover:bg-blue-700 transition-colors mt-auto">
                  Open Logbook
                </button>
              </div>
            </div>

            {/* W1000 Directory Row */}
            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-[10px]">📝</span>
                </div>
                <div>
                  <h4 className="text-[9px] font-bold text-slate-900">W1000 Directory</h4>
                  <p className="text-[8px] text-slate-500">Launch the W1000 logbook, mentorship assignments, and reference materials</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-white text-slate-700 text-[8px] font-medium rounded border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1">
                Access W1000
                <span>↗</span>
              </button>
            </div>

            {/* Footer Link */}
            <div className="text-center">
              <p className="text-[8px] text-blue-600">
                Directory for the program details to the enrollment page →
              </p>
            </div>
          </div>
        </div>
          )}
          {showModulesPage && !showLowTimerPage && !showPilotGapPage && !showExaminationPortal && !showLicenseSelection && !showExaminationInProgress && !showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Modules Page View Inside iPad - Welcome Aboard */
        <div className={`w-full h-full bg-white flex flex-col overflow-hidden ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Simple Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setShowModulesPage(false)}
              className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>←</span>
              Back to Platform
            </button>
            <div className="flex-1"></div>
            <img src={IMAGES.LOGO} alt="WingMentor" className="w-8 h-auto" />
          </div>

          {/* Scrollable Content */}
          <div 
            className="flex-1 overflow-hidden bg-slate-50"
          >
            <div
              className="p-4 transition-transform ease-linear"
              style={{ 
                transform: `translateY(-${modulesScrollY}px)`,
                paddingBottom: `${modulesScrollY + 24}px`,
                transitionDuration: '4s'
              }}
            >
            {/* Logo */}
            <div className="text-center mb-4">
              <img 
                src={IMAGES.LOGO} 
                alt="WingMentor" 
                className="w-16 h-auto mx-auto mb-3" 
              />
            </div>

            {/* Module Header */}
            <div className="text-center mb-6">
              <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">
                MODULE 01 START
              </p>
              <h1 className="text-2xl font-serif text-slate-900 mb-4">
                Welcome Aboard
              </h1>
            </div>

            {/* Introduction Section */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                INTRODUCTION
              </p>
              <h2 className="text-base font-serif text-slate-900 mb-3">
                Welcome to the Wingmentor Foundation Program
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                This program is engineered to provide you with the structure, support, and verifiable experience necessary to navigate the complexities of the aviation industry. We do not just prepare you to apply; we rigorously assess and calibrate your skills against active EBT (Evidence-Based Training) and CBTA standards, ensuring you are inherently airline-ready.
              </p>
              <p className="text-[9px] text-slate-600 leading-relaxed mt-2">
                Your journey towards command starts now.
              </p>
            </div>

            {/* Support Network Card */}
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2 text-center">
                SUPPORT NETWORK
              </p>
              <h3 className="text-sm font-serif text-slate-900 mb-3 text-center">
                A Message From the Wingmentor Team
              </h3>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                The entire WingMentor operational team is here to support you. We are a collective of active pilots, instructors, and industry professionals dedicated to your success. We manage the logistics, verify the experience, and leverage advanced tracking applications to ensure this program's standards are upheld with unwavering integrity. Consider us—and the platform we've built—your ground crew, ready to keep your flight path clear and your objectives met.
              </p>
            </div>

            {/* Vision & Commitment Section */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                VISION & COMMITMENT
              </p>
              <h2 className="text-base font-serif text-slate-900 mb-3">
                A Welcome From the Founders
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed mb-4">
                On behalf of the entire Wingmentor team, we extend our warmest welcome. You have officially joined a dedicated Pilot Recognition Program committed to excellence, mutual support, and overcoming one of the industry's greatest challenges.
              </p>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                You are now more than a pilot; you are a vital contributor to a movement that is reshaping the future of aviation careers. We operate with professionalism, integrity, and a relentless focus on our collective success. This handbook is your guide. Welcome aboard.
              </p>
            </div>

            {/* Founders */}
            <div className="flex justify-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-900">BENJAMIN TIGER BOWLER</p>
                <p className="text-[8px] text-blue-600 uppercase tracking-wide">FOUNDER</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-900">KARL BRIAN VOGT</p>
                <p className="text-[8px] text-blue-600 uppercase tracking-wide">FOUNDER</p>
              </div>
            </div>

            {/* The Ecosystem Section */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                THE ECOSYSTEM
              </p>
              <h2 className="text-base font-serif text-slate-900 mb-3">
                Your Digital Footprint
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                WingMentor is not an agency—it is a complete ecosystem designed to put you in control. As you progress through the Foundation Program, every assessment, evaluation, and milestone is tracked. This data culminates in your Pilot Recognition Profile—an ATLAS-compliant, verified portfolio. We do not just send your resume into the void. Our proprietary AI-driven Pathways system actively matches your verified profile with the exact, current requirements of our airline partners. You do the work; we ensure the industry sees it.
              </p>
            </div>

            {/* Philosophy Card */}
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4 max-w-md mx-auto text-center">
              <img 
                src={IMAGES.LOGO} 
                alt="WingMentor" 
                className="w-12 h-auto mx-auto mb-3" 
              />
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                OUR PHILOSOPHY
              </p>
              <h3 className="text-sm font-serif text-slate-900 mb-2">
                The Experience Paradox
              </h3>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                The aviation industry faces a fundamental paradox: pilots need experience to get hired, but cannot gain experience without being hired. WingMentor breaks this cycle by providing verified, structured experience that airlines recognize and value. We don't just prepare you—we certify your readiness.
              </p>
            </div>

            {/* Next Steps Section */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                NEXT STEPS
              </p>
              <h2 className="text-base font-serif text-slate-900 mb-3">
                Your Journey Begins
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed mb-4">
                Your path forward is clear. Complete the Foundation Program modules, pass the required examinations, and build your verified experience profile. Our team will guide you every step of the way.
              </p>
              <div className="flex justify-center gap-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-[8px] font-bold text-blue-600 mb-1">STEP 1</p>
                  <p className="text-[9px] text-slate-700">Complete Modules</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-[8px] font-bold text-blue-600 mb-1">STEP 2</p>
                  <p className="text-[9px] text-slate-700">Pass Examinations</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-[8px] font-bold text-blue-600 mb-1">STEP 3</p>
                  <p className="text-[9px] text-slate-700">Get Recognized</p>
                </div>
              </div>
            </div>

            {/* Closing Message */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white text-center max-w-md mx-auto mb-4">
              <p className="text-[10px] font-bold tracking-wide mb-2">READY TO TAKE OFF?</p>
              <h3 className="text-lg font-serif mb-2">Your Future Awaits</h3>
              <p className="text-[9px] opacity-90 leading-relaxed">
                The aviation industry is waiting for pilots like you. Pilots who are verified, trained, and ready. Let's begin this journey together.
              </p>
            </div>

            {/* Contact Support */}
            <div className="text-center max-w-md mx-auto">
              <p className="text-[8px] text-slate-500 mb-2">Need assistance?</p>
              <p className="text-[9px] text-blue-600 hover:underline cursor-pointer">Contact WingMentor Support →</p>
            </div>
            </div>
          </div>
        </div>
          )}
          {showLowTimerPage && !showPilotGapPage && !showExaminationPortal && !showLicenseSelection && !showExaminationInProgress && !showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Low-Timer Pilot Page View Inside iPad */
        <div className={`w-full h-full bg-white flex flex-col overflow-hidden ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Simple Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setShowLowTimerPage(false)}
              className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>←</span>
              Back to Modules
            </button>
            <div className="flex-1"></div>
            <img src={IMAGES.LOGO} alt="WingMentor" className="w-8 h-auto" />
          </div>

          {/* Scrollable Content */}
          <div 
            className="flex-1 overflow-hidden bg-slate-50"
          >
            <div
              className="p-6 transition-transform ease-linear"
              style={{ 
                transform: `translateY(-${lowTimerScrollY}px)`,
                paddingBottom: `${lowTimerScrollY + 24}px`,
                transitionDuration: '5s'
              }}
            >
            {/* Logo - Centered */}
            <div className="flex justify-center mb-4">
              <img 
                src={IMAGES.LOGO} 
                alt="WingMentor" 
                className="w-20 h-auto" 
              />
            </div>

            {/* Chapter Header */}
            <div className="text-center mb-6">
              <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">
                CHAPTER 01 — UNDERSTANDING THE WHAT'S
              </p>
              <h1 className="text-2xl font-serif text-slate-900 mb-2">
                What is a Low-Timer Pilot?
              </h1>
            </div>

            {/* Introduction */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[9px] text-slate-600 leading-relaxed">
                Upon earning your commercial license, you are immediately pushed into a new, unspoken classification. In this section, we define the true identity of the "Low-Timer." You will learn how the industry hourglass restricts your movement, the fierce competitive landscape of airline recruitment, and how this label dictates your immediate options.
              </p>
            </div>

            {/* Hourglass Image */}
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-6 max-w-md mx-auto">
              <img 
                src="/images/low-timer/hourglass-pilot-gap.png" 
                alt="Pilot Gap Hourglass" 
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* The Reservoir Section */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                THE RESERVOIR
              </p>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                Those who successfully navigate the restrictive "neck" of the hourglass reach the bottom—becoming part of the <strong className="text-slate-900">High-Timers</strong> segment. This lower reservoir represents the actual global pilot shortage aggressively reported by the media. The crucial takeaway is this: the industry does not have a general pilot shortage; it has a "ready-to-hire" shortage, driven entirely by the prohibitive barriers to entry at the midpoint.
              </p>
            </div>

            {/* Candidates Image */}
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-6 max-w-md mx-auto">
              <img 
                src="/images/low-timer/candidates-pilot-gap.png" 
                alt="Pilot Candidates" 
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* The Reality Section */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                THE REALITY
              </p>
              <h2 className="text-lg font-serif text-slate-900 mb-3">
                Understanding Where You Stand
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed mb-3">
                When applying for your first airline role, it is critical to understand exactly who is sitting next to you in the waiting room. You are not just competing with other fresh graduates. You are positioned alongside seasoned military pilots molded by highly structured operational environments, and flight instructors who have already ground out their 1,500 hours.
              </p>
              <p className="text-[9px] text-slate-600 leading-relaxed mb-3">
                As a 200-hour pilot with no category or type ratings, the harsh reality is that you are placed at the very bottom of the stack. Without verifiable data to prove your competency, you represent the highest operational risk to an employer.
              </p>
              <p className="text-[9px] text-blue-600 leading-relaxed">
                In relation to this fiercely competitive landscape, you must understand the "Pilot Paradox & Shortage"—the critical misalignment between the sheer volume of licenses held and the industry's actual operational demand. You will discover exactly what this paradox means, and the heavy impact it has on your career trajectory, on the next page.
              </p>
            </div>

            {/* The Experience Gap Section */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                THE EXPERIENCE GAP
              </p>
              <h2 className="text-lg font-serif text-slate-900 mb-3">
                The Multi-Crew Deficit
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                To an airline recruiter or an insurance underwriter, being a Low-Timer means you have only mastered the sterile, predictable environment of a single-pilot training bubble. It means you inherently lack the advanced Crew Resource Management (CRM) and multi-crew experience required to manage a commercial flight deck under stress.
              </p>
            </div>

            {/* The Certification Gap Section */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                THE CERTIFICATION GAP
              </p>
              <h2 className="text-lg font-serif text-slate-900 mb-3">
                Beyond the Private License
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed mb-3">
                A commercial pilot license is merely the entry ticket, not the destination. The industry demands type ratings, instrument certifications, and multi-engine endorsements that cost tens of thousands of dollars beyond your initial training investment.
              </p>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                Without these additional qualifications, you remain trapped in the "Low-Timer" classification indefinitely. The financial barrier creates a catch-22: you need experience to get hired, but you need to be hired to gain experience and afford further certifications.
              </p>
            </div>

            {/* The Network Effect Section */}
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2 text-center">
                THE NETWORK EFFECT
              </p>
              <h3 className="text-sm font-serif text-slate-900 mb-3 text-center">
                Who You Know Matters
              </h3>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                In an industry where safety is paramount and training costs are astronomical, airlines rely heavily on referrals and proven track records. The pilots who transition successfully from Low-Timer to High-Timer status often have mentorship connections, family ties, or exceptional networking skills that bypass the traditional barriers.
              </p>
            </div>

            {/* Next Steps Section */}
            <div className="text-center mb-6 max-w-md mx-auto">
              <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
                NEXT STEPS
              </p>
              <h2 className="text-lg font-serif text-slate-900 mb-3">
                Breaking Through the Barrier
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed mb-3">
                Understanding your position is the first step toward changing it. The WingMentor Foundation Program is designed specifically to address the Low-Timer paradox by providing structured pathways, verifiable competency tracking, and direct connections to industry partners who value demonstrated skill over arbitrary hour counts.
              </p>
              <p className="text-[9px] text-blue-600 leading-relaxed">
                Continue to Chapter 02 to explore the WingMentor solution and how we bridge the gap between where you are and where the industry needs you to be.
              </p>
            </div>

            {/* Completion Card */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6 max-w-md mx-auto text-center">
              <p className="text-[10px] font-bold text-blue-700 mb-2">
                ✓ Chapter 01 Complete
              </p>
              <p className="text-[9px] text-slate-600">
                You now understand the Low-Timer classification and the industry dynamics that create this barrier. Proceed to Chapter 02: The WingMentor Pathway.
              </p>
            </div>
            </div>
          </div>
        </div>
          )}
          {showPilotGapPage && !showExaminationPortal && !showLicenseSelection && !showExaminationInProgress && !showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Pilot Gap Page - Simple White Page */
        <div className={`w-full h-full bg-white flex flex-col items-center justify-center p-8 ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Title - Georgian/Serif Font */}
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6 text-center leading-tight">
            what is the pilot <span className="text-red-600">gap</span>?
          </h1>
          
          {/* Blue Subtitle */}
          <p className="text-sm md:text-base text-blue-600 uppercase tracking-[0.3em] font-semibold text-center">
            understand the industry through Programs
          </p>
        </div>
          )}
          {showExaminationPortal && !showLicenseSelection && !showExaminationInProgress && !showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Examination Portal Page */
        <div className={`w-full h-full bg-[#f0f4f8] flex flex-col overflow-hidden ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setShowExaminationPortal(false)}
              className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>←</span>
              Back to Program Progress
            </button>
            <div className="flex-1"></div>
            <img src={IMAGES.LOGO} alt="WingMentor" className="w-8 h-auto" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <div
              className="p-6 transition-transform ease-linear"
              style={{ 
                transform: `translateY(-${examPortalScrollY}px)`,
                paddingBottom: `${examPortalScrollY + 24}px`,
                transitionDuration: '5s'
              }}
            >
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img src={IMAGES.LOGO} alt="WingMentor" className="w-16 h-auto" />
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">
                  WINGMENTOR PROGRAMS
                </p>
                <h1 className="text-2xl font-serif text-slate-900 mb-2">
                  Examination Portal
                </h1>
                <p className="text-[9px] text-blue-600 mb-4">
                  Welcome back, benjamintigerbowler
                </p>
                <p className="text-[9px] text-slate-600 max-w-md mx-auto leading-relaxed">
                  Complete your certification examinations to track your progress through the Foundational Program. Each exam unlocks new mentorship resources and advancement opportunities.
                </p>
              </div>

              {/* Category 1: Initial Examinations */}
              <div className="mb-6 max-w-2xl mx-auto">
                <h2 className="text-[11px] font-bold text-slate-900 mb-1">Category 1: Initial Examinations</h2>
                <p className="text-[8px] text-slate-500 mb-3">Complete these examinations to establish your foundational knowledge and technical competency.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Foundational Knowledge Examination */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-900 mb-1">Foundational Knowledge Examination</h3>
                    <p className="text-[8px] text-slate-500 mb-3 leading-relaxed">
                      Demonstrate your understanding of core WingMentor concepts and aviation mentorship fundamentals.
                    </p>
                    <a href="#" className="text-[8px] text-blue-600 hover:underline block mb-2">Module 1: Industry Familiarization →</a>
                    <div className="flex items-center gap-2 text-[7px] text-slate-400 mb-3">
                      <span>45 min</span>
                      <span>•</span>
                      <span>25 questions</span>
                      <span>•</span>
                      <span>80% to pass</span>
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white text-[9px] font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Start Examination
                    </button>
                  </div>

                  {/* Pilot Licensure Examination */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-900 mb-1">Pilot Licensure Examination</h3>
                    <p className="text-[8px] text-slate-500 mb-3 leading-relaxed">
                      Select your current license rating and take the corresponding examination to test your technical knowledge.
                    </p>
                    <a href="#" className="text-[8px] text-blue-600 hover:underline block mb-2">W1000 Application, Examination Practice Terminal →</a>
                    <div className="flex items-center gap-2 text-[7px] text-slate-400 mb-3">
                      <span>90 min</span>
                      <span>•</span>
                      <span>60 questions</span>
                      <span>•</span>
                      <span>70% to pass</span>
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white text-[9px] font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Select License & Start
                    </button>
                  </div>
                </div>
              </div>

              {/* Category 2: Risk Management & Pathways Assessment */}
              <div className="mb-6 max-w-2xl mx-auto">
                <h2 className="text-[11px] font-bold text-slate-900 mb-1">Category 2: Risk Management & Pathways Assessment</h2>
                <p className="text-[8px] text-slate-500 mb-3">Assessment for the Pilot Risk Management & Pathways module. Tests your understanding of risk assessment and career pathway planning.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Pilot Risk Management & Pathways Examination */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-900 mb-1">Pilot Risk Management & Pathways Examination</h3>
                    <p className="text-[8px] text-slate-500 mb-3 leading-relaxed">
                      Assessment of pilot risk management principles and career pathway selection. Evaluate your understanding of aviation risk assessment and pathway planning.
                    </p>
                    <div className="flex items-center gap-2 text-[7px] text-slate-400 mb-3">
                      <span>60 min</span>
                      <span>•</span>
                      <span>35 questions</span>
                      <span>•</span>
                      <span>75% to pass</span>
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white text-[9px] font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Start Examination
                    </button>
                  </div>

                  {/* Ongoing Learning & Development Assessment */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-900 mb-1">Ongoing Learning & Development Assessment</h3>
                    <p className="text-[8px] text-slate-500 mb-3 leading-relaxed">
                      Continuous assessment designed for mentors who are also learners. Tests your ability to integrate mentorship with ongoing professional development.
                    </p>
                    <div className="flex items-center gap-2 text-[7px] text-slate-400 mb-3">
                      <span>45 min</span>
                      <span>•</span>
                      <span>25 questions</span>
                      <span>•</span>
                      <span>70% to pass</span>
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white text-[9px] font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Start Examination
                    </button>
                  </div>
                </div>
              </div>

              {/* Category 3: Mentorship Examinations */}
              <div className="mb-6 max-w-2xl mx-auto">
                <h2 className="text-[11px] font-bold text-slate-900 mb-1">Category 3: Mentorship Examinations</h2>
                <p className="text-[8px] text-slate-500 mb-3">Available after completing Category 1 and Mentor Modules. Tests your mentorship readiness.</p>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* Mentorship Knowledge Examination */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                    <h3 className="text-[9px] font-bold text-slate-900 mb-1">Mentorship Knowledge Examination</h3>
                    <p className="text-[7px] text-slate-500 mb-2 leading-relaxed">
                      Test your understanding of mentorship principles, psychology, and best practices.
                    </p>
                    <div className="text-[6px] text-slate-400 mb-2">
                      <div className="flex justify-between mb-1">
                        <span>60 min</span>
                        <span>40 questions</span>
                        <span>75% to pass</span>
                      </div>
                    </div>
                    <button className="w-full py-1.5 bg-blue-600 text-white text-[7px] font-medium rounded hover:bg-blue-700 transition-colors">
                      Start Examination
                    </button>
                  </div>

                  {/* Interview Assessment */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                    <h3 className="text-[9px] font-bold text-slate-900 mb-1">Interview Assessment</h3>
                    <p className="text-[7px] text-slate-500 mb-2 leading-relaxed">
                      Comprehensive interview evaluating your readiness for mentorship responsibilities.
                    </p>
                    <div className="text-[6px] text-slate-400 mb-2">
                      <div className="flex justify-between mb-1">
                        <span>45 min</span>
                        <span>30 questions</span>
                        <span>80% to pass</span>
                      </div>
                    </div>
                    <button className="w-full py-1.5 bg-blue-600 text-white text-[7px] font-medium rounded hover:bg-blue-700 transition-colors">
                      Start Examination
                    </button>
                  </div>

                  {/* Mentorship Practical Examination */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                    <h3 className="text-[9px] font-bold text-slate-900 mb-1">Mentorship Practical Examination</h3>
                    <p className="text-[7px] text-slate-500 mb-2 leading-relaxed">
                      Practical scenario-based assessment of your mentorship capabilities.
                    </p>
                    <div className="text-[6px] text-slate-400 mb-2">
                      <div className="flex justify-between mb-1">
                        <span>120 min</span>
                        <span>5 questions</span>
                        <span>85% to pass</span>
                      </div>
                    </div>
                    <button className="w-full py-1.5 bg-blue-600 text-white text-[7px] font-medium rounded hover:bg-blue-700 transition-colors">
                      Start Examination
                    </button>
                  </div>
                </div>
              </div>

              {/* Category 4: EBT CBTA Advanced Assessments */}
              <div className="mb-6 max-w-2xl mx-auto">
                <h2 className="text-[11px] font-bold text-slate-900 mb-1">Category 4: EBT CBTA Advanced Assessments</h2>
                <p className="text-[8px] text-slate-500 mb-3">Final assessments based on mentorship acquisition and constructivism principles.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Airbus EBT CBTA Interview */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-900 mb-1">Airbus EBT CBTA Interview</h3>
                    <p className="text-[8px] text-slate-500 mb-3 leading-relaxed">
                      Advanced interview assessment aligned with AIRBUS Evidence-Based Training principles.
                    </p>
                  </div>

                  {/* EBT CBTA Competency Practical Scenario Examination */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-900 mb-1">EBT CBTA Competency Practical Scenario Examination</h3>
                    <p className="text-[8px] text-slate-500 mb-3 leading-relaxed">
                      Practical examination based on mentorship competencies and constructivism principles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          )}
          {showLicenseSelection && !showExaminationInProgress && !showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* License Selection Page */
        <div className={`w-full h-full bg-[#f8fafc] flex flex-col overflow-hidden ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setShowLicenseSelection(false)}
              className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>←</span>
              Back to Examination Portal
            </button>
            <div className="flex-1"></div>
            <img src={IMAGES.LOGO} alt="WingMentor" className="w-8 h-auto" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img src={IMAGES.LOGO} alt="WingMentor" className="w-16 h-auto" />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">
                FAA / CAAP GLEIMS
              </p>
              <h1 className="text-2xl font-serif text-slate-900 mb-2">
                Select Your License Rating
              </h1>
              <p className="text-[9px] text-blue-600 mb-4">
                Welcome back, benjamintigerbowler
              </p>
              <p className="text-[9px] text-slate-600 max-w-md mx-auto leading-relaxed">
                Choose your current license rating to begin the Gleims examination. The exam will test your technical knowledge specific to your certification level.
              </p>
            </div>

            {/* License Options Grid */}
            <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
              {/* CPL Card */}
              <div className={`bg-white rounded-xl p-4 border-2 shadow-sm cursor-pointer transition-all ${buttonPressed ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                <div className="mb-3">
                  <h3 className="text-[11px] font-bold text-slate-900 mb-1">Commercial Pilot License (CPL)</h3>
                  <p className="text-[8px] text-slate-500 leading-relaxed">
                    For pilots pursuing commercial aviation careers. Covers advanced aerodynamics, flight planning, and commercial regulations.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[8px] text-slate-400">
                  <span>60 questions</span>
                  <span>•</span>
                  <span>90 min</span>
                </div>
              </div>

              {/* IR Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm opacity-75">
                <div className="mb-3">
                  <h3 className="text-[11px] font-bold text-slate-900 mb-1">Instrument Rating (IR)</h3>
                  <p className="text-[8px] text-slate-500 leading-relaxed">
                    Focuses on instrument flight rules, navigation systems, and procedures for flying in IFR conditions.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[8px] text-slate-400">
                  <span>50 questions</span>
                  <span>•</span>
                  <span>75 min</span>
                </div>
              </div>

              {/* ME Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm opacity-75">
                <div className="mb-3">
                  <h3 className="text-[11px] font-bold text-slate-900 mb-1">Multi-Engine Rating (ME)</h3>
                  <p className="text-[8px] text-slate-500 leading-relaxed">
                    Covers multi-engine aircraft systems, engine-out procedures, and performance calculations.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[8px] text-slate-400">
                  <span>40 questions</span>
                  <span>•</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* PPL Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm opacity-75">
                <div className="mb-3">
                  <h3 className="text-[11px] font-bold text-slate-900 mb-1">Private Pilot License (PPL)</h3>
                  <p className="text-[8px] text-slate-500 leading-relaxed">
                    Fundamental aviation knowledge for private pilots including basic aerodynamics and VFR regulations.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[8px] text-slate-400">
                  <span>40 questions</span>
                  <span>•</span>
                  <span>60 min</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 max-w-2xl mx-auto">
              <p className="text-[8px] text-slate-500 text-center">
                All Gleims examinations are standardized tests based on FAA and CAAP regulations. Select the rating that matches your current certification.
              </p>
            </div>
          </div>
        </div>
          )}
          {showExaminationInProgress && !showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Examination In Progress - CPL Questions */
        <div className={`w-full h-full bg-[#f8fafc] flex flex-col overflow-hidden ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <span>←</span>
                Back to Examination Portal
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[9px] text-slate-500">Question 1 of 5</span>
              <div className="w-24 bg-slate-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{width: '20%'}}></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-xl mx-auto">
              {/* Question Card */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-serif text-slate-900 mb-6">
                  Foundational Knowledge Exam
                </h2>
                
                <p className="text-sm text-slate-800 mb-6 leading-relaxed">
                  When calculating the center of gravity for a commercial flight, which of the following factors must be considered to ensure the aircraft remains within its safe operating envelope?
                </p>

                {/* Answer Options */}
                <div className="space-y-3">
                  {/* Option A */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xs font-semibold">A</span>
                    </div>
                    <p className="text-sm text-slate-700">Only the weight of passengers and cargo</p>
                  </div>

                  {/* Option B - Selected */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-blue-500 bg-blue-50 cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">B</span>
                    </div>
                    <p className="text-sm text-slate-800 font-medium">Weight, balance, fuel distribution, and equipment</p>
                  </div>

                  {/* Option C */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-500 text-xs font-semibold">C</span>
                    </div>
                    <p className="text-sm text-slate-700">Only the empty weight and fuel</p>
                  </div>

                  {/* Option D */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-500 text-xs font-semibold">D</span>
                    </div>
                    <p className="text-sm text-slate-700">Only the pilot's weight and baggage</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <button className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
          )}
          {showExaminationResults && !showResultsToRecognition && !showPilotRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Examination Results Page */
        <div className={`w-full h-full bg-white flex flex-col overflow-hidden ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setShowExaminationResults(false)}
              className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>←</span>
              Back to Recognition
            </button>
            <div className="flex-1"></div>
            <img src={IMAGES.LOGO} alt="WingMentor" className="w-8 h-auto" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden bg-slate-50">
            <div
              className="p-4 transition-transform ease-linear"
              style={{ 
                transform: `translateY(-${examResultsScrollY}px)`,
                paddingBottom: `${examResultsScrollY + 16}px`,
                transitionDuration: '4s'
              }}
            >
            {/* Title */}
            <div className="text-center mb-6">
              <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">
                VERIFIED <span className="text-slate-900">EXAMINATION</span> DIRECTORY
              </p>
              <h1 className="text-2xl font-serif text-slate-900 mb-2">
                <span className="text-slate-900">Examination</span> <span className="text-blue-600">Results</span>
              </h1>
              <p className="text-[9px] text-slate-600 max-w-md mx-auto leading-relaxed">
                Centralized record of your proctored examinations, knowledge recency checks, and pilot assessments. Foundational Program exams and CAAP/FAA recency examinations integrated with Gleims.
              </p>
            </div>

            {/* Candidate Status Card */}
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-5 gap-2 text-center">
                <div>
                  <p className="text-[7px] text-slate-400 uppercase tracking-wide mb-1">CANDIDATE</p>
                  <p className="text-[9px] font-bold text-slate-900">benjamintigerbowler</p>
                  <p className="text-[9px] font-bold text-slate-900">Bowler</p>
                </div>
                <div>
                  <p className="text-[7px] text-slate-400 uppercase tracking-wide mb-1">PROGRAM STATUS</p>
                  <p className="text-[9px] font-bold text-green-600">Enrolled</p>
                </div>
                <div>
                  <p className="text-[7px] text-slate-400 uppercase tracking-wide mb-1">EXAMS AVAILABLE</p>
                  <p className="text-[9px] font-bold text-slate-900">5</p>
                </div>
                <div>
                  <p className="text-[7px] text-slate-400 uppercase tracking-wide mb-1">COMPLETED</p>
                  <p className="text-[9px] font-bold text-slate-900">2</p>
                </div>
                <div>
                  <p className="text-[7px] text-slate-400 uppercase tracking-wide mb-1">PENDING</p>
                  <p className="text-[9px] font-bold text-slate-900">3</p>
                </div>
              </div>
            </div>

            {/* Examination Categories */}
            <div className="mb-4 max-w-2xl mx-auto">
              <p className="text-[8px] text-slate-400 uppercase tracking-wide mb-2">EXAMINATION CATEGORIES</p>
              <h2 className="text-base font-bold text-slate-900 mb-4">Examination Results</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Foundational Program Examination */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="text-[10px] font-bold text-slate-900 mb-2">Foundational Program Examination</h3>
                  <p className="text-[8px] text-slate-600 mb-3 leading-relaxed">
                    Initial Industry Familiarization Examination covering industry indoctrination, pilot gap analysis, and foundational mentorship concepts.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[7px] rounded">Industry Indoctrination</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[7px] rounded">Pilot Gap Analysis</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[7px] rounded">Mentorship Framework</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[7px] rounded">Professional Development</span>
                  </div>
                  <button className="w-full py-2 bg-green-600 text-white text-[9px] font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                    Start Examination <span>→</span>
                  </button>
                </div>

                {/* Pilotage Recency Examinations */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[7px] rounded-full">Gleims Integrated</span>
                  </div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-2">Pilotage Recency Examinations</h3>
                  <p className="text-[8px] text-slate-600 mb-3 leading-relaxed">
                    CAAP/FAA standard recency examinations for Commercial Pilot License (CPL), Private Pilot License (PPL), Instrument Rating (IR), and Multi-Engine (ME) certifications.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <p className="text-[9px] font-bold text-slate-700">CPL</p>
                      <p className="text-[7px] text-slate-500">Pending</p>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <p className="text-[9px] font-bold text-slate-700">PPL</p>
                      <p className="text-[7px] text-slate-500">Pending</p>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <p className="text-[9px] font-bold text-slate-700">IR</p>
                      <p className="text-[7px] text-slate-500">Pending</p>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <p className="text-[9px] font-bold text-slate-700">ME</p>
                      <p className="text-[7px] text-slate-500">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Examination Archive */}
            <div className="mb-4 max-w-2xl mx-auto">
              <p className="text-[8px] text-slate-400 uppercase tracking-wide mb-2">EXAMINATION ARCHIVE</p>
              <h3 className="text-sm font-bold text-slate-900 mb-3">All Examinations</h3>
              
              <div className="space-y-2">
                {/* Initial Industry Familiarization Examination - COMPLETED */}
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-[9px] font-bold text-slate-900">Initial Industry Familiarization Examination</h4>
                    <p className="text-[7px] text-slate-500">WingMentor Academy</p>
                    <p className="text-[7px] text-slate-400">Completed: Jan 15, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-green-600">92%</p>
                    <p className="text-[7px] text-slate-400">Score</p>
                  </div>
                </div>

                {/* Gleims Integrated */}
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[7px] rounded-full">Gleims Integrated</span>
                  <span className="text-[7px] text-slate-500">CAAP/FAA Recency Examinations</span>
                </div>

                {/* CPL - COMPLETED */}
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[9px] font-bold text-slate-900">CPL - Commercial Pilot License Recency</h4>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-green-600">87%</p>
                      <p className="text-[7px] text-slate-400">Jan 18, 2026</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[7px] rounded">Flight Operations: 90%</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[7px] rounded">Commercial Regulations: 85%</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[7px] rounded">Advanced Navigation: 88%</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[7px] rounded">Aircraft Performance: 85%</span>
                  </div>
                  <p className="text-[7px] text-green-600 font-medium">✓ Valid until Jan 18, 2027</p>
                </div>

                {/* PPL - PENDING */}
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[9px] font-bold text-slate-900">PPL - Private Pilot License Recency</h4>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-yellow-600">Scheduled</p>
                      <p className="text-[7px] text-slate-400">Feb 10, 2026</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Flight Maneuvers</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">VFR Operations</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Flight Planning</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Weather Assessment</span>
                  </div>
                </div>

                {/* IR - PENDING */}
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[9px] font-bold text-slate-900">IR - Instrument Rating Recency</h4>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-500">Pending</p>
                      <p className="text-[7px] text-slate-400">Not scheduled</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">IFR Procedures</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Instrument Approaches</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Emergency Procedures</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Cockpit Resource Mgmt</span>
                  </div>
                </div>

                {/* ME - PENDING */}
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[9px] font-bold text-slate-900">ME - Multi-Engine Rating Recency</h4>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-500">Pending</p>
                      <p className="text-[7px] text-slate-400">Not scheduled</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Asymmetric Flight</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Engine-Out Procedures</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Multi-Engine Systems</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[7px] rounded">Performance Calculations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gleims Integration Notice */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-[10px]">🔗</span>
                <p className="text-[8px] text-blue-700">
                  Gleims Integrated — Your CAAP/FAA recency examination results are automatically synced with your pilot profile
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
          )}
          {showResultsToRecognition && !showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Results to Recognition Transition Page */
        <div className={`w-full h-full bg-white flex flex-col items-center justify-center p-8 ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Title - Same font as pilot gap, with red text for results and light blue for recognition */}
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6 text-center leading-tight">
            examination <span className="text-red-600">results</span> → pilot <span className="text-sky-400">recognition</span>
          </h1>

          {/* Blue Subtitle - Same style as pilot gap */}
          <p className="text-sm md:text-base text-blue-600 uppercase tracking-[0.3em] font-semibold text-center">
            your verified journey continues
          </p>
        </div>
          )}
          {showPilotRecognition2 && !showMentorshipLogbook && !showDigitalLogbook && (
        /* Pilot Recognition & Achievements Full Page */
        <div className={`w-full h-full bg-[#f8fafc] flex flex-col overflow-hidden ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <button className="text-[10px] text-slate-600 hover:text-slate-800 flex items-center gap-1">
              <span>←</span>
              Back to Hub
            </button>
            <div className="flex-1"></div>
            <img src={IMAGES.LOGO} alt="WingMentor" className="w-8 h-auto" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <div
              className="p-4 transition-transform ease-linear"
              style={{ 
                transform: `translateY(-${pilotRecognitionScrollY}px)`,
                paddingBottom: `${pilotRecognitionScrollY + 24}px`,
                transitionDuration: '3s'
              }}
            >
            {/* Title Section */}
            <div className="text-center mb-6">
              <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">
                YOUR PILOT DIGITAL FOOTPRINT TO PATHWAYS
              </p>
              <h1 className="text-2xl font-serif text-slate-900 mb-2">
                Pilot Recognition & Achievements
              </h1>
              <p className="text-[9px] text-slate-500 max-w-md mx-auto">
                View your awards, flight hours, certifications, and professional milestones earned through your training journey.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="max-w-4xl mx-auto">
              {/* Tabs */}
              <div className="flex justify-between items-center mb-4 text-[9px]">
                <div>
                  <p className="font-bold text-slate-900">Pilot Recognition Credentials</p>
                  <p className="text-slate-600">Programs</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 uppercase tracking-wide">AWARDS, CERTIFICATIONS & ACHIEVEMENTS</p>
                  <p className="text-slate-400 uppercase tracking-wide">TRAINING PROGRESS & RESOURCES</p>
                </div>
              </div>

              {/* Foundation Program Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-3">
                <h3 className="text-[10px] font-bold text-slate-900 mb-1">Foundation Program</h3>
                <p className="text-[8px] text-slate-500 mb-3">Track your current completion progress synced directly from the foundational program dashboard.</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                  <div className="bg-slate-300 h-1.5 rounded-full" style={{width: '0%'}}></div>
                </div>
                <p className="text-[8px] text-slate-600">0% complete</p>
              </div>

              {/* Mentorship Logbook Directory Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-3">
                <h3 className="text-[10px] font-bold text-slate-900 mb-1">Mentorship Logbook Directory</h3>
                <p className="text-[8px] text-slate-500 mb-3">Access your verified mentorship sessions, mentor feedback, and 50-hour certification progress.</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                  <div className="bg-slate-300 h-1.5 rounded-full" style={{width: '0%'}}></div>
                </div>
                <p className="text-[8px] text-slate-600">0% complete</p>
              </div>

              {/* Official Documentation Section */}
              <div className="flex justify-between items-center mb-3 mt-6">
                <p className="text-[9px] font-bold text-slate-900">Official Documentation</p>
                <p className="text-[8px] text-slate-400 uppercase tracking-wide">VERIFICATION & RESUMES</p>
              </div>

              {/* Examination Results Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-1">Examination Results</h3>
                  <p className="text-[8px] text-slate-500">Dive into your latest verified exam scores and subcategory breakdowns.</p>
                </div>
                <button className="px-4 py-2 bg-[#0ea5e9] text-white text-[8px] font-medium rounded-full hover:bg-[#0284c7] transition-colors">
                  View Examination Directory
                </button>
              </div>

              {/* Digital Flight Logbook Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-1">Digital Flight Logbook</h3>
                  <p className="text-[8px] text-slate-500">View your complete collection of licenses, flight hours, certifications, and professional milestones.</p>
                </div>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 text-[8px] font-medium rounded-full hover:bg-slate-50 transition-colors">
                  View Logbook
                </button>
              </div>

              {/* Pilot Licensure Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-900 mb-1">Pilot Licensure & Experience Data Entry</h3>
                  <p className="text-[8px] text-slate-500">Access your comprehensive digital flight log with detailed flight records, aircraft types, and operational experience.</p>
                </div>
                <button className="px-4 py-2 bg-[#0ea5e9] text-white text-[8px] font-medium rounded-full hover:bg-[#0284c7] transition-colors">
                  Open Data Entry
                </button>
              </div>

              {/* Your Achievements Section */}
              <div className="flex justify-between items-center mb-3 mt-6">
                <p className="text-[9px] font-bold text-slate-900">Your Achievements</p>
                <p className="text-[8px] text-slate-400 uppercase tracking-wide">ATLAS RESUME DIRECTORY</p>
              </div>

              {/* ATLAS Resume Header */}
              <div className="text-center mb-4">
                <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-1">ATLAS Resume System</p>
                <h3 className="text-sm font-serif text-slate-900">ATS-Approved ATLAS CV Formatting</h3>
              </div>

              {/* ATLAS Resume Example */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden mb-3">
                {/* Header Card */}
                <div className="bg-red-600 px-4 py-3 border-b border-red-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[7px] text-red-200 uppercase tracking-[0.2em] mb-0.5">Pilot Recognition Profile</p>
                      <h4 className="text-base font-bold text-white">Pete Mitchell</h4>
                      <p className="text-[9px] text-red-100">WingMentor Recognition Portfolio</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[7px] text-red-200 uppercase tracking-[0.2em] mb-1">SHARE LINK</p>
                      <button className="px-2 py-1 bg-white border border-red-400 rounded text-[7px] font-medium text-red-700 hover:bg-red-50 transition-colors">
                        Copy shareable resume URL
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Pilot Credentials */}
                    <div className="bg-white rounded-lg p-2 border border-slate-200">
                      <h5 className="text-[9px] font-bold text-slate-900 mb-0.5 text-center">Pilot Credentials</h5>
                      <p className="text-[7px] text-slate-500 mb-2 text-center">Licensing, hours, and access pass</p>
                      
                      <div className="grid grid-cols-2 gap-1 mb-2">
                        <div className="bg-slate-50 rounded p-1 text-center">
                          <p className="text-[6px] text-slate-500 mb-0.5">Dual XC hrs</p>
                          <p className="text-sm font-bold text-slate-900">85</p>
                        </div>
                        <div className="bg-slate-50 rounded p-1 text-center">
                          <p className="text-[6px] text-slate-500 mb-0.5">Dual LOC</p>
                          <p className="text-sm font-bold text-slate-900">42</p>
                        </div>
                        <div className="bg-slate-50 rounded p-1 text-center">
                          <p className="text-[6px] text-slate-500 mb-0.5">PIC LOC</p>
                          <p className="text-sm font-bold text-slate-900">156</p>
                        </div>
                        <div className="bg-slate-50 rounded p-1 text-center">
                          <p className="text-[6px] text-slate-500 mb-0.5">LOC XC</p>
                          <p className="text-sm font-bold text-slate-900">78</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded p-1.5 mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[7px] text-slate-500">Type</span>
                          <span className="text-[7px] font-bold text-slate-900">Commercial Pilot</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[7px] text-slate-500">Status</span>
                          <span className="text-[7px] font-bold text-emerald-600">Verified</span>
                        </div>
                      </div>

                      <a href="#" className="text-[7px] text-blue-600 font-medium hover:underline flex items-center gap-0.5">
                        View Flight Digital Logbook <span>→</span>
                      </a>
                    </div>

                    {/* Training */}
                    <div className="bg-white rounded-lg p-2 border border-slate-200">
                      <h5 className="text-[9px] font-bold text-slate-900 mb-2 text-center">Training</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[7px] text-slate-500">License</span>
                          <span className="text-[7px] font-bold text-slate-900">CPL (A)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[7px] text-slate-500">Medical</span>
                          <span className="text-[7px] font-bold text-emerald-600">Class 1 Valid</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[7px] text-slate-500">Type Ratings</span>
                          <span className="text-[7px] font-bold text-slate-900">A320 (SEP)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[7px] text-slate-500">English Proficiency</span>
                          <span className="text-[7px] font-bold text-slate-900">Level 6 (Expert)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[7px] text-slate-500">Languages</span>
                          <span className="text-[7px] font-bold text-slate-900">English, Spanish</span>
                        </div>
                      </div>
                    </div>

                    {/* Readiness Snapshot */}
                    <div className="bg-white rounded-lg p-2 border border-slate-200">
                      <h5 className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">READINESS SNAPSHOT</h5>
                      <h6 className="text-[9px] font-bold text-slate-900 mb-2 text-center">Resource & Availability</h6>
                      
                      <div className="space-y-1.5">
                        <div className="bg-slate-50 rounded p-1.5 flex justify-between items-center">
                          <span className="text-[7px] text-slate-500">Medical Certificate</span>
                          <span className="text-[7px] font-bold text-emerald-600">Valid Until Aug 2026</span>
                        </div>
                        <div className="bg-slate-50 rounded p-1.5 flex justify-between items-center">
                          <span className="text-[7px] text-slate-500">Radio License</span>
                          <span className="text-[7px] font-bold text-slate-900">G-RT12345</span>
                        </div>
                        <div className="bg-slate-50 rounded p-1.5 flex justify-between items-center">
                          <span className="text-[7px] text-slate-500">License Expiry</span>
                          <span className="text-[7px] font-bold text-slate-900">Mar 2028</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Experience Section */}
                  <div className="mt-2 bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-[9px] font-bold text-slate-900">Recent Job Experience & Industry Aligned Accredited Programs</h5>
                      <a href="#" className="text-[7px] text-blue-600 font-medium hover:underline flex items-center gap-0.5">
                        Edit Experience <span>→</span>
                      </a>
                    </div>
                    
                    {/* Job Experience Entry */}
                    <div className="mb-2 pb-2 border-b border-slate-100">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h6 className="text-[9px] font-semibold text-slate-900">Flight Instructor</h6>
                          <p className="text-[7px] text-slate-500">Skyway Aviation Academy</p>
                        </div>
                        <span className="text-[6px] text-slate-400">Jan 2024 - Present</span>
                      </div>
                      <p className="text-[7px] text-slate-600 leading-relaxed">
                        Providing flight instruction for PPL and CPL students. Specializing in instrument training and multi-engine operations. Logged 350+ instructional hours with 92% student pass rate.
                      </p>
                    </div>
                    
                    {/* Second Job Experience Entry */}
                    <div className="mb-2">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h6 className="text-[9px] font-semibold text-slate-900">First Officer (A320)</h6>
                          <p className="text-[7px] text-slate-500">Regional Air Charter Ltd</p>
                        </div>
                        <span className="text-[6px] text-slate-400">Jun 2023 - Dec 2023</span>
                      </div>
                      <p className="text-[7px] text-slate-600 leading-relaxed">
                        Operated A320 aircraft on European routes. Completed 450+ flight hours including 120+ IFR sectors. Participated in EBT/CBTA assessment program with Competent rating.
                      </p>
                    </div>
                    
                    <a href="#" className="text-[7px] text-blue-600 font-medium hover:underline flex items-center gap-0.5">
                      Add your job experience <span>→</span>
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 px-3 py-2 border-t border-slate-200">
                  <p className="text-[7px] text-slate-500 text-center">
                    This ATLAS-formatted CV is machine-readable by airline ATS systems and includes verified competency data from the WingMentor Foundation Program.
                  </p>
                </div>
              </div>

              {/* Export & Verification */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-3">
                <h4 className="text-[9px] font-bold text-slate-900 mb-2">Export & Verification</h4>
                <p className="text-[8px] text-slate-500 mb-3">Download a PDF copy of your Atlas-formatted resume or share the verification link directly with airline recruiters.</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#0ea5e9] text-white text-[8px] font-medium rounded-lg hover:bg-[#0284c7] transition-colors">
                    Access Full ATLAS Resume
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 text-[8px] font-medium rounded-lg hover:bg-slate-100 transition-colors">
                    Share verification
                  </button>
                </div>
              </div>

              {/* WingMentor Directory */}
              <div className="flex justify-between items-center mb-3 mt-6">
                <p className="text-[9px] font-bold text-slate-900">WingMentor Directory</p>
                <p className="text-[8px] text-slate-400 uppercase tracking-wide">CONNECT WITH MENTORS & MENTEES</p>
              </div>

              {/* WingMentor Chat Card */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0ea5e9] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">💬</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900">WingMentor Chat</h4>
                    <p className="text-[8px] text-slate-500">0 / 20 hrs to Mentor</p>
                  </div>
                </div>
                <span className="text-slate-400">→</span>
              </div>
            </div>
          </div>
          </div>
        </div>
          )}
          {showMentorshipLogbook && !showDigitalLogbook && (
        /* Mentorship Logbook Page */
        <div className={`w-full h-full bg-[#f8fafc] flex flex-col overflow-hidden ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <button className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <span>←</span>
              Back to Program
            </button>
            <div className="flex-1"></div>
            <img src={IMAGES.LOGO} alt="WingMentor" className="w-8 h-auto" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <div
              className="p-4 transition-transform ease-linear"
              style={{
                transform: `translateY(-${mentorshipLogbookScrollY}px)`,
                paddingBottom: `${mentorshipLogbookScrollY + 24}px`,
                transitionDuration: '3s'
              }}
            >
              {/* Title */}
              <div className="text-center mb-6">
                <img src={IMAGES.LOGO} alt="WingMentor" className="w-16 h-auto mx-auto mb-3" />
                <h1 className="text-xl font-serif text-slate-900 mb-2">Mentorship Logbook</h1>
                <p className="text-[8px] text-blue-600 uppercase tracking-[0.3em] font-semibold">
                  Track your mentorship journey
                </p>
              </div>

              {/* Progress Overview */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4">
                <h3 className="text-[10px] font-bold text-slate-900 mb-3">50-Hour Certification Progress</h3>
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] text-slate-600">Total Hours Completed</span>
                    <span className="text-[8px] font-bold text-slate-900">32.5 / 50 hrs</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-base font-bold text-slate-900">12</p>
                    <p className="text-[7px] text-slate-500 uppercase tracking-wide mt-0.5">Sessions</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">4.5</p>
                    <p className="text-[7px] text-slate-500 uppercase tracking-wide mt-0.5">Avg/Session</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">92%</p>
                    <p className="text-[7px] text-slate-500 uppercase tracking-wide mt-0.5">Completion</p>
                  </div>
                </div>
              </div>

              {/* Recent Mentorship Sessions */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold text-slate-900 mb-3">Recent Mentorship Sessions</h3>
                <div className="space-y-2">
                  {/* Session 1 */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[9px] font-bold text-slate-900">IFR Procedures Review</p>
                        <p className="text-[8px] text-slate-500">Mentor: Capt. John Smith</p>
                      </div>
                      <span className="text-[8px] text-slate-400">Jan 15, 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-600">Duration: 2.5 hrs</span>
                      <span className="text-[8px] font-bold text-emerald-600">Completed</span>
                    </div>
                  </div>

                  {/* Session 2 */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[9px] font-bold text-slate-900">CRM & Communication</p>
                        <p className="text-[8px] text-slate-500">Mentor: Capt. Sarah Johnson</p>
                      </div>
                      <span className="text-[8px] text-slate-400">Jan 12, 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-600">Duration: 3.0 hrs</span>
                      <span className="text-[8px] font-bold text-emerald-600">Completed</span>
                    </div>
                  </div>

                  {/* Session 3 */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[9px] font-bold text-slate-900">Multi-Engine Operations</p>
                        <p className="text-[8px] text-slate-500">Mentor: Capt. Michael Chen</p>
                      </div>
                      <span className="text-[8px] text-slate-400">Jan 08, 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-600">Duration: 2.0 hrs</span>
                      <span className="text-[8px] font-bold text-emerald-600">Completed</span>
                    </div>
                  </div>

                  {/* Session 4 */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[9px] font-bold text-slate-900">Aircraft Systems Deep Dive</p>
                        <p className="text-[8px] text-slate-500">Mentor: Capt. Emily Davis</p>
                      </div>
                      <span className="text-[8px] text-slate-400">Jan 05, 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-600">Duration: 2.5 hrs</span>
                      <span className="text-[8px] font-bold text-emerald-600">Completed</span>
                    </div>
                  </div>

                  {/* Session 5 */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[9px] font-bold text-slate-900">Navigation & Flight Planning</p>
                        <p className="text-[8px] text-slate-500">Mentor: Capt. Robert Wilson</p>
                      </div>
                      <span className="text-[8px] text-slate-400">Jan 02, 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-600">Duration: 3.5 hrs</span>
                      <span className="text-[8px] font-bold text-emerald-600">Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-900 mb-3">Certification Milestones</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-white text-[6px]">✓</span>
                    </div>
                    <span className="text-[8px] text-slate-700">Initial Assessment Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-white text-[6px]">✓</span>
                    </div>
                    <span className="text-[8px] text-slate-700">First 10 Hours Achieved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-white text-[6px]">✓</span>
                    </div>
                    <span className="text-[8px] text-slate-700">IFR Proficiency Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-[6px]">→</span>
                    </div>
                    <span className="text-[8px] text-slate-700">25 Hours (In Progress)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-[6px]">○</span>
                    </div>
                    <span className="text-[8px] text-slate-400">50 Hours Certification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          )}
          {showDigitalLogbook && (
        /* Digital Flight Logbook Page */
        <div className={`w-full h-full bg-[#f0f4f8] flex flex-col overflow-hidden ${animationComplete ? '' : 'pointer-events-none'}`}>
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => setShowDigitalLogbook(false)}
              className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>←</span>
              BACK TO PROFILE
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-slate-600 uppercase tracking-wide">Verified Identity</span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Profile Header Card */}
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={IMAGES.LOGO} alt="WingMentor" className="w-10 h-auto" />
              </div>
              <div className="text-center">
                <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">Pilot Recognition Profile</p>
                <h1 className="text-xl font-serif text-slate-900 mb-1">Pilot Profile</h1>
              </div>
            </div>

            {/* Digital Logbook Card */}
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-serif text-slate-900 mb-1">Digital Logbook</h2>
                  <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-wide">Verified Flight Record Registry</p>
                </div>
                <button className="px-4 py-2 bg-[#0ea5e9] text-white text-[9px] font-medium rounded-full hover:bg-[#0284c7] transition-colors">
                  ADD FLIGHT ENTRY
                </button>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-9 gap-2 py-2 border-b border-slate-200 text-[7px] font-bold text-slate-500 uppercase tracking-wide">
                <div>DATE</div>
                <div>TYPE</div>
                <div>IDENT</div>
                <div>ROUTE</div>
                <div>CATEGORY</div>
                <div className="col-span-2">DESCRIPTION</div>
                <div>TIME</div>
                <div>TOTAL</div>
              </div>

              {/* Mock Flight Entries */}
              <div className="space-y-2">
                {/* Entry 1 */}
                <div className="grid grid-cols-9 gap-2 py-3 border-b border-slate-100 text-[8px] text-slate-700 items-center hover:bg-slate-50 rounded">
                  <div className="font-medium">Jan 15, 2025</div>
                  <div>A320</div>
                  <div>ABC-123</div>
                  <div className="truncate">JFK-LHR</div>
                  <div className="text-emerald-600 font-medium">Dual</div>
                  <div className="col-span-2 truncate">Commercial flight instruction - Cross country training</div>
                  <div className="font-bold">7.2</div>
                  <div className="font-bold text-slate-900">7.2</div>
                </div>

                {/* Entry 2 */}
                <div className="grid grid-cols-9 gap-2 py-3 border-b border-slate-100 text-[8px] text-slate-700 items-center hover:bg-slate-50 rounded">
                  <div className="font-medium">Jan 12, 2025</div>
                  <div>C172</div>
                  <div>N456DF</div>
                  <div className="truncate">LAX-SFO</div>
                  <div className="text-blue-600 font-medium">PIC</div>
                  <div className="col-span-2 truncate">Solo flight - IFR practice approaches</div>
                  <div className="font-bold">3.5</div>
                  <div className="font-bold text-slate-900">3.5</div>
                </div>

                {/* Entry 3 */}
                <div className="grid grid-cols-9 gap-2 py-3 border-b border-slate-100 text-[8px] text-slate-700 items-center hover:bg-slate-50 rounded">
                  <div className="font-medium">Jan 08, 2025</div>
                  <div>PA28</div>
                  <div>N789GH</div>
                  <div className="truncate">MIA-NAS</div>
                  <div className="text-purple-600 font-medium">Dual XC</div>
                  <div className="col-span-2 truncate">Night cross country - International procedures</div>
                  <div className="font-bold">4.1</div>
                  <div className="font-bold text-slate-900">4.1</div>
                </div>

                {/* Entry 4 */}
                <div className="grid grid-cols-9 gap-2 py-3 border-b border-slate-100 text-[8px] text-slate-700 items-center hover:bg-slate-50 rounded">
                  <div className="font-medium">Jan 05, 2025</div>
                  <div>C152</div>
                  <div>N321JK</div>
                  <div className="truncate">Local</div>
                  <div className="text-emerald-600 font-medium">Dual</div>
                  <div className="col-span-2 truncate">Pattern work - Touch and go landings</div>
                  <div className="font-bold">2.3</div>
                  <div className="font-bold text-slate-900">2.3</div>
                </div>

                {/* Entry 5 */}
                <div className="grid grid-cols-9 gap-2 py-3 text-[8px] text-slate-700 items-center hover:bg-slate-50 rounded">
                  <div className="font-medium">Jan 02, 2025</div>
                  <div>BE76</div>
                  <div>N654LM</div>
                  <div className="truncate">ORD-DTW</div>
                  <div className="text-orange-600 font-medium">Multi</div>
                  <div className="col-span-2 truncate">Multi-engine instruction - Engine-out procedures</div>
                  <div className="font-bold">5.7</div>
                  <div className="font-bold text-slate-900">5.7</div>
                </div>
              </div>

              {/* Total Hours Summary */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-slate-500">Dual:</span>
                      <span className="ml-1 font-bold text-slate-900">14.6 hrs</span>
                    </div>
                    <div>
                      <span className="text-slate-500">PIC:</span>
                      <span className="ml-1 font-bold text-slate-900">8.8 hrs</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Cross Country:</span>
                      <span className="ml-1 font-bold text-slate-900">12.9 hrs</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Total Logged:</span>
                    <span className="ml-2 text-base font-bold text-slate-900">22.8 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          )}
        </div>
      </ContainerScroll>
    </div>
  );
};
