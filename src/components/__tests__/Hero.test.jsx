// Hero er det første en besøkende ser, og kortet til høyre har tre tilstander
// som bare skiller seg i hvilken komponent React velger. Ingen av dem var
// dekket — de er lette å bryte og trivielle å overse.
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '../Hero'

const renderHero = (props) =>
  render(<MemoryRouter><Hero {...props} /></MemoryRouter>)

const NEXT_EVENT = {
  date: '2026-11-14',
  venue: 'Rockefeller',
  city: 'Oslo',
  country: 'Norway',
  ticket_status: 'available',
  ticket_url: 'https://billetter.example/oslo',
}

test('viser skjelettkortet mens data lastes, ikke «ingen konserter»', () => {
  renderHero({ loading: true })

  expect(screen.queryByText('No shows currently scheduled.')).not.toBeInTheDocument()
  expect(screen.queryByText('Next Show')).not.toBeInTheDocument()
})

test('viser neste konsert når det finnes en', () => {
  renderHero({ nextEvent: NEXT_EVENT })

  expect(screen.getByText('Next Show')).toBeInTheDocument()
  expect(screen.getByText('14')).toBeInTheDocument()
  expect(screen.getByText('NOV')).toBeInTheDocument()
  expect(screen.getByText('2026')).toBeInTheDocument()
  expect(screen.getByText('Rockefeller')).toBeInTheDocument()
  expect(screen.getByText('Oslo, Norway')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Tickets →' })).toHaveAttribute('href', NEXT_EVENT.ticket_url)
})

test('billettlenka skjules når konserten ikke er i salg', () => {
  renderHero({ nextEvent: { ...NEXT_EVENT, ticket_status: 'sold_out' } })

  expect(screen.getByText('Rockefeller')).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Tickets →' })).not.toBeInTheDocument()
})

test('faller tilbake på «between tours» når det ikke er flere konserter', () => {
  renderHero({ nextEvent: null, instagramUrl: 'https://instagram.com/shineonyou' })

  expect(screen.getByText('No shows currently scheduled.')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Past shows →' })).toHaveAttribute('href', '/tour')
})

test('tekst fra admin overstyrer standardtekstene', () => {
  renderHero({
    settings: {
      hero_eyebrow: 'Pink Floyd Tribute · Est. 2017',
      hero_tagline: 'Egen tagline fra admin',
      hero_cta_primary_label: 'Se konserter →',
      hero_cta_primary_href: '/tour',
      next_show_kicker: 'NESTE KONSERT',
    },
    nextEvent: NEXT_EVENT,
  })

  expect(screen.getByText('Egen tagline fra admin')).toBeInTheDocument()
  expect(screen.getByText('NESTE KONSERT')).toBeInTheDocument()
  // Interne CTA-er skal bli router-Link, ikke full sidelast.
  expect(screen.getByRole('link', { name: 'Se konserter →' })).toHaveAttribute('href', '/tour')
})

test('kortet kan skrus helt av fra admin', () => {
  renderHero({ settings: { hero_card_visible: false }, nextEvent: NEXT_EVENT })

  expect(screen.queryByText('Next Show')).not.toBeInTheDocument()
  expect(screen.queryByText('No shows currently scheduled.')).not.toBeInTheDocument()
})

test('sosiale ikoner vises bare for lenkene som er satt', () => {
  renderHero({
    nextEvent: NEXT_EVENT,
    facebookUrl: 'https://facebook.com/shineonyou',
    youtubeUrl: 'https://youtube.com/@shineonyou',
  })

  expect(screen.getByRole('link', { name: 'Facebook' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'YouTube' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Instagram' })).not.toBeInTheDocument()
})
