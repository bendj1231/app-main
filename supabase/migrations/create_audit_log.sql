-- Create audit log table for tracking admin actions
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject', etc.
  target_table TEXT NOT NULL, -- 'profiles', 'employee_objectives', 'pilot_documents', etc.
  target_id UUID NOT NULL, -- ID of the affected record
  old_values JSONB, -- Previous state (for updates)
  new_values JSONB, -- New state
  description TEXT, -- Human-readable description
  ip_address TEXT, -- Optional: track IP address
  user_agent TEXT, -- Optional: track browser/device
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_table ON public.admin_audit_log(target_table);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_id ON public.admin_audit_log(target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action_type ON public.admin_audit_log(action_type);

-- Enable RLS
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all audit logs
CREATE POLICY "Admins can read audit logs"
  ON public.admin_audit_log FOR SELECT
  USING (auth.uid()::text = (SELECT id FROM public.profiles WHERE id = admin_id AND (role = 'super_admin' OR role = 'admin')));

-- Policy: Admins can insert audit logs (via application)
CREATE POLICY "Admins can insert audit logs"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (auth.uid()::text = (SELECT id FROM public.profiles WHERE id = admin_id AND (role = 'super_admin' OR role = 'admin')));

-- Add comments
COMMENT ON TABLE public.admin_audit_log IS 'Audit log for tracking all admin actions';
COMMENT ON COLUMN public.admin_audit_log.action_type IS 'Type of action: create, update, delete, approve, reject, etc.';
COMMENT ON COLUMN public.admin_audit_log.target_table IS 'Table that was modified';
COMMENT ON COLUMN public.admin_audit_log.target_id IS 'ID of the record that was modified';
COMMENT ON COLUMN public.admin_audit_log.old_values IS 'JSON of previous state (for updates)';
COMMENT ON COLUMN public.admin_audit_log.new_values IS 'JSON of new state';
