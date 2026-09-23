export function formatShortDate(value: string): string {
  const date = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatFullDate(value: string): string {
  const date = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export function formatRelativeTime(value: string, now: Date = new Date()): string {
  const elapsed = now.getTime() - new Date(value).getTime()
  if (elapsed < MINUTE_MS) {
    return 'just now'
  }
  if (elapsed < HOUR_MS) {
    const minutes = Math.floor(elapsed / MINUTE_MS)
    return `${minutes}min ago`
  }
  if (elapsed < DAY_MS) {
    const hours = Math.floor(elapsed / HOUR_MS)
    return `${hours}h ago`
  }
  if (elapsed < 7 * DAY_MS) {
    const days = Math.floor(elapsed / DAY_MS)
    return `${days}d ago`
  }
  return formatFullDate(value)
}
