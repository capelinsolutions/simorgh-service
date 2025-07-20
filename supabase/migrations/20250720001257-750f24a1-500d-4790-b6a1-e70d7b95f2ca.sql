-- Add membership type to subscribers table to differentiate customer vs freelancer subscriptions
ALTER TABLE public.subscribers 
ADD COLUMN membership_type TEXT DEFAULT 'customer' CHECK (membership_type IN ('customer', 'freelancer'));

-- Create freelancer subscription tiers
-- Update existing check constraint to include freelancer tiers
ALTER TABLE public.subscribers 
DROP CONSTRAINT IF EXISTS subscribers_subscription_tier_check;

ALTER TABLE public.subscribers 
ADD CONSTRAINT subscribers_subscription_tier_check 
CHECK (subscription_tier IN ('Basic', 'Premium', 'Freelancer Basic', 'Freelancer Pro', 'Freelancer Enterprise'));