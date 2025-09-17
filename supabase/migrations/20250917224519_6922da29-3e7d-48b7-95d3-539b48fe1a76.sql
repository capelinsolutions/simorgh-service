-- Add RLS policy to allow users to insert their own freelancer profile
CREATE POLICY "Users can insert their own freelancer profile" 
ON public.freelancers 
FOR INSERT 
WITH CHECK (user_id = auth.uid());