// AuthContext er eneste vei inn til admin. Den var utestet, som betød at en
// bump av @supabase/supabase-js kunne bryte sesjonshåndteringen uten at noe
// annet enn manuell innlogging fanget det.
import { render, screen, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import { AuthProvider, useAuth } from '../AuthContext'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

import { supabase } from '../../lib/supabase'

const unsubscribe = vi.fn()
let authCallback

beforeEach(() => {
  vi.clearAllMocks()
  authCallback = null
  supabase.auth.onAuthStateChange.mockImplementation((cb) => {
    authCallback = cb
    return { data: { subscription: { unsubscribe } } }
  })
})

function Probe() {
  const { user, loading } = useAuth()
  if (loading) return <p>laster</p>
  return <p>{user ? `innlogget: ${user.email}` : 'utlogget'}</p>
}

const renderProbe = () => render(<AuthProvider><Probe /></AuthProvider>)

test('starter i loading og lander på utlogget når det ikke finnes sesjon', async () => {
  supabase.auth.getSession.mockResolvedValue({ data: { session: null } })

  renderProbe()

  expect(screen.getByText('laster')).toBeInTheDocument()
  await waitFor(() => {
    expect(screen.getByText('utlogget')).toBeInTheDocument()
  })
})

test('plukker opp brukeren fra en eksisterende sesjon', async () => {
  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { email: 'band@shineonyou.no' } } },
  })

  renderProbe()

  await waitFor(() => {
    expect(screen.getByText('innlogget: band@shineonyou.no')).toBeInTheDocument()
  })
})

test('onAuthStateChange oppdaterer brukeren ved innlogging og utlogging', async () => {
  supabase.auth.getSession.mockResolvedValue({ data: { session: null } })

  renderProbe()
  await waitFor(() => expect(screen.getByText('utlogget')).toBeInTheDocument())

  act(() => authCallback('SIGNED_IN', { user: { email: 'band@shineonyou.no' } }))
  expect(screen.getByText('innlogget: band@shineonyou.no')).toBeInTheDocument()

  act(() => authCallback('SIGNED_OUT', null))
  expect(screen.getByText('utlogget')).toBeInTheDocument()
})

test('abonnementet sies opp når provideren unmountes', async () => {
  supabase.auth.getSession.mockResolvedValue({ data: { session: null } })

  const { unmount } = renderProbe()
  await waitFor(() => expect(screen.getByText('utlogget')).toBeInTheDocument())

  unmount()

  expect(unsubscribe).toHaveBeenCalled()
})

test('signIn og signOut sender videre til supabase.auth', async () => {
  supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
  supabase.auth.signInWithPassword.mockResolvedValue({ error: null })
  supabase.auth.signOut.mockResolvedValue({ error: null })

  let auth
  function Grab() {
    auth = useAuth()
    return null
  }
  render(<AuthProvider><Grab /></AuthProvider>)
  await waitFor(() => expect(supabase.auth.getSession).toHaveBeenCalled())

  await act(async () => { await auth.signIn('band@shineonyou.no', 'hemmelig') })
  expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
    email: 'band@shineonyou.no',
    password: 'hemmelig',
  })

  await act(async () => { await auth.signOut() })
  expect(supabase.auth.signOut).toHaveBeenCalled()
})
