# shine-on-you-website

## Plans

Planer for dette prosjektet lagres i `~/.claude/plans/` med frontmatter `<!-- project: shine-on-you-website -->`.

Statuser brukt i planfiler:
- `<!-- status: ikke-startet -->` / `## Status: IKKE STARTET`
- `<!-- status: done -->` / `## Status: FULLFØRT`

## Git workflow

- Alltid feature branch — aldri push direkte til `main`
- PR inn til `main` for alle endringer

## Supabase: nye tabeller trenger GRANT

Fra 2026-10-30 gir Supabase ikke lenger automatisk Data API-tilgang til nye tabeller i `public`. Hver migrering som lager en tabell må ha grantene i samme fil, ellers gir supabase-js «permission denied»:

```sql
alter table public.ny_tabell enable row level security;
grant select on public.ny_tabell to anon;  -- kun hvis innholdet skal vises offentlig
grant select, insert, update, delete on public.ny_tabell to authenticated, service_role;
```

RLS-policyer trengs fortsatt i tillegg. GRANT åpner tilgangen, og policyene avgjør hvilke rader som er synlige.
