import { formatProfileName } from '@/lib/api/profiles'
import { formatDate, formatTime } from '@/lib/utils/dates'
import { formatHours } from '@/lib/utils/hours'
import { downloadBlob } from '@/lib/utils/download'
import type { HourLogWithVolunteer } from '@/types'

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function toCsvRow(values: string[]): string {
  return values.map(escapeCsvField).join(',')
}

export function hourLogsToCsv(logs: HourLogWithVolunteer[]): string {
  const header = toCsvRow([
    'Date',
    'Volunteer',
    'School',
    'Event',
    'Sign in',
    'Sign out',
    'Hours',
    'Notes',
  ])

  const rows = logs.map((log) =>
    toCsvRow([
      formatDate(log.event_date),
      formatProfileName(log.volunteer),
      log.volunteer.school ?? '',
      log.event_name,
      formatTime(log.sign_in_time),
      log.sign_out_time ? formatTime(log.sign_out_time) : '',
      formatHours(Number(log.hours)),
      log.notes ?? '',
    ]),
  )

  return [header, ...rows].join('\n')
}

export function downloadHourLogsCsv(logs: HourLogWithVolunteer[]): void {
  const today = new Date().toISOString().slice(0, 10)
  const csv = hourLogsToCsv(logs)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, `down-by-the-border-logs-${today}.csv`)
}
