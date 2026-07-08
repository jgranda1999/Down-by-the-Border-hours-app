import { Link, useNavigate } from 'react-router-dom'
import HourLogForm from '@/components/forms/HourLogForm'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { uploadHourLogPhoto, deleteHourLogPhoto } from '@/lib/api/hourLogPhotos'
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
        description="Tell us about the event you volunteered at. A verification selfie is required for every log."
        action={
          <Link to="/dashboard">
            <Button variant="secondary" className="w-full sm:w-auto">
              Back
            </Button>
          </Link>
        }
      />

      <section className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
        <HourLogForm
          submitLabel="Submit hours"
          requireVerificationPhoto
          onCancel={() => navigate('/dashboard')}
          onSubmit={async (values) => {
            const logId = crypto.randomUUID()
            let photoPath: string | null = null

            try {
              if (!values.verificationPhoto) {
                throw new Error('Take a verification selfie before submitting.')
              }

              photoPath = await uploadHourLogPhoto(user.id, logId, values.verificationPhoto)

              await createHourLog({
                id: logId,
                volunteer_id: user.id,
                event_name: values.eventName,
                event_date: values.eventDate,
                sign_in_time: values.signInIso,
                sign_out_time: values.signOutIso,
                hours: values.hours,
                notes: values.notes?.trim() || null,
                verification_photo_path: photoPath,
              })
              appToast.success('Hours logged!')
              navigate('/hours', { replace: true })
            } catch (error) {
              if (photoPath) {
                try {
                  await deleteHourLogPhoto(photoPath)
                } catch {
                  // Best-effort cleanup if DB insert failed after upload.
                }
              }
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
