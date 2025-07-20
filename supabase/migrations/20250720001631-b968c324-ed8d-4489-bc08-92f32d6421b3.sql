-- Create admin roles table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'support')),
  permissions TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create communications table for admin messaging
CREATE TABLE public.communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'in_app', 'system')),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('user', 'freelancer', 'all', 'segment')),
  recipient_id UUID REFERENCES auth.users(id),
  subject TEXT,
  message TEXT NOT NULL,
  template_id TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create system settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add payment metadata to orders for admin tracking
ALTER TABLE public.orders 
ADD COLUMN payment_method TEXT,
ADD COLUMN refund_amount INTEGER DEFAULT 0,
ADD COLUMN refund_reason TEXT,
ADD COLUMN admin_notes TEXT;

-- Enable RLS on new tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users (only admins can manage)
CREATE POLICY "Only admins can view admin users" ON public.admin_users
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Only super admins can modify admin users" ON public.admin_users
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND role = 'super_admin'));

-- Create policies for communications
CREATE POLICY "Admins can manage communications" ON public.communications
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Create policies for system_settings
CREATE POLICY "Admins can view all settings" ON public.system_settings
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can modify settings" ON public.system_settings
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = $1
  );
$$;

-- Create function to get user admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id UUID)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role 
  FROM public.admin_users 
  WHERE admin_users.user_id = $1;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communications_updated_at
  BEFORE UPDATE ON public.communications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, category, is_public) VALUES
('platform_name', '"Simorgh Service Group"', 'Platform display name', 'branding', true),
('commission_rate_default', '0.10', 'Default commission rate for freelancers', 'payments', false),
('auto_assignment_enabled', 'true', 'Enable automatic order assignment', 'orders', false),
('max_freelancers_per_order', '3', 'Maximum freelancers to assign per order', 'orders', false),
('customer_support_email', '"support@simorgh.com"', 'Customer support email address', 'contact', true),
('maintenance_mode', 'false', 'Enable maintenance mode', 'system', false);