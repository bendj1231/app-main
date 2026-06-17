-- Migration: Daily Quotes and Team Updates for Daily Briefing
-- Date: June 17, 2026

-- ============================================
-- 1. DAILY QUOTES
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.daily_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read daily quotes"
  ON public.daily_quotes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can manage daily quotes"
  ON public.daily_quotes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Seed a default quote
INSERT INTO public.daily_quotes (quote, author, is_active)
VALUES ('Excellence is not a destination, it is a continuous journey that never ends.', 'Karl Vogt', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. TEAM UPDATES (shared Daily Briefing feed)
-- ============================================
CREATE TABLE IF NOT EXISTS public.team_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error, lead, revenue, memo
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_updates_created_at ON public.team_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_updates_type ON public.team_updates(type);

ALTER TABLE public.team_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all team updates"
  ON public.team_updates FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can insert team updates"
  ON public.team_updates FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can update team updates"
  ON public.team_updates FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can delete team updates"
  ON public.team_updates FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Seed sample updates
INSERT INTO public.team_updates (title, message, type) VALUES
('New enterprise inquiry', 'Alpha Aviation Group', 'lead'),
('Recognition+ subscriptions', '5 new Recognition+ subscriptions today', 'revenue'),
('Team memo', 'Karl posted: "Push for September launch — no excuses"', 'memo')
ON CONFLICT DO NOTHING;
