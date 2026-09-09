import { sortPressKitFiles } from '../presskit'

test('sorterer på sort_order', () => {
  const rows = [
    { label: 'B', sort_order: 1, created_at: '2026-01-01' },
    { label: 'A', sort_order: 0, created_at: '2026-01-02' },
  ]
  expect(sortPressKitFiles(rows).map((r) => r.label)).toEqual(['A', 'B'])
})

// Migreringen som legger til sort_order kjøres for hånd i Supabase. Fram til den
// er kjørt mangler feltet, og da skal listen falle tilbake på opplastingsrekkefølge.
test('faller tilbake på created_at når sort_order mangler', () => {
  const rows = [
    { label: 'Nyest', created_at: '2026-03-01' },
    { label: 'Eldst', created_at: '2026-01-01' },
  ]
  expect(sortPressKitFiles(rows).map((r) => r.label)).toEqual(['Eldst', 'Nyest'])
})

test('tåler at spørringen ikke ga noe', () => {
  expect(sortPressKitFiles(null)).toEqual([])
})
