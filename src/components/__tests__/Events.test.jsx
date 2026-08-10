import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Events from '../Events'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from '../../lib/supabase'

function mockSupabase({ eventsResult, settingsResult }) {
  supabase.from.mockImplementation((table) => {
    if (table === 'events') {
      return {
        select: () => ({
          order: () => Promise.resolve(eventsResult),
        }),
      }
    }
    if (table === 'settings') {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve(settingsResult),
          }),
        }),
      }
    }
  })
}

test('viser feilmelding når Supabase returnerer feil', async () => {
  mockSupabase({
    eventsResult: { data: null, error: { message: 'Network error' } },
    settingsResult: { data: null },
  })

  render(<Events />)

  await waitFor(() => {
    expect(screen.getByText('Could not load shows. Please try again later.')).toBeInTheDocument()
  })
})

function futureDateString() {
  const future = new Date()
  future.setDate(future.getDate() + 10)
  return future.toISOString().split('T')[0]
}

test('viser events normalt ved vellykket fetch', async () => {
  const futureDate = futureDateString()

  mockSupabase({
    eventsResult: {
      data: [{ id: 1, date: futureDate, venue: 'Rockefeller', city: 'Oslo', country: 'NO', ticket_status: 'available', ticket_url: '#' }],
      error: null,
    },
    settingsResult: { data: { tour_heading: 'Tour 2026', past_shows_heading: 'Past shows' } },
  })

  render(<Events />)

  await waitFor(() => {
    expect(screen.getByText('Rockefeller')).toBeInTheDocument()
    expect(screen.getByText('Oslo, NO')).toBeInTheDocument()
  })
})

test('utsatt konsert viser POSTPONED og notat, uten billettlenke', async () => {
  mockSupabase({
    eventsResult: {
      data: [{
        id: 1,
        date: futureDateString(),
        venue: 'Lokomotivet',
        city: 'Eskilstuna',
        country: 'Sweden',
        ticket_status: 'postponed',
        ticket_url: 'https://ticketmaster.se/stale-listing',
        note: 'New date to be announced',
      }],
      error: null,
    },
    settingsResult: { data: { tour_heading: 'Tour 2026', past_shows_heading: 'Past shows' } },
  })

  render(<Events />)

  await waitFor(() => {
    expect(screen.getByText('POSTPONED')).toBeInTheDocument()
  })
  expect(screen.getByText('New date to be announced')).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'TICKETS' })).not.toBeInTheDocument()
})

test('notatlinjen skjules når note er tom', async () => {
  mockSupabase({
    eventsResult: {
      data: [{
        id: 1,
        date: futureDateString(),
        venue: 'Rockefeller',
        city: 'Oslo',
        country: 'Norway',
        ticket_status: 'available',
        ticket_url: '#',
        note: '',
      }],
      error: null,
    },
    settingsResult: { data: { tour_heading: 'Tour 2026', past_shows_heading: 'Past shows' } },
  })

  const { container } = render(<Events />)

  await waitFor(() => {
    expect(screen.getByText('Rockefeller')).toBeInTheDocument()
  })
  expect(container.querySelector('p')).toBeNull()
})
