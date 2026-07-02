import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
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
}

interface HourLogFormProps {
  defaultValues?: Partial<HourLogFormData>
  submitLabel: string
  onSubmit: (values: HourLogFormValues) => Promise<void>
  onCancel?: () => void
}

function HourLogForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: HourLogFormProps) {
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

  const handleFormSubmit = async (values: HourLogFormData) => {
    const signIn = combineDateAndTime(values.eventDate, values.signInTime)
    const signOut = combineDateAndTime(values.eventDate, values.signOutTime)

    await onSubmit({
      ...values,
      hours: calculateHours(signIn, signOut),
      signInIso: signIn.toISOString(),
      signOutIso: signOut.toISOString(),
    })
  }

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
        <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
          Calculated hours: <strong>{previewHours.toFixed(2)}</strong>
        </p>
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
