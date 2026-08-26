import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_SUPABASE_KEY = 'gachapon_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_SUPABASE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) return parsed;
    }
  } catch {
    // fallback
  }

  // Default user Supabase Cloud project credentials
  const defaultUrl = 'https://iegtazzxupzhnlbyltbv.supabase.co';
  const defaultKey = 'sb_publishable_Ew2qgJQB3iuyMjr-G6Ot9Q_D_-kxAeV';

  return {
    url: (import.meta.env.VITE_SUPABASE_URL as string) || defaultUrl,
    anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || defaultKey,
  };
}

export function saveStoredSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(STORAGE_SUPABASE_KEY, JSON.stringify(config));
  // Re-initialize client singleton
  supabaseClientInstance = initSupabaseClient(config);
}

function initSupabaseClient(config: SupabaseConfig): SupabaseClient | null {
  if (!config.url || !config.anonKey) return null;
  try {
    return createClient(config.url, config.anonKey);
  } catch {
    return null;
  }
}

let supabaseClientInstance = initSupabaseClient(getStoredSupabaseConfig());

export function getSupabase(): SupabaseClient | null {
  if (!supabaseClientInstance) {
    const cfg = getStoredSupabaseConfig();
    supabaseClientInstance = initSupabaseClient(cfg);
  }
  return supabaseClientInstance;
}

export const SUPABASE_SQL_SCHEMA = `-- COPY AND RUN THIS IN YOUR SUPABASE SQL EDITOR TO CREATE ALL TABLES:

-- 1. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'message',
  text TEXT NOT NULL,
  color TEXT DEFAULT '#FFB3C6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Songs Table
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'song',
  title TEXT NOT NULL,
  artist TEXT DEFAULT 'Spotify',
  album TEXT DEFAULT 'Spotify',
  cover_color TEXT DEFAULT '#E8D5FF',
  cover_emoji TEXT DEFAULT '🎵',
  duration INT DEFAULT 180,
  spotify_url TEXT,
  spotify_track_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'coupon',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT DEFAULT '🎟️',
  color TEXT DEFAULT '#E84B7E',
  bg_color TEXT DEFAULT '#FFD6E0',
  valid_text TEXT DEFAULT 'Berlaku kapan saja',
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cats Table
CREATE TABLE IF NOT EXISTS cats (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'cat',
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  tag TEXT DEFAULT 'Cute Cat',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Random Images Table
CREATE TABLE IF NOT EXISTS random_images (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'random_image',
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  tag TEXT DEFAULT 'Aesthetic',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Read/Write Access
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE random_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON messages;
DROP POLICY IF EXISTS "Public Write Access" ON messages;
CREATE POLICY "Public Read Access" ON messages FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON messages FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON songs;
DROP POLICY IF EXISTS "Public Write Access" ON songs;
CREATE POLICY "Public Read Access" ON songs FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON songs FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON coupons;
DROP POLICY IF EXISTS "Public Write Access" ON coupons;
CREATE POLICY "Public Read Access" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON coupons FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON cats;
DROP POLICY IF EXISTS "Public Write Access" ON cats;
CREATE POLICY "Public Read Access" ON cats FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON cats FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON random_images;
DROP POLICY IF EXISTS "Public Write Access" ON random_images;
CREATE POLICY "Public Read Access" ON random_images FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON random_images FOR ALL USING (true);
`;
