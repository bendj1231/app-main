import React, { useEffect, useState } from 'react';
import { Send, Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface PathwayCardInterest {
  id: string;
  card_id: string;
  pilot_id: string;
  status: 'interested' | 'submitted' | 'approved' | 'rejected' | string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface EnterprisePathwayCard {
  id: string;
  title?: string;
  name?: string;
  headline?: string;
  description?: string;
}

const statusStyles: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  interested: { icon: Clock, color: 'text-blue-400', label: 'Interested' },
  submitted: { icon: CheckCircle, color: 'text-emerald-400', label: 'Submitted' },
  approved: { icon: CheckCircle, color: 'text-emerald-400', label: 'Approved' },
  rejected: { icon: XCircle, color: 'text-red-400', label: 'Declined' },
};

export const SubmittedInterestsPathways: React.FC = () => {
  const [interests, setInterests] = useState<PathwayCardInterest[]>([]);
  const [cards, setCards] = useState<Record<string, EnterprisePathwayCard>>({});
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
        const rows = await callApi<PathwayCardInterest[]>('queryTable', {
          table: 'pathway_card_interests',
          operation: 'select',
          where: { pilot_id: currentUser.id },
          orderBy: { created_at: 'desc' },
          limit: 100,
        });
        setInterests(rows || []);

        const cardIds = [...new Set((rows || []).map((r) => r.card_id))];
        if (cardIds.length > 0) {
          const cardRows = await callApi<EnterprisePathwayCard[]>('queryTable', {
            table: 'enterprise_pathway_cards',
            operation: 'select',
            where: { id: cardIds },
            limit: 200,
          });
          const map: Record<string, EnterprisePathwayCard> = {};
          (cardRows || []).forEach((card) => {
            map[card.id] = card;
          });
          setCards(map);
        }
      } catch (err) {
        console.error('Error loading submitted pathway interests:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser, callApi]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Submitted Interests</h2>
        </div>
        {interests.length > 0 && (
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
            {interests.length} total
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : !currentUser ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          Sign in to see pathways you’ve expressed interest in.
        </div>
      ) : interests.length > 0 ? (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {interests.map((interest) => {
            const card = cards[interest.card_id];
            const title = card?.title || card?.name || card?.headline || 'Pathway Opportunity';
            const status = statusStyles[interest.status] || {
              icon: Clock,
              color: 'text-slate-400',
              label: interest.status,
            };
            const StatusIcon = status.icon;

            return (
              <div
                key={interest.id}
                className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{title}</p>
                  {card?.description && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{card.description}</p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    Submitted {new Date(interest.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-bold shrink-0 ${status.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {status.label}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-sm">
          <p>No pathway interests submitted yet.</p>
          <a href="/discover" className="mt-2 inline-block text-blue-400 hover:text-blue-300">
            Discover pathways →
          </a>
        </div>
      )}
    </div>
  );
};
