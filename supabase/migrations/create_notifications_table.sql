-- Create notifications table for admin dashboard
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_id ON public.admin_notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON public.admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON public.admin_notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read their own notifications
CREATE POLICY "Admins can read own notifications"
  ON public.admin_notifications FOR SELECT
  USING (auth.uid()::text = (SELECT id FROM public.profiles WHERE id = admin_id AND (role = 'super_admin' OR role = 'admin')));

-- Policy: Admins can insert their own notifications
CREATE POLICY "Admins can insert own notifications"
  ON public.admin_notifications FOR INSERT
  WITH CHECK (auth.uid()::text = (SELECT id FROM public.profiles WHERE id = admin_id AND (role = 'super_admin' OR role = 'admin')));

-- Policy: Admins can update their own notifications
CREATE POLICY "Admins can update own notifications"
  ON public.admin_notifications FOR UPDATE
  USING (auth.uid()::text = (SELECT id FROM public.profiles WHERE id = admin_id AND (role = 'super_admin' OR role = 'admin')));

-- Policy: Admins can delete their own notifications
CREATE POLICY "Admins can delete own notifications"
  ON public.admin_notifications FOR DELETE
  USING (auth.uid()::text = (SELECT id FROM public.profiles WHERE id = admin_id AND (role = 'super_admin' OR role = 'admin')));

-- Add comments
COMMENT ON TABLE public.admin_notifications IS 'Admin notifications for dashboard alerts';
COMMENT ON COLUMN public.admin_notifications.type IS 'Notification type: info, success, warning, error';
