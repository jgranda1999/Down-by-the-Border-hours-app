import type { HourLog } from '@/types'

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000

export function calculateHours(signIn: Date, signOut: Date): number {
  const diffMs = signOut.getTime() - signIn.getTime()
  return Math.round((diffMs / 3_600_000) * 100) / 100
}

export function canEditLog(log: HourLog): boolean {
  const createdAt = new Date(log.created_at).getTime()
  return Date.now() - createdAt < EDIT_WINDOW_MS
}

export function formatHours(hours: number): string {
  return hours.toFixed(2)
}

export function combineDateAndTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`)
}

export function toDateInputValue(isoString: string): string {
  return isoString.slice(0, 10)
}

export function toTimeInputValue(isoString: string): string {
  const date = new Date(isoString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
