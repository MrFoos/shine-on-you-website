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

test('viser events normalt ved vellykket fetch', async () => {
  const today = new Date()
  const future = new Date(today)
  future.setDate(today.getDate() + 10)
  const futureDate = future.toISOString().split('T')[0]

  mockSupabase({
    eventsResult: {
      data: [{ id: 1, date: futureDate, venue: 'Rockefeller', city: 'Oslo', country: 'NO', ticket_status: 'available', ticket_url: '#' }],
      error: null,
    },
    settingsResult: { data: { tour_heading: 'Tour 2026', past_shows_heading: 'Past shows' } },
  })

  render(<Events />)

  await waitFor(() => {
    expect(screen.getByText('Rockefeller, Oslo NO')).toBeInTheDocument()
  })
})
