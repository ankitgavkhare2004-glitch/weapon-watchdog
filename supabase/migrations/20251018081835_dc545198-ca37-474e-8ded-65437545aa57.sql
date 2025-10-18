-- Create storage bucket for weapon detection models
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'weapon-models',
  'weapon-models',
  true,
  52428800, -- 50MB limit
  ARRAY['application/octet-stream']
);

-- Create policy to allow public read access
CREATE POLICY "Public can view models"
ON storage.objects FOR SELECT
USING (bucket_id = 'weapon-models');

-- Create policy to allow authenticated users to upload models
CREATE POLICY "Authenticated users can upload models"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'weapon-models' 
  AND auth.role() = 'authenticated'
);

-- Create detections table to store weapon detection results
CREATE TABLE public.weapon_detections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  weapon_type TEXT NOT NULL,
  confidence DECIMAL(5,4) NOT NULL,
  image_data TEXT NOT NULL,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bbox JSONB
);

-- Enable RLS
ALTER TABLE public.weapon_detections ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert detections (for demo purposes)
CREATE POLICY "Anyone can insert detections"
ON public.weapon_detections FOR INSERT
WITH CHECK (true);

-- Allow anyone to view detections
CREATE POLICY "Anyone can view detections"
ON public.weapon_detections FOR SELECT
USING (true);