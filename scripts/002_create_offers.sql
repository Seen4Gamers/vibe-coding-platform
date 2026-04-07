-- Table: page_views (from previous migration, created if not exists)
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: daily_offers — products shown in the "Today's Offer" section
CREATE TABLE IF NOT EXISTS daily_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  original_price NUMERIC(10, 2),
  image_url TEXT,
  badge TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: offer_settings — controls the countdown timer end time
CREATE TABLE IF NOT EXISTS offer_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  timer_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row (one row only)
INSERT INTO offer_settings (id, timer_ends_at)
VALUES (1, NOW() + INTERVAL '24 hours')
ON CONFLICT (id) DO NOTHING;

-- RLS: Allow public read access to active offers and settings
ALTER TABLE daily_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_settings ENABLE ROW LEVEL SECURITY;

-- Public can read active offers
CREATE POLICY "public_read_active_offers" ON daily_offers
  FOR SELECT USING (active = true);

-- Admin service role can do everything on daily_offers
CREATE POLICY "service_role_all_offers" ON daily_offers
  FOR ALL USING (true) WITH CHECK (true);

-- Public can read offer settings
CREATE POLICY "public_read_offer_settings" ON offer_settings
  FOR SELECT USING (true);

-- Admin service role can update offer settings
CREATE POLICY "service_role_all_offer_settings" ON offer_settings
  FOR ALL USING (true) WITH CHECK (true);
