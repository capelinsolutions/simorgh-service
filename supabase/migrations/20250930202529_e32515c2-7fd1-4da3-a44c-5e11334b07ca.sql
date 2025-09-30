-- Clean up existing demo data
DELETE FROM customer_profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%demo%' OR email LIKE '%test%'
);

DELETE FROM admin_users WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%demo%' OR email LIKE '%test%'
);

DELETE FROM freelancers WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%demo%' OR email LIKE '%test%'
);

-- Note: We cannot delete from auth.users table directly via SQL
-- The edge function will handle user deletion and recreation