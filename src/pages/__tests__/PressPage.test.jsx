import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { existsSync, readFileSync } from 'node:fs'
import { crc32 } from 'node:zlib'
import PressPage, { LOGOS, ZIP_FILE } from '../PressPage'
import { ZIP_NAME, collectFiles, createZip, readZipEntries } from '../../../scripts/build-press-zip.js'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <PressPage />
      </MemoryRouter>
    </HelmetProvider>
  )
}

/** Leser bredde og høyde fra IHDR-blokka i en PNG. */
function pngSize(path) {
  const buf = readFileSync(path)
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

const linkedFiles = LOGOS.flatMap((logo) => logo.files.map((f) => f.file))

test('alle nedlastingslenker peker på filer som finnes i public/', () => {
  renderPage()

  const hrefs = screen
    .getAllByRole('link')
    .map((a) => a.getAttribute('href'))
    .filter((href) => href?.startsWith('/press/') && href !== ZIP_FILE)

  expect(hrefs).toEqual(expect.arrayContaining(linkedFiles))

  for (const href of hrefs) {
    expect(existsSync(`public${href}`), `mangler fil: public${href}`).toBe(true)
  }
})

test('previewbildene finnes', () => {
  const { container } = renderPage()

  const sources = [...container.querySelectorAll('img')].map((img) => img.getAttribute('src'))
  expect(sources).toEqual(expect.arrayContaining(LOGOS.map((logo) => logo.preview)))

  for (const src of sources) {
    expect(existsSync(`public${src}`), `mangler fil: public${src}`).toBe(true)
  }
})

// BRANDING.md ber et menneske oppdatere disse tallene for hånd ved logobytte.
test('pikselmålene på siden stemmer med filene på disk', () => {
  for (const logo of LOGOS) {
    for (const { file, meta } of logo.files) {
      if (!file.endsWith('.png')) continue

      const { width, height } = pngSize(`public${file}`)
      expect(meta, `feil mål oppgitt for ${file}`).toBe(`${width} × ${height}`)
    }
  }
})

test('ZIP-en bygges med nøyaktig de filene siden lenker til', () => {
  expect(ZIP_FILE.endsWith(`/${ZIP_NAME}`)).toBe(true)

  const entries = readZipEntries(createZip(collectFiles()))

  const inZip = entries.map((e) => e.name).sort()
  const onPage = linkedFiles.map((f) => f.split('/').pop()).sort()
  expect(inZip).toEqual(onPage)

  for (const entry of entries) {
    const data = readFileSync(`public/press/logo/${entry.name}`)
    expect(entry.size, `feil størrelse i ZIP for ${entry.name}`).toBe(data.length)
    expect(entry.crc, `feil innhold i ZIP for ${entry.name}`).toBe(crc32(data))
  }
})

test('siden tilbyr begge variantene som PNG i to størrelser og vektor-PDF', () => {
  for (const logo of LOGOS) {
    const labels = logo.files.map((f) => f.label)
    expect(labels, `${logo.name} mangler en variant`).toEqual([
      'PNG — black background, small',
      'PNG — black background, large',
      'PNG — transparent, small',
      'PNG — transparent, large',
      'PDF — vector, for print',
    ])
  }
})
