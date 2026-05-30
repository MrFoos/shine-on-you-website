ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS hero_background_credit TEXT DEFAULT '';
