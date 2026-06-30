import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HourLogForm from '@/components/forms/HourLogForm'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createHourLog } from '@/lib/api/hourLogs'
import { getErrorMessage } from '@/lib/utils/errors'

function LogHoursPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Log hours</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tell us about the event you volunteered at. Hours are calculated from your sign-in and sign-out times.
          </p>
        </div>
        <Link to="/dashboard">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {submitError ? (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {submitError}
          </p>
        ) : null}

        <HourLogForm
          submitLabel="Submit hours"
          onCancel={() => navigate('/dashboard')}
          onSubmit={async (values) => {
            setSubmitError(null)

            try {
              await createHourLog({
                volunteer_id: user.id,
                event_name: values.eventName,
                event_date: values.eventDate,
                sign_in_time: values.signInIso,
                sign_out_time: values.signOutIso,
                hours: values.hours,
                notes: values.notes?.trim() || null,
              })
              navigate('/hours', { replace: true })
            } catch (error) {
              setSubmitError(
                getErrorMessage(error, 'Could not save your hours. Try again.'),
              )
            }
          }}
        />
      </section>
    </div>
  )
}

export default LogHoursPage
