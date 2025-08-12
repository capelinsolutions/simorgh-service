-- Fix all database functions to use secure search_path settings

-- Update get_admin_role function
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER SET search_path = ''
AS $function$
  SELECT role 
  FROM public.admin_users 
  WHERE admin_users.user_id = $1;
$function$;

-- Update is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = $1
  );
$function$;

-- Update auto_assign_order function
CREATE OR REPLACE FUNCTION public.auto_assign_order(order_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
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
$function$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;