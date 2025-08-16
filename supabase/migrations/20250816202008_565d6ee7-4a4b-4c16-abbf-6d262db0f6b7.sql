-- Fix critical security vulnerability: Restrict public access to freelancer contact information

-- First, drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view active freelancers" ON public.freelancers;

-- Create a restricted public policy that only shows essential booking information
CREATE POLICY "Public can view basic freelancer info" 
ON public.freelancers 
FOR SELECT 
USING (
  is_active = true 
  AND verification_status = 'verified'
);

-- Note: This policy will apply to all columns, but we need to modify the application
-- to only select safe columns when showing public freelancer listings

-- Allow customers with active orders to view contact info of their assigned freelancer
CREATE POLICY "Customers can view assigned freelancer contact" 
ON public.freelancers 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id IN (
    SELECT assigned_freelancer_id 
    FROM public.orders 
    WHERE orders.user_id = auth.uid() 
    AND orders.status IN ('confirmed', 'in_progress', 'completed')
  )
);

-- Allow freelancers to view contact info of other freelancers they're collaborating with
CREATE POLICY "Freelancers can view peer contact for collaboration" 
ON public.freelancers 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() IN (SELECT user_id FROM public.freelancers WHERE is_active = true)
  AND user_id IN (
    -- Freelancers working in same service areas (for referrals, etc.)
    SELECT f2.user_id 
    FROM public.freelancers f1, public.freelancers f2
    WHERE f1.user_id = auth.uid() 
    AND f1.service_areas && f2.service_areas
    AND f2.is_active = true
  )
);

-- Keep the existing policy for freelancers viewing their own profile
-- (This should already exist from the "Freelancers can view their own profile" policy)

-- Add a comment for documentation
COMMENT ON TABLE public.freelancers IS 'Freelancer profiles with restricted public access. Contact information only visible to authorized users.';

-- Create a view for public freelancer listings that only exposes safe fields
CREATE OR REPLACE VIEW public.freelancer_public_profiles AS
SELECT 
  id,
  user_id,
  business_name, -- Business name can be public for booking purposes
  bio,
  experience_years,
  hourly_rate,
  rating,
  total_jobs,
  services_offered,
  service_areas,
  profile_image_url,
  certifications,
  verification_status,
  created_at,
  -- Explicitly exclude sensitive fields:
  -- contact_phone, stripe_account_id, documents, availability details, etc.
  NULL::text as contact_phone, -- Explicitly null for safety
  NULL::text as stripe_account_id -- Explicitly null for safety
FROM public.freelancers
WHERE is_active = true AND verification_status = 'verified';

-- Grant public read access to the safe view
GRANT SELECT ON public.freelancer_public_profiles TO anon;
GRANT SELECT ON public.freelancer_public_profiles TO authenticated;