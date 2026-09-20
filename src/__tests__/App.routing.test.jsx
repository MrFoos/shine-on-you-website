// Ingen test rendret App før denne. Rutingen og admin-sperra var altså bare
// dekket av manuell klikking, og det er nettopp dette laget react,
// react-dom og react-router-dom-bumper treffer.
import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { vi } from 'vitest'
import App from '../App'

vi.mock('../lib/supabase', () => {
  // Alle sidene App ruter til henter data ved mount. Vi bryr oss ikke om hva
  // de får — bare at ingen av dem kaster mens vi sjekker at riktig side kom
  // opp — så enhver kjede av builder-kall svarer med et tomt resultat.
  const builder = new Proxy({}, {
    get(_target, prop) {
      if (prop === 'then') return (resolve) => resolve({ data: [], error: null })
      return () => builder
    },
  })

  return {
    supabase: {
      from: () => builder,
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          remove: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: 'https://example.test/fil.jpg' } }),
        }),
      },
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(() => ({
          data: { subscription: { unsubscribe: vi.fn() } },
        })),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
      },
    },
  }
})

import { supabase } from '../lib/supabase'

// Ingen sesjon med mindre testen sier noe annet.
beforeEach(() => {
  supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
})

function visit(path) {
  window.history.pushState({}, '', path)
  return render(<HelmetProvider><App /></HelmetProvider>)
}

test('/ viser forsiden', async () => {
  visit('/')

  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 1, name: 'Shine On You' })).toBeInTheDocument()
  })
})

test('/press viser pressesiden', async () => {
  visit('/press')

  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 1, name: 'Press' })).toBeInTheDocument()
  })
})

test('/about viser om-siden', async () => {
  visit('/about')

  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
  })
})

test('/admin sender utloggede til innloggingssiden', async () => {
  visit('/admin')

  await waitFor(() => {
    expect(screen.getByLabelText('E-post')).toBeInTheDocument()
  })
  // Navigate med replace: adressen skal faktisk ha endret seg, ikke bare
  // innholdet, ellers ligger /admin igjen i historikken.
  expect(window.location.pathname).toBe('/admin/login')
})

test('/admin viser dashbordet når noen er innlogget', async () => {
  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { email: 'band@shineonyou.no' } } },
  })

  visit('/admin')

  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 1, name: 'Shine On You — Admin' })).toBeInTheDocument()
  })
  expect(screen.getByRole('tab', { name: 'Events' })).toBeInTheDocument()
  expect(window.location.pathname).toBe('/admin')
})

test('/admin viser ikke innloggingsskjemaet mens sesjonen sjekkes', async () => {
  // Den stygge varianten: en innlogget admin blinker innom innloggingssiden
  // fordi ProtectedRoute konkluderer før getSession har svart.
  let releaseSession
  supabase.auth.getSession.mockReturnValue(
    new Promise((resolve) => { releaseSession = resolve }),
  )

  visit('/admin')

  expect(screen.queryByLabelText('E-post')).not.toBeInTheDocument()

  releaseSession({ data: { session: { user: { email: 'band@shineonyou.no' } } } })

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: 'Events' })).toBeInTheDocument()
  })
  expect(screen.queryByLabelText('E-post')).not.toBeInTheDocument()
})
