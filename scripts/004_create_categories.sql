-- Table: categories — organize offers into categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: category_timers — track timer for each category
CREATE TABLE IF NOT EXISTS public.category_timers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL UNIQUE REFERENCES public.categories(id) ON DELETE CASCADE,
  timer_end_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update daily_offers to include category_id
ALTER TABLE public.daily_offers 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_category_timers_category_id ON public.category_timers(category_id);
CREATE INDEX IF NOT EXISTS idx_daily_offers_category_id ON public.daily_offers(category_id);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_timers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY IF NOT EXISTS "Allow anyone to read active categories" ON public.categories 
  FOR SELECT USING (active = true);

-- RLS Policies for category_timers
CREATE POLICY IF NOT EXISTS "Allow anyone to read category timers" ON public.category_timers 
  FOR SELECT USING (true);

-- Insert sample categories
INSERT INTO public.categories (name, description, display_order) 
VALUES 
  ('Electronics', 'Latest gadgets and tech products', 1),
  ('Fashion', 'Trendy clothing and accessories', 2),
  ('Home & Garden', 'Home improvement and garden items', 3)
ON CONFLICT (name) DO NOTHING;
