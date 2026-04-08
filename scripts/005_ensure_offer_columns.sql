-- Simple migration to ensure daily_offers has title column if not exists
-- This won't fail if the column already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='daily_offers' AND column_name='title'
    ) THEN
        ALTER TABLE public.daily_offers ADD COLUMN title TEXT;
    END IF;
END $$;

-- Ensure category_id column exists in daily_offers
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='daily_offers' AND column_name='category_id'
    ) THEN
        ALTER TABLE public.daily_offers ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Copy name to title if title is empty
UPDATE public.daily_offers 
SET title = name 
WHERE title IS NULL AND name IS NOT NULL;
