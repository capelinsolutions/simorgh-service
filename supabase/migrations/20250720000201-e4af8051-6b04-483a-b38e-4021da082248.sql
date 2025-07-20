-- Create orders table to track service purchases (one-off payments)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_description TEXT,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  is_guest_order BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscribers table to track memberships (recurring payments)
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT CHECK (subscription_tier IN ('Basic', 'Premium')),
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT
  USING (user_id = auth.uid() OR (is_guest_order = true AND customer_email = auth.email()));

CREATE POLICY "Edge functions can insert orders" ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Edge functions can update orders" ON public.orders
  FOR UPDATE
  USING (true);

-- Create policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
  FOR SELECT
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Edge functions can insert subscriptions" ON public.subscribers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Edge functions can update subscriptions" ON public.subscribers
  FOR UPDATE
  USING (true);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();