-- Add additional columns to freelancers table for enhanced cleaner profile
ALTER TABLE public.freelancers 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- Create cleaner notifications table for job-specific notifications
CREATE TABLE IF NOT EXISTS public.cleaner_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cleaner_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'job_assignment',
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cleaner earnings tracking table
CREATE TABLE IF NOT EXISTS public.cleaner_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cleaner_id UUID NOT NULL,
  order_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  stripe_transfer_id TEXT,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.cleaner_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_earnings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cleaner_notifications
CREATE POLICY "Cleaners can view their own notifications" 
ON public.cleaner_notifications 
FOR SELECT 
USING (cleaner_id = auth.uid());

CREATE POLICY "System can insert cleaner notifications" 
ON public.cleaner_notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Cleaners can update own notifications" 
ON public.cleaner_notifications 
FOR UPDATE 
USING (cleaner_id = auth.uid());

-- Create RLS policies for cleaner_earnings  
CREATE POLICY "Cleaners can view their own earnings" 
ON public.cleaner_earnings 
FOR SELECT 
USING (cleaner_id = auth.uid());

CREATE POLICY "System can manage earnings" 
ON public.cleaner_earnings 
FOR ALL 
USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_cleaner_notifications_cleaner_id ON public.cleaner_notifications(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_cleaner_notifications_created_at ON public.cleaner_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cleaner_earnings_cleaner_id ON public.cleaner_earnings(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_cleaner_earnings_order_id ON public.cleaner_earnings(order_id);

-- Update freelancers table RLS to include new functionality
DROP POLICY IF EXISTS "Freelancers can view their own profile" ON public.freelancers;
CREATE POLICY "Freelancers can view their own profile" 
ON public.freelancers 
FOR SELECT 
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Freelancers can update their own profile" ON public.freelancers;
CREATE POLICY "Freelancers can update their own profile" 
ON public.freelancers 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create storage bucket for cleaner documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cleaner-documents', 'cleaner-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for cleaner documents
CREATE POLICY "Cleaners can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cleaner-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Cleaners can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cleaner-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all cleaner documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cleaner-documents' AND EXISTS (
  SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
));