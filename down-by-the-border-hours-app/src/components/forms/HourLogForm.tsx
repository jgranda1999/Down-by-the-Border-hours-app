import { useEffect, useId, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import VerificationPhotoView from '@/components/hour-logs/VerificationPhotoView'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { validateHourLogPhoto } from '@/lib/api/hourLogPhotos'
import { calculateHours, combineDateAndTime } from '@/lib/utils/hours'

const hourLogSchema = z
  .object({
    eventName: z.string().min(1, 'What event did you volunteer at?'),
    eventDate: z.string().min(1, 'Pick the date of the event'),
    signInTime: z.string().min(1, 'When did you sign in?'),
    signOutTime: z.string().min(1, 'When did you sign out?'),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const signIn = combineDateAndTime(data.eventDate, data.signInTime)
      const signOut = combineDateAndTime(data.eventDate, data.signOutTime)
      return signOut > signIn
    },
    {
      message: 'Sign-out has to be after sign-in',
      path: ['signOutTime'],
    },
  )
  .refine(
    (data) => {
      const signIn = combineDateAndTime(data.eventDate, data.signInTime)
      const signOut = combineDateAndTime(data.eventDate, data.signOutTime)
      const hours = calculateHours(signIn, signOut)
      return hours > 0 && hours <= 24
    },
    {
      message: 'That shift would be more than 24 hours — double-check your times',
      path: ['signOutTime'],
    },
  )

export type HourLogFormData = z.infer<typeof hourLogSchema>

export interface HourLogFormValues extends HourLogFormData {
  hours: number
  signInIso: string
  signOutIso: string
  verificationPhoto?: File
}

interface HourLogFormProps {
  defaultValues?: Partial<HourLogFormData>
  submitLabel: string
  onSubmit: (values: HourLogFormValues) => Promise<void>
  onCancel?: () => void
  requireVerificationPhoto?: boolean
  existingVerificationPhotoPath?: string | null
}

function HourLogForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  requireVerificationPhoto = false,
  existingVerificationPhotoPath = null,
}: HourLogFormProps) {
  const photoInputId = useId()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [verificationPhoto, setVerificationPhoto] = useState<File | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HourLogFormData>({
    resolver: zodResolver(hourLogSchema),
    defaultValues: {
      eventName: '',
      eventDate: '',
      signInTime: '',
      signOutTime: '',
      notes: '',
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        eventName: '',
        eventDate: '',
        signInTime: '',
        signOutTime: '',
        notes: '',
        ...defaultValues,
      })
    }
  }, [defaultValues, reset])

  useEffect(() => {
    if (!verificationPhoto) {
      setPhotoPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(verificationPhoto)
    setPhotoPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [verificationPhoto])

  const watched = useWatch({ control })
  const previewHours = (() => {
    if (!watched.eventDate || !watched.signInTime || !watched.signOutTime) {
      return null
    }

    try {
      const signIn = combineDateAndTime(watched.eventDate, watched.signInTime)
      const signOut = combineDateAndTime(watched.eventDate, watched.signOutTime)
      if (signOut <= signIn) return null
      return calculateHours(signIn, signOut)
    } catch {
      return null
    }
  })()

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateHourLogPhoto(file)
    if (validationError) {
      setPhotoError(validationError)
      setVerificationPhoto(null)
      event.target.value = ''
      return
    }

    setPhotoError(null)
    setVerificationPhoto(file)
  }

  const handleFormSubmit = async (values: HourLogFormData) => {
    const hasExistingPhoto = Boolean(existingVerificationPhotoPath)
    const mustProvidePhoto =
      requireVerificationPhoto && !verificationPhoto && !hasExistingPhoto

    if (mustProvidePhoto) {
      setPhotoError('Take a verification selfie before submitting.')
      return
    }

    const signIn = combineDateAndTime(values.eventDate, values.signInTime)
    const signOut = combineDateAndTime(values.eventDate, values.signOutTime)

    await onSubmit({
      ...values,
      hours: calculateHours(signIn, signOut),
      signInIso: signIn.toISOString(),
      signOutIso: signOut.toISOString(),
      verificationPhoto: verificationPhoto ?? undefined,
    })
  }

  const showPhotoSection = requireVerificationPhoto || Boolean(existingVerificationPhotoPath)

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        label="Event name"
        placeholder="e.g. Field day"
        error={errors.eventName?.message}
        {...register('eventName')}
      />
      <Input
        label="Event date"
        type="date"
        error={errors.eventDate?.message}
        {...register('eventDate')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Sign-in time"
          type="time"
          error={errors.signInTime?.message}
          {...register('signInTime')}
        />
        <Input
          label="Sign-out time"
          type="time"
          error={errors.signOutTime?.message}
          {...register('signOutTime')}
        />
      </div>

      {previewHours !== null ? (
        <p className="rounded-lg bg-brand-primary-light px-3 py-2 text-sm text-brand-body">
          Calculated hours: <strong>{previewHours.toFixed(2)}</strong>
        </p>
      ) : null}

      {showPhotoSection ? (
        <div className="space-y-3 rounded-lg border border-brand-border bg-brand-blue-pale p-4">
          <div>
            <p className="text-sm font-medium text-brand-blue">Event verification selfie</p>
            <p className="mt-1 text-sm text-brand-muted">
              Take a selfie with your front camera showing your face and the event in the
              background. We need to clearly see you and where you volunteered.
            </p>
          </div>

          {existingVerificationPhotoPath && !verificationPhoto ? (
            <VerificationPhotoView
              photoPath={existingVerificationPhotoPath}
              label="Current verification photo"
            />
          ) : null}

          {photoPreviewUrl ? (
            <img
              src={photoPreviewUrl}
              alt="Verification selfie preview"
              className="max-h-64 w-full rounded-lg border border-brand-border object-cover"
            />
          ) : null}

          <input
            ref={photoInputRef}
            id={photoInputId}
            type="file"
            accept="image/*"
            capture="user"
            className="sr-only"
            onChange={handlePhotoChange}
          />

          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => photoInputRef.current?.click()}
          >
            {verificationPhoto || existingVerificationPhotoPath
              ? 'Retake verification selfie'
              : 'Take verification selfie'}
          </Button>

          {photoError ? <p className="text-sm text-red-600">{photoError}</p> : null}
        </div>
      ) : null}

      <Textarea
        label="Notes (optional)"
        placeholder="Anything else we should know?"
        error={errors.notes?.message}
        {...register('notes')}
      />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export default HourLogForm
