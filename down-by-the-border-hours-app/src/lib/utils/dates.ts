export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(`${dateString}T12:00:00`))
}

export function formatDateTime(isoString: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoString))
}

export function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
  }).format(new Date(isoString))
}
