-- Add RLS policy to allow admins to view all freelancer records for approval process
CREATE POLICY "Admins can view all freelancer records" 
ON public.freelancers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);