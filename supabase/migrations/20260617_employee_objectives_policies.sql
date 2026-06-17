-- Add DELETE policy for admins
CREATE POLICY IF NOT EXISTS "Admins can delete objectives"
  ON public.employee_objectives FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'admin'));

-- Add updated_at trigger for employee_objectives
CREATE OR REPLACE FUNCTION public.update_employee_objectives_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_employee_objectives_updated_at ON public.employee_objectives;
CREATE TRIGGER update_employee_objectives_updated_at
  BEFORE UPDATE ON public.employee_objectives
  FOR EACH ROW
  EXECUTE FUNCTION public.update_employee_objectives_updated_at();
