-- Add missing policies and enhance database structure

-- Add RLS policies for better security
CREATE POLICY "Users can view their own orders detailed" ON public.orders
FOR SELECT
USING (user_id = auth.uid() OR assigned_freelancer_id = auth.uid());

-- Add admin notifications table
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  priority TEXT DEFAULT 'medium',
  recipient_role TEXT DEFAULT 'all', -- 'all', 'customer', 'freelancer'
  recipient_id UUID NULL, -- specific user or null for broadcast
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_at TIMESTAMPTZ NULL, -- for scheduled announcements
  expires_at TIMESTAMPTZ NULL,
  created_by UUID NOT NULL
);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notifications" ON public.admin_notifications
FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Users can view their notifications" ON public.admin_notifications
FOR SELECT
USING (
  recipient_role = 'all' OR 
  (recipient_role = 'customer' AND auth.uid() NOT IN (SELECT user_id FROM freelancers)) OR
  (recipient_role = 'freelancer' AND auth.uid() IN (SELECT user_id FROM freelancers)) OR
  recipient_id = auth.uid()
);

-- Add special offers table
CREATE TABLE public.special_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'percentage', 'fixed_amount', 'first_clean'
  value INTEGER NOT NULL, -- percentage or amount in cents
  code TEXT UNIQUE,
  min_order_amount INTEGER DEFAULT 0,
  max_uses INTEGER NULL,
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NULL,
  applicable_services TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage offers" ON public.special_offers
FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Users can view active offers" ON public.special_offers
FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Add offer usage tracking
CREATE TABLE public.offer_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES special_offers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  discount_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offer_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their offer usage" ON public.offer_usage
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can track offer usage" ON public.offer_usage
FOR INSERT
WITH CHECK (true);

-- Add dynamic pricing table
CREATE TABLE public.pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  service_multiplier DECIMAL(3,2) DEFAULT 1.0, -- 1.0 = base price, 1.5 = 50% increase
  membership_discount DECIMAL(3,2) DEFAULT 0.0, -- 0.5 = 50% off
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage pricing" ON public.pricing_tiers
FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Users can view active pricing" ON public.pricing_tiers
FOR SELECT
USING (is_active = true);

-- Add system activity log
CREATE TABLE public.system_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  description TEXT,
  user_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity log" ON public.system_activity_log
FOR SELECT
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Add testimonial management fields
ALTER TABLE booking_reviews ADD COLUMN admin_approved BOOLEAN DEFAULT false;
ALTER TABLE booking_reviews ADD COLUMN featured_priority INTEGER DEFAULT 0;
ALTER TABLE booking_reviews ADD COLUMN admin_notes TEXT;

-- Add user status management
ALTER TABLE freelancers ADD COLUMN status TEXT DEFAULT 'active'; -- 'active', 'suspended', 'banned'
ALTER TABLE customer_profiles ADD COLUMN status TEXT DEFAULT 'active';

-- Add overbooking prevention
ALTER TABLE freelancers ADD COLUMN max_concurrent_jobs INTEGER DEFAULT 3;
ALTER TABLE freelancers ADD COLUMN current_active_jobs INTEGER DEFAULT 0;

-- Update triggers for updated_at
CREATE TRIGGER update_special_offers_updated_at
BEFORE UPDATE ON public.special_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_tiers_updated_at
BEFORE UPDATE ON public.pricing_tiers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();