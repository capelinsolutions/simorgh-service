-- Fix the security definer view issue by recreating without SECURITY DEFINER

-- Drop the existing view
DROP VIEW IF EXISTS public.freelancer_public_profiles;

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER which is safer)
CREATE VIEW public.freelancer_public_profiles AS
SELECT 
  id,
  user_id,
  business_name,
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
  created_at
FROM public.freelancers
WHERE is_active = true AND verification_status = 'verified';

-- Apply RLS to the view
ALTER VIEW public.freelancer_public_profiles SET (security_invoker = true);

-- Grant appropriate access
GRANT SELECT ON public.freelancer_public_profiles TO anon;
GRANT SELECT ON public.freelancer_public_profiles TO authenticated;