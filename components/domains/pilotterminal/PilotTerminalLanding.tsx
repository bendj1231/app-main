'use client';

// Pilot Terminal - Reddit Style 3-Pane Forum with Social Aggregation
// Community forum for pilots with Reddit/Facebook/LinkedIn integration
// Domain: pilotterminal.com

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MessageSquare, Users, Radio, Search, Bell, User, Hash, TrendingUp, Clock, ChevronRight, ChevronUp, ChevronDown, ArrowBigUp, ArrowBigDown, Share, MoreHorizontal, Plane, Shield, Map, AlertTriangle, Globe, Home, Star, Newspaper, Compass, Plus, Info, BookOpen, Award, ExternalLink, Rss, Moon, Sun, Loader2 } from 'lucide-react';
import { supabase } from '../../../src/lib/supabase';
import AggregatedSocialFeed from './AggregatedSocialFeed';

export default function PilotTerminalLanding() {
  const { loginWithRedirect, isLoading, isAuthenticated, user, error: auth0Error, logout: auth0Logout } = useAuth0();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('hot');
  const [upvotedPosts, setUpvotedPosts] = useState<number[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('pilotterminal-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Auto-detect based on time of day (6 AM - 6 PM = light, 6 PM - 6 AM = dark)
      const hour = new Date().getHours();
      const isNightTime = hour < 6 || hour >= 18;
      setIsDarkMode(isNightTime);
    }
  }, []);

  // Sync isLoggedIn with Auth0 isAuthenticated state
  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('pilotterminal-theme', newMode ? 'dark' : 'light');
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      
      if (error) {
        setLoginError(error.message);
      } else if (data.session) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setLoginEmail('');
        setLoginPassword('');
      }
    } catch (err) {
      setLoginError('An unexpected error occurred');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setLoginError('');
    setLoginEmail('');
    setLoginPassword('');
  };

  // Auth0 callback URL for pilotterminal.com
  const getCallbackUrl = () => {
    return window.location.hostname.includes('pilotterminal') 
      ? 'https://pilotterminal.com/auth/callback'
      : `${window.location.origin}/auth/callback`;
  };

  // Google Sign Up (forces signup screen)
  const handleGoogleSignup = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2',
          screen_hint: 'signup',
          redirect_uri: getCallbackUrl(),
          scope: 'openid profile email'
        }
      });
    } catch (err) {
      setLoginError('Failed to sign up with Google');
    }
  };

  // Google Sign In (allows both login and signup)
  const handleGoogleSignIn = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2',
          redirect_uri: getCallbackUrl(),
          scope: 'openid profile email'
        }
      });
    } catch (err) {
      setLoginError('Failed to sign in with Google');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleUpvote = (id: number) => {
    setUpvotedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const posts: any[] = [];

  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Star, label: 'Popular', active: false },
    { icon: TrendingUp, label: 'Trending', active: false },
    { icon: Newspaper, label: 'News', active: false },
    { icon: Compass, label: 'Explore', active: false },
  ];

  const communities = [
    { name: 'CareerAdvice', members: '52K', icon: 'bg-cyan-500' },
    { name: 'StudentPilots', members: '28K', icon: 'bg-red-500' },
    { name: 'Airlines', members: '124K', icon: 'bg-blue-500' },
    { name: 'Cargo', members: '15K', icon: 'bg-orange-500' },
    { name: 'FlightTraining', members: '45K', icon: 'bg-green-500' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b ${isDarkMode ? 'bg-[#1a1a1b] border-gray-800' : 'bg-white border-gray-200'}`}>
        {/* Partner Directories Navigation - Now at top */}
        <nav className={`flex items-center justify-center gap-8 h-10 px-4 border-b ${isDarkMode ? 'bg-black border-gray-800' : 'bg-gray-900 border-gray-700'}`}>
          {/* PilotRecognition Link with Dropdown */}
          <div className="relative group">
            <a 
              href="https://pilotrecognition.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-white transition-colors"
            >
              Pilot<span className="text-red-500">Recognition</span>.com
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#1a1a1b] border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 mt-1">
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2">Verified Aviation Profiles</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Your verified aviation profile. Get recognized by airlines, track your career progress, and unlock exclusive pathways.
                </p>
              </div>
            </div>
          </div>

          {/* PilotShortage Link with Dropdown */}
          <div className="relative group">
            <a 
              href="https://pilotshortage.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-white transition-colors"
            >
              Pilot<span className="text-red-500">Shortage</span>.org
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#1a1a1b] border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 mt-1">
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2">Industry Partner</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Working together to address the global pilot shortage. Connecting qualified pilots with airlines worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* CareerPathways Link with Dropdown */}
          <div className="relative group">
            <a 
              href="https://pilotcareerpathways.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-white transition-colors"
            >
              Pilot<span className="text-green-400">CareerPathways</span>.com
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#1a1a1b] border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 mt-1">
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2">Align Your Profile</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Discover your optimal career pathway. Compare requirements, track your progress, and find the perfect route to your dream airline.
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Header - Logo, Search, Actions */}
        <div className="flex items-center justify-between h-12 px-4">
          {/* Logo - Text Only */}
          <div className="flex items-center">
            <span className="font-bold text-lg">
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Pilot</span>
              <span className='text-red-500'>Terminal</span>
              <span className="text-gray-500 text-sm font-normal ml-1">.com</span>
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search PilotTerminal"
                className={`w-full border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-red-400/50 ${isDarkMode ? 'bg-[#272729] border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-400'}`}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className={`p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <TrendingUp className="w-5 h-5" />
            </button>
            <button className={`p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleTheme}
              className={`p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-[#272729] hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                title="Click to logout"
              >
                <div className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-red-500 to-red-600 text-white'>
                  U
                </div>
                <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            ) : (
              <button 
                onClick={openLoginModal}
                className='px-4 py-1.5 rounded-full text-sm font-bold transition-colors bg-red-500 hover:bg-red-600 text-white'
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout - 3 Pane */}
      <div className="pt-[88px] flex min-h-screen">
        {/* LEFT SIDEBAR - Navigation & Auth */}
        <aside className={`w-60 border-r sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto ${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="p-4">
            {/* Auth Buttons */}
            <div className={`mb-5 pb-4 border-b space-y-2 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <button 
                onClick={openLoginModal}
                className='w-full block font-bold py-2 rounded-lg transition-all text-center text-xs bg-red-500 hover:bg-red-600 text-white'
              >
                Sign In
              </button>
              <button 
                onClick={handleGoogleSignup}
                className={`w-full block border font-bold py-2 rounded-lg transition-all text-center text-xs ${isDarkMode ? 'bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10' : 'bg-transparent border-red-500 text-red-600 hover:bg-red-50'}`}
              >
                Create Account
              </button>
            </div>

            {/* Main Nav */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? (isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900')
                      : (isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className={`my-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`} />

            {/* Communities Section */}
            <div className="space-y-2">
              <h3 className={`text-xs font-semibold uppercase tracking-wider px-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Communities
              </h3>
              {communities.map((community) => (
                <button
                  key={community.name}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <div className={`w-6 h-6 ${community.icon} rounded-full flex items-center justify-center text-xs font-bold`}>
                    {community.name[0]}
                  </div>
                  <span className="flex-1 text-left">r/{community.name}</span>
                </button>
              ))}
            </div>

            <div className={`my-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`} />

            {/* Create Community */}
            <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <Plus className="w-5 h-5" />
              Create Community
            </button>
          </div>
        </aside>

        {/* CENTER - Main Feed */}
        <main className={`flex-1 max-w-2xl mx-auto ${isDarkMode ? '' : 'bg-gray-50'}`}>
          {/* Filter Tabs with Social Feed Option */}
          <div className={`flex items-center gap-2 p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            {['Hot', 'New', 'Top', 'Rising'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? (isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900')
                    : (isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-700 mx-2" />
            <button
              onClick={() => setActiveTab('aggregated')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                activeTab === 'aggregated'
                  ? 'bg-red-500 text-white'
                  : (isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
              }`}
            >
              <Rss className="w-4 h-4" />
              Aggregated
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>5 sources</span>
            </button>
          </div>

          {/* Create Post Input */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className={`flex items-center gap-3 rounded-lg p-3 ${isDarkMode ? 'bg-[#272729]' : 'bg-white border border-gray-200'}`}>
              {isLoggedIn ? (
                <div className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-red-500 to-red-600 text-white'>
                  U
                </div>
              ) : (
                <button 
                  onClick={openLoginModal}
                  className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-red-500 to-red-600 text-white'
                >
                  U
                </button>
              )}
              <input
                type="text"
                placeholder={isLoggedIn ? "Create post" : "Sign in to post"}
                readOnly={!isLoggedIn}
                className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-gray-300 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
              />
            </div>
          </div>

          {/* Content Area - Posts or Aggregated Feed */}
          {activeTab === 'aggregated' ? (
            <AggregatedSocialFeed />
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <MessageSquare className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No posts yet</h3>
              <p className={`text-sm max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Be the first to start a discussion. Share your aviation journey, ask questions, or connect with fellow pilots.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {posts.map((post) => (
                <article key={post.id} className="flex group hover:bg-[#1a1a1b] transition-colors">
                {/* Vote Buttons */}
                <div className="flex flex-col items-center w-12 py-3 bg-[#161617]">
                  <button
                    onClick={() => toggleUpvote(post.id)}
                    className={`p-1 rounded hover:bg-gray-700 ${
                      upvotedPosts.includes(post.id) ? 'text-orange-500' : 'text-gray-400'
                    }`}
                  >
                    <ArrowBigUp className="w-7 h-7" />
                  </button>
                  <span className={`text-sm font-bold ${
                    upvotedPosts.includes(post.id) ? 'text-orange-500' : 'text-white'
                  }`}>
                    {upvotedPosts.includes(post.id) ? post.upvotes + 1 : post.upvotes}
                  </span>
                  <button className="p-1 rounded hover:bg-gray-700 text-gray-400">
                    <ArrowBigDown className="w-7 h-7" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="flex-1 p-3">
                  {/* Post Header */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <div className={`w-4 h-4 ${post.subredditColor} rounded-full flex items-center justify-center text-[8px] font-bold text-white`}>
                      {post.subreddit[0]}
                    </div>
                    <span className="font-medium text-white hover:underline cursor-pointer">
                      r/{post.subreddit}
                    </span>
                    <span>•</span>
                    <span>Posted by u/{post.author}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                    {post.flair && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                        {post.flair}
                      </span>
                    )}
                  </div>

                  {/* Post Title */}
                  <h2 className="text-lg font-medium text-white mb-2 group-hover:text-red-400 cursor-pointer">
                    {post.title}
                  </h2>

                  {/* Post Content */}
                  <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button className="flex items-center gap-1.5 hover:bg-gray-700 px-2 py-1.5 rounded">
                      <MessageSquare className="w-4 h-4" />
                      {post.comments} Comments
                    </button>
                    <button className="flex items-center gap-1.5 hover:bg-gray-700 px-2 py-1.5 rounded">
                      <Share className="w-4 h-4" />
                      Share
                    </button>
                    <button className="flex items-center gap-1.5 hover:bg-gray-700 px-2 py-1.5 rounded">
                      <Award className="w-4 h-4" />
                      Award
                    </button>
                    <button className="flex items-center gap-1.5 hover:bg-gray-700 px-2 py-1.5 rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR - Community Info */}
        <aside className={`w-80 border-l sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          {/* Stats */}
          <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-[#1a1a1b] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>50K+</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Verified Pilots</div>
              </div>
              <div className="w-px h-8 bg-gray-800" />
              <div className="text-center flex-1">
                <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2.4K</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Online Now</div>
              </div>
              <div className="w-px h-8 bg-gray-800" />
              <div className="text-center flex-1">
                <div className='font-bold text-lg text-red-500'>336K</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Discussions</div>
              </div>
            </div>
          </div>

          {/* Community Guide */}
          <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-[#1a1a1b] border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className='w-4 h-4 text-red-500' />
              <span className={`font-bold text-sm ${isDarkMode ? '' : 'text-gray-900'}`}>Community Guide</span>
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Welcome to the pilot community! Please read our rules before posting.
            </p>
          </div>

          {/* Pilot Terminal User Guide & Sourcing Info */}
          <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-[#1a1a1b] border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className='w-4 h-4 text-red-500' />
              <span className={`font-bold text-sm ${isDarkMode ? '' : 'text-gray-900'}`}>Pilot Terminal Guide</span>
            </div>
            
            {/* What We Source */}
            <div className="mb-4">
              <h4 className={`text-xs font-semibold uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Information Sources</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className='w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0' />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Verified pilot discussions from aviation forums</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Industry news from airlines & training centers</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Career updates from professional networks</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Real-time insights from the global pilot community</span>
                </div>
              </div>
            </div>

            {/* Recommended Chats Directory */}
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Recommended Channels</h4>
              <div className="space-y-1.5">
                {[
                  { name: 'Career Advice', members: '12.4K', active: true },
                  { name: 'Flight Training', members: '8.2K', active: true },
                  { name: 'Airline Life', members: '24.1K', active: false },
                  { name: 'Type Ratings', members: '5.6K', active: false },
                  { name: 'Cargo & Contract', members: '3.8K', active: false },
                  { name: 'Medical & FAA', members: '6.9K', active: true },
                ].map((chat, i) => (
                  <button key={i} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 transition-colors text-left">
                    <span className="text-sm text-gray-300 flex-1">#{chat.name}</span>
                    <span className="text-xs text-gray-500">{chat.members}</span>
                    {chat.active && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" title="Trending now" />}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 pt-3 border-t border-gray-800">
              All content aggregated with attribution. Click posts to view original source.
            </p>
          </div>

          {/* User Flair */}
          <div className="bg-[#1a1a1b] rounded-lg border border-gray-800 p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">User Flair</h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-xs font-bold">
                U
              </div>
              <div>
                <div className="text-sm font-medium">Wrong_Peach_4125</div>
                <div className="text-xs text-gray-400">ATP | Boeing 737</div>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-[#1a1a1b] rounded-lg border border-gray-800">
            <div className="p-3 border-b border-gray-800">
              <h3 className="font-bold text-sm">r/Pilots Rules</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {[
                'Read the FAQ before posting',
                'Keep it relevant to pilots',
                'No spam or self-promotion',
                'Be respectful to others',
                'Use appropriate flair'
              ].map((rule, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors text-left">
                  <span className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="line-clamp-1">{rule}</span>
                  <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Moderators */}
          <div className="bg-[#1a1a1b] rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">Moderators</h3>
              <MessageSquare className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2">
              {['Captain_Moderator', 'ATC_Supervisor', 'CFI_Admin'].map((mod) => (
                <div key={mod} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {mod[0]}
                  </div>
                  <span className="text-gray-300 hover:underline cursor-pointer">u/{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Careers</a>
            <a href="#" className="hover:underline">Press</a>
            <a href="#" className="hover:underline">Advertise</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Guidelines</a>
          </div>
          <p className="text-xs text-gray-600">PilotTerminal 2026. All rights reserved.</p>
        </aside>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md mx-4">
            {/* Glassmorphism Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              {/* Logo */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">
                  pilot<span className="text-red-400">terminal</span>.com
                </h1>
                <p className="text-white/50 text-sm uppercase tracking-wider">FLIGHT DECK</p>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Email</label>
                <input
                  type="email"
                  placeholder="pilot@pilotterminal.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm text-center">{loginError}</p>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleLogin}
                disabled={loginLoading || !loginEmail || !loginPassword}
                className="w-full bg-red-400 hover:bg-red-500 disabled:bg-red-400/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>Continue →</>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-white/40 text-sm">or</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              {/* Google Sign In */}
              <button 
                onClick={handleGoogleSignIn}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up or continue with Google
              </button>

              {/* Passkey Sign In */}
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm4 10.723V20h-2v-2.277a1.993 1.993 0 0 1-.567-3.287A2.002 2.002 0 0 1 14 16c1.103 0 2 .897 2 2s-.897 2-2 2z"/>
                </svg>
                Sign in with Passkey (Touch ID)
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-white/50 text-sm mt-6">
                Don&apos;t have an account?{' '}
                <a 
                  href="https://pilotrecognition.com/signup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300"
                >
                  Sign up
                </a>
              </p>

              {/* Back Link */}
              <button 
                onClick={() => setShowLoginModal(false)}
                className="w-full text-center text-white/40 text-sm mt-4 hover:text-white/60 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
