-- Add zip code and assignment fields to orders table
ALTER TABLE public.orders 
ADD COLUMN customer_zip_code TEXT,
ADD COLUMN assigned_freelancer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN assignment_status TEXT DEFAULT 'pending' CHECK (assignment_status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled'));

-- Create freelancers table for freelancer profiles and service areas
CREATE TABLE public.freelancers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT,
  contact_phone TEXT,
  service_areas TEXT[] NOT NULL DEFAULT '{}', -- Array of zip codes they serve
  services_offered TEXT[] NOT NULL DEFAULT '{}', -- Array of service categories they offer
  hourly_rate DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on freelancers table
ALTER TABLE public.freelancers ENABLE ROW LEVEL SECURITY;

-- Create policies for freelancers
CREATE POLICY "Freelancers can view their own profile" ON public.freelancers
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Freelancers can update their own profile" ON public.freelancers
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Edge functions can insert freelancer profiles" ON public.freelancers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view active freelancers" ON public.freelancers
  FOR SELECT
  USING (is_active = true);

-- Create order assignments table for tracking assignment history
CREATE TABLE public.order_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  status TEXT DEFAULT 'offered' CHECK (status IN ('offered', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on order assignments
ALTER TABLE public.order_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for order assignments
CREATE POLICY "Users can view their own assignments" ON public.order_assignments
  FOR SELECT
  USING (freelancer_id = auth.uid());

CREATE POLICY "Edge functions can manage assignments" ON public.order_assignments
  FOR ALL
  USING (true);

-- Add trigger for updated_at on freelancers
CREATE TRIGGER update_freelancers_updated_at
  BEFORE UPDATE ON public.freelancers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-assign orders to freelancers
CREATE OR REPLACE FUNCTION public.auto_assign_order(order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  order_zip TEXT;
  order_service TEXT;
  freelancer_record RECORD;
  assignment_created BOOLEAN := FALSE;
BEGIN
  -- Get order details
  SELECT customer_zip_code, service_name INTO order_zip, order_service
  FROM public.orders 
  WHERE id = order_id;
  
  -- Skip if no zip code provided
  IF order_zip IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Find available freelancers in the area who offer this service
  FOR freelancer_record IN
    SELECT f.user_id, f.business_name
    FROM public.freelancers f
    WHERE f.is_active = TRUE
      AND order_zip = ANY(f.service_areas)
      AND (array_length(f.services_offered, 1) = 0 OR order_service = ANY(f.services_offered))
    ORDER BY f.rating DESC, f.total_jobs ASC
    LIMIT 3 -- Assign to top 3 available freelancers
  LOOP
    -- Create assignment offer
    INSERT INTO public.order_assignments (order_id, freelancer_id, status)
    VALUES (order_id, freelancer_record.user_id, 'offered');
    
    assignment_created := TRUE;
  END LOOP;
  
  -- Update order status if assignments were created
  IF assignment_created THEN
    UPDATE public.orders 
    SET assignment_status = 'assigned'
    WHERE id = order_id;
  END IF;
  
  RETURN assignment_created;
END;
$$;