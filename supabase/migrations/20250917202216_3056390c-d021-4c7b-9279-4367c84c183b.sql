-- Update freelancer to be active and verified for testing
UPDATE freelancers 
SET verification_status = 'verified', is_active = true
WHERE business_name = 'Premium Cleaning Services';

-- Also update the other freelancer to be verified and active for more test options
UPDATE freelancers 
SET verification_status = 'verified', is_active = true
WHERE business_name = 'TA Creatives';