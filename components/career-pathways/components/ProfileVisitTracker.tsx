import React, { useEffect, useState } from 'react';
import { Eye, Loader2, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface ProfileView {
  id: string;
  pilot_id: string;
  viewer_id?: string;
  viewer_name?: string;
  viewer_type?: string;
  viewed_at: string;
}

export const ProfileVisitTracker: React.FC = () => {
  const [count, setCount] = useState(0);
  const [recent, setRecent] = useState<ProfileView[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    const load = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const views = await callApi<ProfileView[]>('queryTable', {
          table: 'profile_views',
          operation: 'select',
          where: { pilot_id: currentUser.id },
          orderBy: { viewed_at: 'desc' },
          limit: 10,
        });
        setRecent(views || []);
        setCount(views?.length || 0);
      } catch (err) {
        console.error('Error loading profile views:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser, callApi]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Profile Visits</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      ) : !currentUser ? (
        <div className="text-center py-6 text-slate-400 text-sm">
          Sign in to see profile visit activity.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{count}</span>
            <span className="text-sm text-slate-400">
              operator{count !== 1 ? 's' : ''} viewed your profile
            </span>
          </div>

          {recent.length > 0 && (
            <ul className="space-y-2">
              {recent.slice(0, 5).map((view) => (
                <li
                  key={view.id}
                  className="flex items-center justify-between text-sm text-slate-300 bg-slate-800/50 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {view.viewer_name || view.viewer_type || 'Operator'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    {new Date(view.viewed_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
