-- Add a 'postponed' ticket status and a free-text note line for events.
-- Run in Supabase SQL editor. Safe to run multiple times.
--
-- Background: when a show is moved but the ticket vendor has not caught up yet,
-- we drop the ticket link, mark the event 'postponed' and use `note` to explain
-- (e.g. "New date to be announced"). The old date stays on the event until the
-- new one is confirmed, so the note is what tells visitors the date will change.

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS note TEXT DEFAULT '';

-- ticket_status may or may not have a CHECK constraint depending on how the
-- table was created. Drop any existing one and recreate it with the new value.
DO $$
DECLARE
  conname_var TEXT;
BEGIN
  FOR conname_var IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'events'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%ticket_status%'
  LOOP
    EXECUTE format('ALTER TABLE events DROP CONSTRAINT %I', conname_var);
  END LOOP;

  ALTER TABLE events
    ADD CONSTRAINT events_ticket_status_check
    CHECK (ticket_status IN ('available', 'coming_soon', 'sold_out', 'postponed'));
END $$;
