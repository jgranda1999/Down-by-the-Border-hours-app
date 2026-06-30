import { pdf } from '@react-pdf/renderer'
import { formatProfileName } from '@/lib/api/profiles'
import { sumHours } from '@/lib/api/hourLogs'
import { formatDateRangeLabel } from '@/lib/utils/reports'
import { downloadBlob, sanitizeFilename } from '@/lib/utils/download'
import { formatDate } from '@/lib/utils/dates'
import ServiceHourLetter from '@/pdf/ServiceHourLetter'
import type { HourLog, Profile } from '@/types'

export interface DownloadServiceHourLetterInput {
  volunteer: Profile
  logs: HourLog[]
  from?: string
  to?: string
  admin: Profile
}

export async function downloadServiceHourLetter(
  input: DownloadServiceHourLetterInput,
): Promise<void> {
  const { volunteer, logs, from, to, admin } = input

  if (logs.length === 0) {
    throw new Error('No volunteer hours found for the selected date range.')
  }

  const sortedLogs = [...logs].sort((a, b) => {
    if (a.event_date !== b.event_date) {
      return a.event_date.localeCompare(b.event_date)
    }
    return a.created_at.localeCompare(b.created_at)
  })

  const blob = await pdf(
    <ServiceHourLetter
      volunteer={volunteer}
      logs={sortedLogs}
      dateRangeLabel={formatDateRangeLabel(from, to)}
      totalHours={sumHours(sortedLogs)}
      adminName={formatProfileName(admin)}
      adminTitle={admin.title?.trim() || undefined}
      generatedDate={formatDate(new Date().toISOString().slice(0, 10))}
    />,
  ).toBlob()

  const namePart = sanitizeFilename(formatProfileName(volunteer)) || 'volunteer'
  downloadBlob(blob, `service-hours-${namePart}.pdf`)
}
