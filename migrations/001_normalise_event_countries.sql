-- Normalise country values in the events table to canonical English names.
-- Run once in Supabase SQL editor or via psql.
-- List rows affected before committing:
--   SELECT id, date, venue, city, country FROM events
--   WHERE country NOT IN ('Norway','Sweden','Denmark','Finland','Iceland',
--                         'Germany','Netherlands','United Kingdom','Other');

UPDATE events SET country = 'Norway'
WHERE lower(trim(country)) IN ('norge', 'norway', 'no');

UPDATE events SET country = 'Sweden'
WHERE lower(trim(country)) IN ('sverige', 'sweden', 'se');

UPDATE events SET country = 'Denmark'
WHERE lower(trim(country)) IN ('danmark', 'denmark', 'dk');

UPDATE events SET country = 'Finland'
WHERE lower(trim(country)) IN ('finland', 'fi', 'suomi');

UPDATE events SET country = 'Germany'
WHERE lower(trim(country)) IN ('germany', 'deutschland', 'de');

UPDATE events SET country = 'Netherlands'
WHERE lower(trim(country)) IN ('netherlands', 'nederland', 'nl', 'the netherlands');

UPDATE events SET country = 'United Kingdom'
WHERE lower(trim(country)) IN ('united kingdom', 'uk', 'gb', 'great britain', 'england');
