import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import VerificationPhotoView from '@/components/hour-logs/VerificationPhotoView'
import HourLogForm from '@/components/forms/HourLogForm'
import Button from '@/components/ui/Button'
import ErrorState from '@/components/ui/ErrorState'
import Skeleton from '@/components/ui/Skeleton'
import { getHourLog, updateHourLog } from '@/lib/api/hourLogs'
import { formatProfileName, getProfile } from '@/lib/api/profiles'
import { appToast } from '@/lib/toast'
import { getErrorMessage } from '@/lib/utils/errors'
import { toTimeInputValue } from '@/lib/utils/hours'
import type { HourLog, Profile } from '@/types'

function AdminEditLogPage() {
  const { logId } = useParams()
  const navigate = useNavigate()
  const [log, setLog] = useState<HourLog | null>(null)
  const [volunteer, setVolunteer] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!logId) return

    async function loadLog() {
      try {
        setIsLoading(true)
        const logData = await getHourLog(logId!)
        const volunteerData = await getProfile(logData.volunteer_id)
        setLog(logData)
        setVolunteer(volunteerData)
      } catch {
        setError('Could not find that log.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadLog()
  }, [logId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <section className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </section>
      </div>
    )
  }

  if (error || !log || !volunteer) {
    return (
      <div className="space-y-4">
        <ErrorState message={error ?? 'Log not found.'} />
        <Link to="/admin/logs">
          <Button variant="secondary">Back to all logs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-blue">Edit log</h1>
          <p className="mt-1 text-sm text-brand-muted">
            Editing hours for {formatProfileName(volunteer)}
          </p>
        </div>
        <Link to="/admin/logs">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>

      <section className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
        <VerificationPhotoView
          photoPath={log.verification_photo_path}
          label="Volunteer verification selfie"
          className="mb-6"
        />

        <HourLogForm
          submitLabel="Save changes"
          defaultValues={{
            eventName: log.event_name,
            eventDate: log.event_date,
            signInTime: toTimeInputValue(log.sign_in_time),
            signOutTime: log.sign_out_time ? toTimeInputValue(log.sign_out_time) : '',
            notes: log.notes ?? '',
          }}
          onCancel={() => navigate('/admin/logs')}
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
              appToast.success('Log updated.')
              navigate('/admin/logs', { replace: true })
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

export default AdminEditLogPage
