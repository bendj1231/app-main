/**
 * Bookmarks View Component
 * 
 * Dedicated view for displaying all bookmarked pathways and items
 */

import React, { useState, useEffect } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { motion } from 'framer-motion';
import { Bookmark, Search, Filter, Grid3x3, List, ChevronRight, ChevronLeft, Clock, Star, Trash2, ExternalLink, Plane, Building, GraduationCap, Factory } from 'lucide-react';
import { useAuth } from '../../../../src/contexts/AuthContext';
import { bookmarkService, BookmarkItem } from '../../../../src/services/bookmarkService';

interface BookmarksViewProps {
  className?: string;
  onNavigate?: (tab: string) => void;
}

const BookmarksView: React.FC<BookmarksViewProps> = ({ className = '', onNavigate }) => {
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pathways' | 'programs' | 'airlines' | 'manufacturers' | 'aircraft'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'match' | 'favorite'>('recent');
  const [activeTab, setActiveTab] = useState<'all' | 'pathways' | 'programs' | 'airlines' | 'manufacturers' | 'aircraft' | 'favorites'>('all');
  const [userBookmarks, setUserBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkCounts, setBookmarkCounts] = useState({
    all: 0,
    aircraft: 0,
    pathway: 0,
    program: 0,
    airline: 0,
    manufacturer: 0
  });

  // Load bookmarks from database when user changes
  useEffect(() => {
    if (!currentUser) {
      // Logged out users should see no bookmarks
      setUserBookmarks([]);
      setBookmarkCounts({
        all: 0,
        aircraft: 0,
        pathway: 0,
        program: 0,
        airline: 0,
        manufacturer: 0
      });
      setLoading(false);
      return;
    }

    const loadBookmarks = async () => {
      try {
        setLoading(true);
        const bookmarks = await bookmarkService.getUserBookmarks(currentUser.id);
        const counts = await bookmarkService.getBookmarkCounts(currentUser.id);
        
        setUserBookmarks(bookmarks);
        setBookmarkCounts(counts);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        // Fallback to empty state
        setUserBookmarks([]);
        setBookmarkCounts({
          all: 0,
          aircraft: 0,
          pathway: 0,
          program: 0,
          airline: 0,
          manufacturer: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [currentUser]);

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'ALL', icon: Bookmark, count: bookmarkCounts.all },
    { id: 'pathways', label: 'PATHWAYS', icon: Plane, count: bookmarkCounts.pathway },
    { id: 'programs', label: 'PROGRAMS', icon: GraduationCap, count: bookmarkCounts.program },
    { id: 'airlines', label: 'AIRLINES', icon: Building, count: bookmarkCounts.airline },
    { id: 'aircraft', label: 'AIRCRAFT', icon: Plane, count: bookmarkCounts.aircraft },
    { id: 'favorites', label: 'FAVORITES', icon: Star, count: 0 } // TODO: Implement favorites
  ];

  // Filter and sort bookmarks based on active tab
  const filteredBookmarks = userBookmarks
    .filter(bookmark => {
      const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (bookmark.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      // Filter based on active tab
      let matchesTab = true;
      if (activeTab === 'all') {
        matchesTab = true;
      } else if (activeTab === 'favorites') {
        matchesTab = false; // TODO: Implement favorites
      } else if (activeTab === 'aircraft') {
        matchesTab = bookmark.item_type === 'aircraft';
      } else {
        matchesTab = bookmark.item_type === activeTab.slice(0, -1); // Remove 's' from plural
      }
      
      // Additional filter type (legacy, can be removed or kept for advanced filtering)
      const matchesFilter = filterType === 'all' || bookmark.item_type === filterType.slice(0, -1);
      
      return matchesSearch && matchesTab && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'match':
          return 0; // TODO: Implement match scores
        case 'favorite':
          return 0; // TODO: Implement favorites
        default:
          return 0;
      }
    });

  const renderBookmarkCard = (bookmark: BookmarkItem) => (
    <motion.div
      key={bookmark.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-pointer"
    >
      <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-2xl border border-slate-600/30 rounded-none overflow-hidden shadow-2xl shadow-black/70">
        {/* Top Logo Bar for Aircraft */}
        {bookmark.item_type === 'aircraft' && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 border-b border-slate-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Aircraft</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                {bookmark.metadata?.category && (
                  <>
                    <span>{bookmark.metadata.category}</span>
                    {bookmark.metadata?.subcategory && (
                      <>
                        <span>•</span>
                        <span>{bookmark.metadata.subcategory}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Red Notice Component */}
        {bookmark.item_type === 'aircraft' && bookmark.metadata?.hasRecentUpdate && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                {bookmark.metadata?.updateType === 'requirements' ? 'REQUIREMENTS UPDATED' : 'HIGH DEMAND'}
              </span>
            </div>
            <p className="text-xs text-red-300 mt-1 line-clamp-2">
              {bookmark.metadata?.updateMessage || 
                (bookmark.metadata?.updateType === 'requirements' 
                  ? 'Recent regulatory changes may affect certification requirements' 
                  : 'This aircraft type is experiencing high demand in the current market')
              }
            </p>
          </div>
        )}
        
        {/* Background Image */}
        <div className="relative h-48">
          <img 
            src={bookmark.image_url || 'https://images.unsplash.com/photo-1493976040374-85c8e2990c97?w=400&h=200&fit=crop&auto=format&q=80'} 
            alt={bookmark.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.className = target.parentElement!.className + ' bg-gradient-to-br from-slate-800 to-slate-900';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs text-white bg-teal-400/20 backdrop-blur-sm px-2 py-1 rounded border border-teal-400/30">
              {bookmark.item_type.toUpperCase()}
            </span>
          </div>
          
          {/* Favorite Button */}
          <button className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
            <Star className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white">{bookmark.title}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-300 mb-3 line-clamp-2">
            {bookmark.description || 'No description available'}
          </p>
          
          {/* Tags from metadata */}
          <div className="flex flex-wrap gap-1 mb-3">
            {bookmark.metadata?.category && (
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded border border-slate-600/40">
                {bookmark.metadata.category}
              </span>
            )}
            {bookmark.metadata?.subcategory && (
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded border border-slate-600/40">
                {bookmark.metadata.subcategory}
              </span>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-xs text-teal-400 hover:text-white transition-colors duration-300">
              <ExternalLink className="w-3 h-3" />
              View Details
            </button>
            <button 
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors duration-300"
              onClick={async () => {
                try {
                  await bookmarkService.removeBookmark(bookmark.item_id, bookmark.item_type);
                  // Refresh bookmarks
                  if (currentUser) {
                    const bookmarks = await bookmarkService.getUserBookmarks(currentUser.id);
                    const counts = await bookmarkService.getBookmarkCounts(currentUser.id);
                    setUserBookmarks(bookmarks);
                    setBookmarkCounts(counts);
                  }
                } catch (error) {
                  console.error('Error removing bookmark:', error);
                }
              }}
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
        
        {/* Hover Effect */}
        <div className="absolute inset-0 border-2 border-teal-400/0 group-hover:border-teal-400/50 transition-colors duration-300 pointer-events-none rounded-none" />
      </div>
    </motion.div>
  );

  const renderBookmarkListItem = (bookmark: BookmarkItem) => (
    <motion.div
      key={bookmark.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-2xl border border-slate-600/30 rounded-none p-4 shadow-2xl shadow-black/70"
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-none overflow-hidden flex-shrink-0">
          <img 
            src={bookmark.image_url || 'https://images.unsplash.com/photo-1493976040374-85c8e2990c97?w=400&h=200&fit=crop&auto=format&q=80'} 
            alt={bookmark.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.className = target.parentElement!.className + ' bg-gradient-to-br from-slate-800 to-slate-900';
            }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white truncate">{bookmark.title}</h3>
              <span className="text-xs text-white bg-teal-400/20 backdrop-blur-sm px-2 py-0.5 rounded border border-teal-400/30">
                {bookmark.item_type.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-6 h-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
          
          <p className="text-xs text-slate-300 mb-2 line-clamp-1">
            {bookmark.description || 'No description available'}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {bookmark.metadata?.category && (
                  <span className="text-xs text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded border border-slate-600/40">
                    {bookmark.metadata.category}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="text-xs text-teal-400 hover:text-white transition-colors duration-300">
                View
              </button>
              <button 
                className="text-xs text-slate-400 hover:text-red-400 transition-colors duration-300"
                onClick={async () => {
                  try {
                    await bookmarkService.removeBookmark(bookmark.item_id, bookmark.item_type);
                    // Refresh bookmarks
                    if (currentUser) {
                      const bookmarks = await bookmarkService.getUserBookmarks(currentUser.id);
                      const counts = await bookmarkService.getBookmarkCounts(currentUser.id);
                      setUserBookmarks(bookmarks);
                      setBookmarkCounts(counts);
                    }
                  } catch (error) {
                    console.error('Error removing bookmark:', error);
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            {onNavigate && (
              <button
                onClick={() => onNavigate('pathways')}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-600/40 rounded-lg hover:bg-slate-600/50 transition-colors duration-300"
                title="Back to Pathways"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Back</span>
              </button>
            )}
            <div className="relative">
              <Bookmark className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white">» BOOKMARKS</h1>
            <span className="text-sm text-slate-400 bg-teal-400/20 px-2 py-1 rounded border border-teal-400/30">
              {filteredBookmarks.length} items
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 bg-slate-700/50 border border-slate-600/40 rounded-lg hover:bg-slate-600/50 transition-colors duration-300">
              <Filter className="w-4 h-4 text-white" />
            </button>
            <div className="flex bg-slate-700/50 border border-slate-600/40 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors duration-300 ${
                  viewMode === 'grid' ? 'bg-teal-400/20 text-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors duration-300 ${
                  viewMode === 'list' ? 'bg-teal-400/20 text-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                relative px-4 py-3 flex items-center gap-2 text-sm font-bold transition-all duration-300
                ${activeTab === tab.id
                  ? 'text-white border-b-2 border-teal-400'
                  : 'text-slate-400 hover:text-white hover:border-b-2 hover:border-slate-600'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="text-xs bg-slate-700/50 px-1.5 py-0.5 rounded border border-slate-600/40">
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
              )}
            </button>
          ))}
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-400/50 transition-colors duration-300"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600/40 rounded-lg text-white focus:outline-none focus:border-teal-400/50 transition-colors duration-300"
            >
              <option value="recent">Recently Accessed</option>
              <option value="name">Name</option>
              <option value="match">Match Score</option>
              <option value="favorite">Favorites</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Bookmarks Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-slate-600 border-t-teal-400 rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Loading bookmarks...</h3>
          <p className="text-slate-400">
            {currentUser ? 'Fetching your saved bookmarks' : 'Please sign in to view your bookmarks'}
          </p>
        </div>
      ) : filteredBookmarks.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredBookmarks.map(bookmark => 
            viewMode === 'grid' ? renderBookmarkCard(bookmark) : renderBookmarkListItem(bookmark)
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          {currentUser ? (
            <>
              <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No bookmarks found</h3>
              <p className="text-slate-400">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start bookmarking aircraft, pathways, and programs to see them here'
                }
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                <Bookmark className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Login to Access Bookmarks</h3>
              <p className="text-slate-400 mb-6">
                Sign in to save and view your bookmarked aircraft, pathways, and programs
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
// [AUDIT] Removed console.log // line 506
                    const event = new CustomEvent('open-login-modal');
                    window.dispatchEvent(event);
// [AUDIT] Removed console.log // line 509
                  }}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold tracking-wider rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => {
// [AUDIT] Removed console.log // line 517
                    safeRedirect('/become-member');
                  }}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold tracking-wider rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                >
                  BECOME A MEMBER
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookmarksView;
