-- Create employee_objectives table for admin employee objectives page
CREATE TABLE IF NOT EXISTS public.employee_objectives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_name TEXT,
  department TEXT,
  objective TEXT NOT NULL,
  key_results JSONB DEFAULT '[]',
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'cancelled'
  due_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0, -- 0-100
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_employee_objectives_employee ON public.employee_objectives(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_objectives_status ON public.employee_objectives(status);
CREATE INDEX IF NOT EXISTS idx_employee_objectives_due_date ON public.employee_objectives(due_date);

-- Enable RLS
ALTER TABLE public.employee_objectives ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own objectives
CREATE POLICY "Users can read own objectives"
  ON public.employee_objectives FOR SELECT
  USING (auth.uid() = employee_id);

-- Policy: Admins can read all objectives
CREATE POLICY "Admins can read all objectives"
  ON public.employee_objectives FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'admin'));

-- Policy: Admins can insert objectives
CREATE POLICY "Admins can insert objectives"
  ON public.employee_objectives FOR INSERT
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'admin'));

-- Policy: Admins can update objectives
CREATE POLICY "Admins can update objectives"
  ON public.employee_objectives FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'admin'));

COMMENT ON TABLE public.employee_objectives IS 'Employee OKRs and objectives for admin tracking';
