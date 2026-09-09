-- Add a sort order to presskit_files so the band can decide the order the
-- documents appear in on /press.
-- Run in Supabase SQL editor. Safe to run multiple times.
--
-- Background: the press kit tab has been in admin since phase 4 but nothing on
-- the site read the table, so the files came out in upload order. Every other
-- list the band controls (gallery, videos, members) has a sort_order, and
-- AdminShared.module.css already styles .fileItem with `cursor: grab`.

ALTER TABLE presskit_files
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Give existing rows a stable order to start from: oldest first, matching how
-- they were listed before this column existed.
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 AS position
  FROM presskit_files
)
UPDATE presskit_files f
SET sort_order = o.position
FROM ordered o
WHERE f.id = o.id
  AND f.sort_order IS DISTINCT FROM o.position
  AND NOT EXISTS (
    -- Only backfill once; if any row already has a non-zero order the band has
    -- sorted them by hand and we must not overwrite that.
    SELECT 1 FROM presskit_files WHERE sort_order <> 0
  );
