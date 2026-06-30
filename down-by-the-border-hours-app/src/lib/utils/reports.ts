import { formatDate } from '@/lib/utils/dates'
import type { HourLog } from '@/types'

export function filterLogsByDateRange<T extends Pick<HourLog, 'event_date'>>(
  logs: T[],
  from?: string,
  to?: string,
): T[] {
  return logs.filter((log) => {
    if (from && log.event_date < from) return false
    if (to && log.event_date > to) return false
    return true
  })
}

export function formatDateRangeLabel(from?: string, to?: string): string {
  if (from && to) {
    return `${formatDate(from)} – ${formatDate(to)}`
  }
  if (from) {
    return `From ${formatDate(from)}`
  }
  if (to) {
    return `Through ${formatDate(to)}`
  }
  return 'All recorded volunteer hours'
}
