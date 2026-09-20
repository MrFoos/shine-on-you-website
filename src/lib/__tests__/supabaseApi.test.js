// Kontrakttest mot ekte @supabase/supabase-js — ingen mock.
//
// De andre testene mocker bort supabase-klienten, og det er riktig for dem:
// de skal teste komponentene våre, ikke biblioteket. Men det betyr at en
// dependabot-bump som fjerner eller døper om et kall vi er avhengige av,
// glir rett gjennom hele suiten. Denne testen bygger de nøyaktige kjedene
// appen bruker, og feiler hvis en av dem forsvinner.
//
// Ingen nettverkstrafikk: vi bygger spørringene uten å await-e dem, og rører
// aldri auth-kall som faktisk ville ringt ut.
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://example.supabase.co', 'anon-key-for-test')

test('auth-kallene AuthContext og AdminLogin er avhengige av finnes', () => {
  for (const method of ['getSession', 'onAuthStateChange', 'signInWithPassword', 'signOut']) {
    expect(typeof supabase.auth[method]).toBe('function')
  }
})

test('onAuthStateChange gir tilbake et abonnement med unsubscribe', () => {
  // AuthContext destrukturerer nøyaktig denne formen i cleanup-funksjonen sin.
  // Endrer den seg, lekker vi et abonnement per mount.
  const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {})

  expect(typeof subscription.unsubscribe).toBe('function')
  subscription.unsubscribe()
})

test('spørrekjeden Home bruker for neste konsert kan bygges', () => {
  const query = supabase
    .from('events')
    .select('*')
    .gte('date', '2026-09-20')
    .eq('is_history', false)
    .order('date', { ascending: true })
    .limit(1)

  expect(typeof query.single).toBe('function')
})

test('spørrekjeden for innstillinger kan bygges', () => {
  const query = supabase.from('settings').select('*').eq('id', 1)

  expect(typeof query.single).toBe('function')
})

test('skrivekallene admin bruker finnes på query-builderen', () => {
  const table = supabase.from('events')

  for (const method of ['insert', 'update', 'delete', 'upsert']) {
    expect(typeof table[method]).toBe('function')
  }
})

test('storage-kallene opplasting og sletting er avhengige av finnes', () => {
  const bucket = supabase.storage.from('gallery')

  for (const method of ['upload', 'remove', 'getPublicUrl']) {
    expect(typeof bucket[method]).toBe('function')
  }
})

test('getPublicUrl returnerer fortsatt { data: { publicUrl } }', () => {
  // Galleri, bandmedlemmer og press kit leser alle .data.publicUrl direkte.
  // Dette er et rent lokalt strengbygg i biblioteket, så det går ikke på nett.
  const { data } = supabase.storage.from('gallery').getPublicUrl('bilde.jpg')

  expect(data.publicUrl).toContain('/storage/v1/object/public/gallery/bilde.jpg')
})
