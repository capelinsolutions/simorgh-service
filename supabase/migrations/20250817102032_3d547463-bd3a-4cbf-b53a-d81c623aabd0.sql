-- Create security definer functions to avoid infinite recursion in RLS policies

-- Function to get user's admin role
CREATE OR REPLACE FUNCTION public.get_user_admin_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT role 
  FROM public.admin_users 
  WHERE admin_users.user_id = $1;
$$;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = $1 AND role = 'super_admin'
  );
$$;

-- Function to check if user is admin or super admin
CREATE OR REPLACE FUNCTION public.is_admin_or_super(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = $1 AND role = ANY(ARRAY['admin', 'super_admin'])
  );
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only super admins can modify admin users" ON public.admin_users;

-- Create new policies using security definer functions
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  user_id = auth.uid() OR public.is_admin_or_super(auth.uid())
);

CREATE POLICY "Only super admins can modify admin users" 
ON public.admin_users 
FOR ALL 
USING (public.is_super_admin(auth.uid()));

-- Also fix freelancers policies if they have similar issues
-- Check if there are any recursive policies on freelancers table and fix them
DROP POLICY IF EXISTS "Freelancers can view peer contact for collaboration" ON public.freelancers;

-- Create a simpler policy for freelancer collaboration that doesn't cause recursion
CREATE POLICY "Freelancers can view peer contact for collaboration" 
ON public.freelancers 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND is_active = true 
  AND verification_status = 'verified'
);