import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import {
  OperatorPathway,
  OperatorPathwayProfile,
  OperatorCategory,
  RegionOverview,
  MarketOverview,
  GapAnalysisResult,
} from './types';
import { useHelicopterOperators } from './useHelicopterOperators';
import type { PilotValueAssessment, PilotArchetype } from './pilotValue';

export interface HelicopterOperatorsContextValue {
  pathways: OperatorPathway[];
  recommended: OperatorPathway[];
  featured: OperatorPathway[];
  enriched: OperatorPathway[];
  byCategory: Map<OperatorCategory, OperatorPathway[]>;
  byCountry: Map<string, OperatorPathway[]>;
  countries: {
    country: string;
    label: string;
    totalOperators: number;
    categories: { key: OperatorCategory; label: string; count: number }[];
  }[];
  region: RegionOverview | null;
  // --- Market intelligence ---
  marketOverview: MarketOverview;
  openOperators: OperatorPathway[];
  trending: OperatorPathway[];
  // --- Gap analysis ---
  gapAnalyses: GapAnalysisResult[];
  eligibleOperators: OperatorPathway[];
  nearEligibleOperators: OperatorPathway[];
  // --- Pilot value (independent of any job) ---
  pilotValue: PilotValueAssessment | null;
  pilotArchetype: PilotArchetype;
  // --- Status ---
  loading: boolean;
  total: number;
}

const HelicopterOperatorsContext =
  createContext<HelicopterOperatorsContextValue | null>(null);

export function HelicopterOperatorsProvider({
  profile,
  children,
}: {
  profile?: OperatorPathwayProfile;
  children: ReactNode;
}) {
  const value = useHelicopterOperators(profile);

  const contextValue = useMemo<HelicopterOperatorsContextValue>(
    () => value,
    [value]
  );

  return (
    <HelicopterOperatorsContext.Provider value={contextValue}>
      {children}
    </HelicopterOperatorsContext.Provider>
  );
}

export function useHelicopterOperatorsContext(): HelicopterOperatorsContextValue {
  const ctx = useContext(HelicopterOperatorsContext);
  if (!ctx) {
    throw new Error(
      'useHelicopterOperatorsContext must be used within a HelicopterOperatorsProvider'
    );
  }
  return ctx;
}
