/**
 * Sorterer radene fra `presskit_files`.
 *
 * Sorteringen skjer i JS, ikke som `.order('sort_order')` i spørringen, fordi
 * kolonnen kommer fra migrations/006 og postgrest svarer med feil — ikke tom
 * liste — hvis den mangler. Kjøres migreringen etter en deploy, vil filene i
 * mellomtiden komme i opplastingsrekkefølge i stedet for at siden brekker.
 */
export function sortPressKitFiles(rows) {
  return [...(rows ?? [])].sort(
    (a, b) =>
      (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
      String(a.created_at).localeCompare(String(b.created_at))
  )
}
