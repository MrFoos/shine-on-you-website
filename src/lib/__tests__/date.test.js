import { describe, it, expect } from 'vitest'
import { todayLocalISO } from '../date'

describe('todayLocalISO', () => {
  it('uses the local date, not the UTC date', () => {
    // 00:15 CEST on 5 September is still 22:15 UTC on 4 September. Using
    // toISOString() here would return 2026-09-04 and keep the 4 September
    // concert listed as upcoming for another two hours.
    const justAfterMidnightCest = new Date('2026-09-04T22:15:00Z')
    expect(justAfterMidnightCest.toISOString().split('T')[0]).toBe('2026-09-04')
    expect(todayLocalISO(justAfterMidnightCest)).toBe('2026-09-05')
  })

  it('zero-pads month and day', () => {
    expect(todayLocalISO(new Date(2026, 0, 3, 12))).toBe('2026-01-03')
  })

  it('matches the calendar date at midday', () => {
    expect(todayLocalISO(new Date(2026, 8, 5, 12))).toBe('2026-09-05')
  })
})
