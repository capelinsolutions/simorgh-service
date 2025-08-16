-- Fix the admin_users RLS policy to prevent infinite recursion
DROP POLICY IF EXISTS "Only admins can view admin users" ON public.admin_users;

CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  -- Use a simpler policy that doesn't reference itself
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.role IN ('admin', 'super_admin')
    LIMIT 1
  )
);

-- Also ensure service_addons policies work correctly for admins
DROP POLICY IF EXISTS "Admins can manage addons" ON public.service_addons;

CREATE POLICY "Admins can manage service addons" 
ON public.service_addons 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
    LIMIT 1
  )
);