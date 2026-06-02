import React from 'react';
import { Zap, Users, Clock, AlertCircle } from 'lucide-react';

interface InterestBadgeProps {
  status: string;
  positions?: number;
}

const configs: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  high_interest: {
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: <Zap className="w-3.5 h-3.5" />,
    label: 'High Interest',
  },
  active: {
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: <Zap className="w-3.5 h-3.5" />,
    label: 'Active',
  },
  moderate: {
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: <Users className="w-3.5 h-3.5" />,
    label: 'Moderate Interest',
  },
  limited: {
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: <Clock className="w-3.5 h-3.5" />,
    label: 'Limited',
  },
  paused: {
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: 'Paused',
  },
};

export const InterestBadge: React.FC<InterestBadgeProps> = ({ status }) => {
  const config = configs[status] || configs.moderate;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} text-sm`}>
      {config.icon}
      <span className="font-medium">{config.label}</span>
    </div>
  );
};
