import { Link, useNavigate } from 'react-router-dom'
import HourLogForm from '@/components/forms/HourLogForm'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { createHourLog } from '@/lib/api/hourLogs'
import { appToast } from '@/lib/toast'
import { getErrorMessage } from '@/lib/utils/errors'

function LogHoursPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Log hours"
        description="Tell us about the event you volunteered at. Hours are calculated from your sign-in and sign-out times."
        action={
          <Link to="/dashboard">
            <Button variant="secondary" className="w-full sm:w-auto">
              Back
            </Button>
          </Link>
        }
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <HourLogForm
          submitLabel="Submit hours"
          onCancel={() => navigate('/dashboard')}
          onSubmit={async (values) => {
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
              appToast.success('Hours logged!')
              navigate('/hours', { replace: true })
            } catch (error) {
              appToast.error(
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
