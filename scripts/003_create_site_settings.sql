-- Create site_settings table for customizable site content
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default PS5 name
INSERT INTO site_settings (setting_key, setting_value)
VALUES ('primary_ps5_name', 'PlayStation 5')
ON CONFLICT (setting_key) DO NOTHING;

-- Create or replace the offer_settings table to include auto-reset functionality
CREATE TABLE IF NOT EXISTS offer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timer_end_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  timer_duration_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings if not exists
INSERT INTO offer_settings (timer_end_time, timer_duration_hours)
SELECT NOW() + INTERVAL '24 hours', 24
WHERE NOT EXISTS (SELECT 1 FROM offer_settings LIMIT 1);

-- Create daily_offers table if not exists
CREATE TABLE IF NOT EXISTS daily_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
