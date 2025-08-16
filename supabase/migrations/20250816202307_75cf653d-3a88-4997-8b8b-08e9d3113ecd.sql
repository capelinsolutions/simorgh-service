-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

-- Create storage policies for service images
CREATE POLICY "Service images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload service images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'service-images' 
  AND auth.uid() IN (SELECT user_id FROM public.admin_users)
);

CREATE POLICY "Admins can update service images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'service-images' 
  AND auth.uid() IN (SELECT user_id FROM public.admin_users)
);

CREATE POLICY "Admins can delete service images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'service-images' 
  AND auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Add image_url column to service_addons table if it doesn't exist
ALTER TABLE public.service_addons 
ADD COLUMN IF NOT EXISTS image_url TEXT;