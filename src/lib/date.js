/**
 * Today's date as YYYY-MM-DD in the visitor's local timezone.
 *
 * `new Date().toISOString()` returns UTC, so east of Greenwich the date rolls
 * over late: at 00:15 CEST it still reports yesterday, and yesterday's concert
 * keeps showing as the next show for another couple of hours. Event dates are
 * plain dates (no time), so they must be compared against a local date.
 */
export function todayLocalISO(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}
