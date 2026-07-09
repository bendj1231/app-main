import React, { useEffect, useMemo, useState } from 'react';
import { Bookmark, Plane, Building2, Star, Loader2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { BookmarkService, BookmarkItem } from '@/services/bookmarkService';

type Tab = 'aircraft' | 'expectations';

interface AirlineExpectation {
  id: string;
  enterprise_id: string;
  position_type: string;
  min_flight_hours: number;
  license_type?: string;
  type_ratings?: string;
  medical_class?: string;
  english_level?: string;
  additional_reqs?: string;
  is_active?: number;
}

export const BookmarkedAircraftExpectations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('aircraft');
  const [aircraftBookmarks, setAircraftBookmarks] = useState<BookmarkItem[]>([]);
  const [expectationBookmarks, setExpectationBookmarks] = useState<BookmarkItem[]>([]);
  const [expectations, setExpectations] = useState<AirlineExpectation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentUser } = useAuth();
  const { callApi } = useWorkerAuth();
  const bookmarkService = useMemo(() => new BookmarkService(callApi), [callApi]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [aircraft, expBookmarks, allExpectations] = await Promise.all([
          bookmarkService.getBookmarksByType('aircraft', currentUser.id),
          bookmarkService.getBookmarksByType('airline_expectation', currentUser.id),
          callApi<AirlineExpectation[]>('queryTable', {
            table: 'airline_expectations',
            operation: 'select',
            where: { is_active: 1 },
            limit: 200,
          }),
        ]);
        if (cancelled) return;
        setAircraftBookmarks(aircraft);
        setExpectationBookmarks(expBookmarks);
        setExpectations(allExpectations || []);
      } catch (err) {
        console.error('Error loading bookmarks/expectations:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser, bookmarkService, callApi, refreshKey]);

  const handleToggleAircraft = async (bookmark: BookmarkItem) => {
    if (!currentUser) return;
    try {
      await bookmarkService.toggleBookmark(
        bookmark.item_id,
        'aircraft',
        {
          title: bookmark.title,
          description: bookmark.description,
          image_url: bookmark.image_url,
          metadata: bookmark.metadata,
        },
        currentUser.id
      );
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error toggling aircraft bookmark:', err);
    }
  };

  const handleToggleExpectation = async (exp: AirlineExpectation) => {
    if (!currentUser) return;
    const description = [exp.license_type, exp.type_ratings, exp.medical_class, exp.english_level, exp.additional_reqs]
      .filter(Boolean)
      .join(' • ') || 'Airline hiring expectation';
    try {
      await bookmarkService.toggleBookmark(
        exp.id,
        'airline_expectation',
        {
          title: `${exp.position_type} — ${exp.min_flight_hours}+ hrs`,
          description,
          metadata: { ...exp },
        },
        currentUser.id
      );
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error toggling expectation bookmark:', err);
    }
  };

  const expectationBookmarkIds = useMemo(
    () => new Set(expectationBookmarks.map((b) => b.item_id)),
    [expectationBookmarks]
  );

  const tabs = [
    { id: 'aircraft' as Tab, label: 'Aircraft', icon: Plane, count: aircraftBookmarks.length },
    { id: 'expectations' as Tab, label: 'Expectations', icon: Building2, count: expectationBookmarks.length },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Bookmarks</h2>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-700 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 bg-slate-600 text-white px-1.5 py-0.5 rounded-full text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : !currentUser ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          Sign in to see your saved aircraft and expectations.
        </div>
      ) : activeTab === 'aircraft' ? (
        <div className="space-y-3">
          {aircraftBookmarks.length > 0 ? (
            aircraftBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {bookmark.image_url ? (
                    <img src={bookmark.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{bookmark.title}</p>
                    {bookmark.description && (
                      <p className="text-xs text-slate-400 truncate">{bookmark.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleAircraft(bookmark)}
                  className="p-2 text-amber-400 hover:text-amber-300 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
                  aria-label="Remove bookmark"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              <p>No aircraft bookmarked yet.</p>
              <a href="/type-ratings" className="mt-2 inline-block text-blue-400 hover:text-blue-300">
                Browse type ratings →
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {expectations.length > 0 ? (
            expectations.map((exp) => {
              const isBookmarked = expectationBookmarkIds.has(exp.id);
              return (
                <div
                  key={exp.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    isBookmarked ? 'bg-slate-800/80 border border-slate-700' : 'bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white">{exp.position_type}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {exp.min_flight_hours}+ hrs
                      {exp.license_type && ` • ${exp.license_type}`}
                      {exp.type_ratings && ` • ${exp.type_ratings}`}
                      {exp.medical_class && ` • Medical ${exp.medical_class}`}
                      {exp.english_level && ` • ICAO ${exp.english_level}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleExpectation(exp)}
                    className={`p-2 rounded-lg transition-colors shrink-0 ${
                      isBookmarked
                        ? 'text-amber-400 hover:text-amber-300 hover:bg-slate-700'
                        : 'text-slate-500 hover:text-amber-400 hover:bg-slate-700'
                    }`}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              No airline expectations available right now.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
