import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { sumHours } from '@/lib/api/hourLogs'
import { formatProfileName } from '@/lib/api/profiles'
import { downloadServiceHourLetter } from '@/lib/pdf/downloadServiceHourLetter'
import { appToast } from '@/lib/toast'
import { filterLogsByDateRange } from '@/lib/utils/reports'
import { formatHours } from '@/lib/utils/hours'
import { getErrorMessage } from '@/lib/utils/errors'
import { useProfile } from '@/hooks/useProfile'
import type { HourLog, Profile } from '@/types'

interface ServiceHourLetterPanelProps {
  volunteer: Profile
  logs: HourLog[]
}

function ServiceHourLetterPanel({ volunteer, logs }: ServiceHourLetterPanelProps) {
  const { profile: adminProfile } = useProfile()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredLogs = useMemo(
    () => filterLogsByDateRange(logs, from || undefined, to || undefined),
    [logs, from, to],
  )

  const handleDownload = async () => {
    if (!adminProfile) {
      appToast.error('Your admin profile could not be loaded. Try refreshing the page.')
      return
    }

    try {
      setIsGenerating(true)
      await downloadServiceHourLetter({
        volunteer,
        logs: filteredLogs,
        from: from || undefined,
        to: to || undefined,
        admin: adminProfile,
      })
      appToast.success('Letter downloaded.')
    } catch (downloadError) {
      appToast.error(
        getErrorMessage(
          downloadError,
          'Could not generate the service-hour letter.',
        ),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-brand-blue">Service-hour letter</h2>
      <p className="mt-1 text-sm text-brand-muted">
        Generate a PDF verification letter for {formatProfileName(volunteer)}. Leave
        dates blank to include all logged hours.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Input
          label="From date"
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
        />
        <Input
          label="To date"
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
        />
      </div>

      <p className="mt-4 text-sm text-brand-muted">
        {filteredLogs.length === 0
          ? 'No hours match this date range.'
          : `${filteredLogs.length} ${filteredLogs.length === 1 ? 'entry' : 'entries'} · ${formatHours(sumHours(filteredLogs))} hours`}
      </p>

      <div className="mt-4">
        <Button
          className="w-full sm:w-auto"
          isLoading={isGenerating}
          disabled={filteredLogs.length === 0}
          onClick={() => void handleDownload()}
        >
          Download letter
        </Button>
      </div>
    </section>
  )
}

export default ServiceHourLetterPanel
