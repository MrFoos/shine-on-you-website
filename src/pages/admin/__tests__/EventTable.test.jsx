import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import EventTable from '../EventTable'

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from '../../../lib/supabase'

function buildChain(result) {
  return {
    select: () => ({ order: () => Promise.resolve(result) }),
    insert: () => Promise.resolve(result),
    update: () => ({ eq: () => Promise.resolve(result) }),
    delete: () => ({ eq: () => Promise.resolve(result) }),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

test('viser feilmelding når fetch feiler', async () => {
  supabase.from.mockReturnValue(buildChain({ data: null, error: { message: 'DB error' } }))

  render(<EventTable />)

  await waitFor(() => {
    expect(screen.getByText('Klarte ikke hente arrangementer.')).toBeInTheDocument()
  })
})

test('viser feilmelding ved mislykket sletting', async () => {
  supabase.from.mockImplementation(() => ({
    select: () => ({
      order: () => Promise.resolve({ data: [{ id: 1, date: '2026-12-01', venue: 'Oslo Spektrum', city: 'Oslo', country: 'NO', ticket_status: 'available' }], error: null }),
    }),
    delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Delete failed' } }) }),
  }))

  render(<EventTable />)

  await waitFor(() => {
    expect(screen.getByText('Oslo Spektrum')).toBeInTheDocument()
  })

  fireEvent.click(screen.getByText('Slett'))

  await waitFor(() => {
    expect(screen.getByText('Sletting feilet. Prøv igjen.')).toBeInTheDocument()
  })
})

test('viser feilmelding ved mislykket lagring (insert)', async () => {
  supabase.from.mockImplementation(() => ({
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    insert: () => Promise.resolve({ error: { message: 'Insert failed' } }),
  }))

  render(<EventTable />)

  await waitFor(() => {
    expect(screen.getByText('+ Nytt arrangement')).toBeInTheDocument()
  })

  fireEvent.click(screen.getByText('+ Nytt arrangement'))

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /lagre/i })).toBeInTheDocument()
  })

  const lagre = screen.getByRole('button', { name: /lagre/i })
  fireEvent.submit(lagre.closest('form'))

  await waitFor(() => {
    expect(screen.getByText('Lagring feilet. Prøv igjen.')).toBeInTheDocument()
  })
})
