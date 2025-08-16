-- Add the currently logged in admin user to admin_users table
INSERT INTO public.admin_users (user_id, role, permissions)
VALUES (
  '9c5fd3dc-f6bc-42a0-9803-5194184831f3'::uuid,
  'super_admin',
  ARRAY['all']::text[]
)
ON CONFLICT (user_id) DO NOTHING;