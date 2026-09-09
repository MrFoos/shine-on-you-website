/**
 * Pre-build script: pakker logofilene i public/press/logo/ til ZIP-en som
 * press-siden tilbyr.
 *
 * ZIP-en er et byggeartefakt, ikke en fil i git: pakkes den ved bygg, kan den
 * ikke bli liggende igjen med gamle filer etter et logobytte. Arkivet lagres
 * uten komprimering — PNG og PDF er komprimert fra før, så det koster ~1 % i
 * størrelse og sparer oss for en avhengighet.
 */

import { crc32 } from 'node:zlib'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOGO_DIR = resolve(__dirname, '..', 'public', 'press', 'logo')
export const ZIP_NAME = 'shine-on-you-logos.zip'

/** Filene som skal med: alle nedlastbare logofiler, ikke previewbildene. */
export function collectFiles(dir = LOGO_DIR) {
  return readdirSync(dir)
    .filter((name) => /^shine-on-you-.*\.(png|pdf)$/.test(name))
    .sort()
    .map((name) => ({ name, data: readFileSync(resolve(dir, name)) }))
}

// Fast tidsstempel (1980-01-01, ZIP-epoken) gjør arkivet identisk fra bygg til
// bygg, så deploy ikke laster opp en ny ZIP hver gang uten at noe er endret.
const DOS_TIME = 0
const DOS_DATE = 0x0021

/** Bygger et ukomprimert (store) ZIP-arkiv av `files`. */
export function createZip(files) {
  const locals = []
  const centrals = []
  let offset = 0

  for (const { name, data } of files) {
    const nameBuf = Buffer.from(name, 'utf8')
    const sum = crc32(data)

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0) // local file header signature
    local.writeUInt16LE(20, 4) // minsteversjon
    local.writeUInt16LE(0, 6) // flagg
    local.writeUInt16LE(0, 8) // metode: 0 = store
    local.writeUInt16LE(DOS_TIME, 10)
    local.writeUInt16LE(DOS_DATE, 12)
    local.writeUInt32LE(sum, 14)
    local.writeUInt32LE(data.length, 18) // komprimert størrelse
    local.writeUInt32LE(data.length, 22) // ukomprimert størrelse
    local.writeUInt16LE(nameBuf.length, 26)
    local.writeUInt16LE(0, 28) // extra field
    locals.push(local, nameBuf, data)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0) // central directory signature
    central.writeUInt16LE(20, 4) // laget av versjon
    central.writeUInt16LE(20, 6) // minsteversjon
    central.writeUInt16LE(0, 8)
    central.writeUInt16LE(0, 10)
    central.writeUInt16LE(DOS_TIME, 12)
    central.writeUInt16LE(DOS_DATE, 14)
    central.writeUInt32LE(sum, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(nameBuf.length, 28)
    central.writeUInt16LE(0, 30) // extra
    central.writeUInt16LE(0, 32) // kommentar
    central.writeUInt16LE(0, 34) // disknummer
    central.writeUInt16LE(0, 36) // interne attributter
    // Eksterne attributter: unix-modus 0644 i de øverste 16 bitene. Ganging,
    // ikke skift — `<< 16` går over til negativt tall i JS.
    central.writeUInt32LE(0o100644 * 0x10000, 38)
    central.writeUInt32LE(offset, 42) // offset til local header
    centrals.push(central, nameBuf)

    offset += local.length + nameBuf.length + data.length
  }

  const centralBuf = Buffer.concat(centrals)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0) // end of central directory
  end.writeUInt16LE(0, 4) // disknummer
  end.writeUInt16LE(0, 6) // disk med central directory
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(centralBuf.length, 12)
  end.writeUInt32LE(offset, 16)
  end.writeUInt16LE(0, 20) // arkivkommentar

  return Buffer.concat([...locals, centralBuf, end])
}

/** Leser navnene i arkivets central directory. Brukes av testene. */
export function readZipEntries(zip) {
  const count = zip.readUInt16LE(zip.length - 22 + 10)
  let pos = zip.readUInt32LE(zip.length - 22 + 16)
  const entries = []

  for (let i = 0; i < count; i++) {
    const nameLen = zip.readUInt16LE(pos + 28)
    const extraLen = zip.readUInt16LE(pos + 30)
    const commentLen = zip.readUInt16LE(pos + 32)
    entries.push({
      name: zip.toString('utf8', pos + 46, pos + 46 + nameLen),
      size: zip.readUInt32LE(pos + 24),
      crc: zip.readUInt32LE(pos + 16),
    })
    pos += 46 + nameLen + extraLen + commentLen
  }

  return entries
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const files = collectFiles()
  writeFileSync(resolve(LOGO_DIR, ZIP_NAME), createZip(files))
  console.log(`[build-press-zip] ${ZIP_NAME} skrevet med ${files.length} filer.`)
}
