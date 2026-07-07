import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import HourLogForm from '@/components/forms/HourLogForm'
import Button from '@/components/ui/Button'
import ErrorState from '@/components/ui/ErrorState'
import Skeleton from '@/components/ui/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { getHourLog, updateHourLog } from '@/lib/api/hourLogs'
import { appToast } from '@/lib/toast'
import { getErrorMessage } from '@/lib/utils/errors'
import { canEditLog, toTimeInputValue } from '@/lib/utils/hours'
import type { HourLog } from '@/types'

function EditLogPage() {
  const { logId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [log, setLog] = useState<HourLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!logId || !user) return

    async function loadLog() {
      try {
        setIsLoading(true)
        const data = await getHourLog(logId!)
        if (data.volunteer_id !== user!.id) {
          setError('You can only edit your own logs.')
          return
        }
        if (!canEditLog(data)) {
          setError('This log is older than 24 hours and can no longer be edited.')
          return
        }
        setLog(data)
      } catch {
        setError('Could not find that log.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadLog()
  }, [logId, user])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <section className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </section>
      </div>
    )
  }

  if (error || !log) {
    return (
      <div className="space-y-4">
        <ErrorState message={error ?? 'Log not found.'} />
        <Link to="/hours">
          <Button variant="secondary">Back to my hours</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-blue">Edit hours</h1>
          <p className="mt-1 text-sm text-brand-muted">
            You can edit logs for 24 hours after submitting them.
          </p>
        </div>
        <Link to="/hours">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>

      <section className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
        <HourLogForm
          submitLabel="Save changes"
          defaultValues={{
            eventName: log.event_name,
            eventDate: log.event_date,
            signInTime: toTimeInputValue(log.sign_in_time),
            signOutTime: log.sign_out_time
              ? toTimeInputValue(log.sign_out_time)
              : '',
            notes: log.notes ?? '',
          }}
          onCancel={() => navigate('/hours')}
          onSubmit={async (values) => {
            try {
              await updateHourLog(log.id, {
                event_name: values.eventName,
                event_date: values.eventDate,
                sign_in_time: values.signInIso,
                sign_out_time: values.signOutIso,
                hours: values.hours,
                notes: values.notes?.trim() || null,
              })
              appToast.success('Hours updated.')
              navigate('/hours', { replace: true })
            } catch (submitErr) {
              appToast.error(
                getErrorMessage(submitErr, 'Could not update this log. Try again.'),
              )
            }
          }}
        />
      </section>
    </div>
  )
}

export default EditLogPage
