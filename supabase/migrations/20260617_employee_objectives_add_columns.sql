-- Add missing columns to employee_objectives to match frontend usage
ALTER TABLE public.employee_objectives
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS assignee TEXT,
  ADD COLUMN IF NOT EXISTS collaborators TEXT,
  ADD COLUMN IF NOT EXISTS screenshots JSONB DEFAULT '[]';

-- Backfill: copy existing data into new columns
UPDATE public.employee_objectives SET title = objective WHERE title IS NULL AND objective IS NOT NULL;
UPDATE public.employee_objectives SET description = notes WHERE description IS NULL AND notes IS NOT NULL;
UPDATE public.employee_objectives SET assignee = employee_name WHERE assignee IS NULL AND employee_name IS NOT NULL;
