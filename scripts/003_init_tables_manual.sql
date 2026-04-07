-- Create page_views table for analytics tracking
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_offers table for storing products
CREATE TABLE IF NOT EXISTS public.daily_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offer_settings table for timer configuration
CREATE TABLE IF NOT EXISTS public.offer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timer_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
CREATE INDEX IF NOT EXISTS idx_daily_offers_created_at ON public.daily_offers(created_at);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to read and insert page views
CREATE POLICY "Allow anyone to insert page views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to read page views" ON public.page_views FOR SELECT USING (true);

-- Create policies for offers (read-only for public)
CREATE POLICY "Allow anyone to read offers" ON public.daily_offers FOR SELECT USING (true);

-- Create policies for settings (read-only for public)
CREATE POLICY "Allow anyone to read settings" ON public.offer_settings FOR SELECT USING (true);
