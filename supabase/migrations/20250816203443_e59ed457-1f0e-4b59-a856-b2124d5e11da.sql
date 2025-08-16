-- Create a test admin user for testing purposes
-- First, let's create a test user in auth.users (this is just for testing)
-- In production, users would sign up normally

-- Insert a demo admin user record (this assumes there's an auth user with this ID)
-- Note: In real usage, users sign up through auth and then get added to admin_users
DO $$
BEGIN
  -- Create admin user record if it doesn't exist
  INSERT INTO public.admin_users (user_id, role, permissions)
  VALUES (
    '50af28fd-fadf-414c-9960-e8d9ce271053'::uuid,
    'super_admin',
    ARRAY['all']::text[]
  )
  ON CONFLICT (user_id) DO NOTHING;
END $$;