-- Phase 2: Add hero/homepage settings columns to the settings table.
-- Run in Supabase SQL editor. Safe to run multiple times (IF NOT EXISTS).
-- After running, the existing row gets all defaults populated immediately.

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS hero_eyebrow           TEXT    DEFAULT 'Pink Floyd Tribute · Est. 2017',
  ADD COLUMN IF NOT EXISTS hero_tagline           TEXT    DEFAULT 'A powerful tribute to one of the greatest bands in music history.',
  ADD COLUMN IF NOT EXISTS hero_background_image  TEXT,
  ADD COLUMN IF NOT EXISTS hero_overlay_opacity   NUMERIC DEFAULT 0.65,
  ADD COLUMN IF NOT EXISTS hero_cta_primary_label TEXT    DEFAULT 'All concerts →',
  ADD COLUMN IF NOT EXISTS hero_cta_primary_href  TEXT    DEFAULT '/tour',
  ADD COLUMN IF NOT EXISTS hero_cta_secondary_label TEXT  DEFAULT 'Book us',
  ADD COLUMN IF NOT EXISTS hero_cta_secondary_href  TEXT  DEFAULT 'mailto:shineonyouband@gmail.com?subject=Booking%20inquiry',
  ADD COLUMN IF NOT EXISTS next_show_kicker         TEXT  DEFAULT 'Next Show',
  ADD COLUMN IF NOT EXISTS between_tours_eyebrow    TEXT  DEFAULT 'BETWEEN TOURS',
  ADD COLUMN IF NOT EXISTS between_tours_heading    TEXT  DEFAULT 'No shows currently scheduled.',
  ADD COLUMN IF NOT EXISTS between_tours_body       TEXT  DEFAULT 'We''re off the road right now. Follow us on Instagram for tour news as soon as new dates are announced.',
  ADD COLUMN IF NOT EXISTS social_kicker            TEXT  DEFAULT 'FOLLOW US';

-- Note: a 'hero' bucket must exist in Supabase Storage (public) for the
-- hero background image upload to work from the admin Forsiden tab.
