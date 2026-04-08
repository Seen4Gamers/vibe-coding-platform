-- Ensure daily_offers has all needed columns including title
ALTER TABLE public.daily_offers ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.daily_offers ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Update daily_offers to use title instead of name if name exists
UPDATE public.daily_offers SET title = name WHERE title IS NULL AND name IS NOT NULL;

-- Create index for category_id on daily_offers if not exists
CREATE INDEX IF NOT EXISTS idx_daily_offers_category_id ON public.daily_offers(category_id);

-- Drop existing RLS policies on categories and category_timers and recreate with service role access
DROP POLICY IF EXISTS "Allow anyone to read active categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to read category timers" ON public.category_timers;

-- Public read policies
CREATE POLICY "public_read_active_categories" ON public.categories 
  FOR SELECT USING (active = true);

CREATE POLICY "public_read_category_timers" ON public.category_timers 
  FOR SELECT USING (true);

-- Service role all access policies for categories
CREATE POLICY "service_role_all_categories" ON public.categories 
  FOR ALL USING (true) WITH CHECK (true);

-- Service role all access policies for category_timers
CREATE POLICY "service_role_all_category_timers" ON public.category_timers 
  FOR ALL USING (true) WITH CHECK (true);

-- Initialize timers for existing categories that don't have one
INSERT INTO public.category_timers (category_id, timer_end_time)
SELECT c.id, NOW() + INTERVAL '24 hours'
FROM public.categories c
LEFT JOIN public.category_timers ct ON ct.category_id = c.id
WHERE ct.id IS NULL;
