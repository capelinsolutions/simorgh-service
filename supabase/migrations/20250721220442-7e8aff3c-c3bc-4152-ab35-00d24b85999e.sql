-- Create customer profiles table
CREATE TABLE public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create customer addresses table
CREATE TABLE public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL, -- 'Home', 'Office', etc.
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create service add-ons table
CREATE TABLE public.service_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_per_hour INTEGER NOT NULL, -- in cents
  category TEXT DEFAULT 'extra',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create booking reviews table
CREATE TABLE public.booking_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cleaner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(booking_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'booking', 'assignment', 'payment', 'system'
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- booking_id, order_id, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update orders table to support enhanced booking features
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS selected_addons JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS special_instructions TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS preferred_date DATE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS preferred_time TIME;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 2;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_address_id UUID REFERENCES customer_addresses(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS has_membership_discount BOOLEAN DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS original_amount INTEGER;

-- Insert sample service add-ons
INSERT INTO public.service_addons (name, description, price_per_hour, category) VALUES
('Oven Cleaning', 'Deep clean inside and outside of oven', 1500, 'kitchen'),
('Refrigerator Cleaning', 'Clean inside and outside of refrigerator', 1200, 'kitchen'),
('Window Cleaning (Interior)', 'Clean all interior windows', 800, 'windows'),
('Cabinet Interior Cleaning', 'Clean inside all cabinets and drawers', 1000, 'kitchen'),
('Garage Cleaning', 'Basic garage organization and cleaning', 2000, 'extra'),
('Basement Cleaning', 'Basic basement cleaning and organization', 1800, 'extra');

-- Enable RLS on new tables
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_profiles
CREATE POLICY "Users can view and update own profile" ON public.customer_profiles
FOR ALL USING (user_id = auth.uid());

-- RLS Policies for customer_addresses
CREATE POLICY "Users can manage own addresses" ON public.customer_addresses
FOR ALL USING (user_id = auth.uid());

-- RLS Policies for service_addons
CREATE POLICY "Anyone can view active addons" ON public.service_addons
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage addons" ON public.service_addons
FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- RLS Policies for booking_reviews
CREATE POLICY "Users can view all reviews" ON public.booking_reviews
FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for their bookings" ON public.booking_reviews
FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update own reviews" ON public.booking_reviews
FOR UPDATE USING (customer_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_customer_profiles_updated_at
  BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at
  BEFORE UPDATE ON public.customer_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_addons_updated_at
  BEFORE UPDATE ON public.service_addons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_reviews_updated_at
  BEFORE UPDATE ON public.booking_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();