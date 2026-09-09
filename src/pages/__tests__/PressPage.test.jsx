import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { existsSync } from 'node:fs'
import PressPage from '../PressPage'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <PressPage />
      </MemoryRouter>
    </HelmetProvider>
  )
}

test('alle nedlastingslenker peker på filer som finnes i public/', () => {
  renderPage()

  const hrefs = screen
    .getAllByRole('link')
    .map((a) => a.getAttribute('href'))
    .filter((href) => href?.startsWith('/press/'))

  expect(hrefs.length).toBeGreaterThan(0)

  for (const href of hrefs) {
    expect(existsSync(`public${href}`), `mangler fil: public${href}`).toBe(true)
  }
})

test('logofilene tilbys som ZIP, PNG og vektor-PDF', () => {
  renderPage()

  const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))

  expect(hrefs).toContain('/press/logo/shine-on-you-logo.zip')
  expect(hrefs.filter((h) => h?.endsWith('.pdf'))).toHaveLength(2)
  expect(hrefs.filter((h) => h?.startsWith('/press/') && h.endsWith('.png'))).toHaveLength(4)
})
