-- Ensure daily_offers has title column
ALTER TABLE public.daily_offers ADD COLUMN IF NOT EXISTS title TEXT;

-- Update title from name if needed
UPDATE public.daily_offers SET title = name WHERE title IS NULL AND name IS NOT NULL;

-- Add RLS policies for categories (update if not exist)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_categories" ON public.categories;
CREATE POLICY "service_role_all_categories" ON public.categories 
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for category_timers
ALTER TABLE public.category_timers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_category_timers" ON public.category_timers;
CREATE POLICY "service_role_all_category_timers" ON public.category_timers 
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for daily_offers (admin write access)
DROP POLICY IF EXISTS "service_role_all_offers" ON public.daily_offers;
CREATE POLICY "service_role_all_offers" ON public.daily_offers 
  FOR ALL USING (true) WITH CHECK (true);

-- Initialize timers for existing categories if they don't have one
INSERT INTO public.category_timers (category_id, timer_end_time)
SELECT c.id, NOW() + INTERVAL '24 hours'
FROM public.categories c
LEFT JOIN public.category_timers ct ON ct.category_id = c.id
WHERE ct.id IS NULL
ON CONFLICT (category_id) DO NOTHING;
