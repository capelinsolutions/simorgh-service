-- Add RLS policy to allow admins to update freelancer records for approval
CREATE POLICY "Admins can update freelancer records" 
ON public.freelancers 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 
  FROM public.admin_users 
  WHERE admin_users.user_id = auth.uid()
));