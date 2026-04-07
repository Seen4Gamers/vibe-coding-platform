-- Create page_views table to track all website visitors
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);

-- Enable RLS but allow public inserts for tracking (no user required)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert page views (for anonymous visitor tracking)
CREATE POLICY "Allow public inserts" ON public.page_views
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users (admins) to view all page views
CREATE POLICY "Allow authenticated users to view" ON public.page_views
  FOR SELECT
  USING (true);
