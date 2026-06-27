import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { updateProfile } from '@/lib/api/profiles'
import { getErrorMessage } from '@/lib/utils/errors'
import { getHomePath, SUGGESTED_SCHOOLS } from '@/lib/utils/profile'

const profileSetupSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  school: z.string().min(1, 'School is required'),
  parentName: z.string().min(1, 'Parent or guardian name is required'),
  parentPhone: z.string().min(1, 'Parent or guardian phone is required'),
  parentEmail: z.string().min(1, 'Parent or guardian email is required').email('Enter a valid email'),
})

type ProfileSetupFormData = z.infer<typeof profileSetupSchema>

function ProfileSetupPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, refreshProfile } = useProfile()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      phone: '',
      school: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
    },
  })

  useEffect(() => {
    if (!profile) return

    reset({
      phone: profile.phone ?? '',
      school: profile.school ?? '',
      parentName: profile.parent_name ?? '',
      parentPhone: profile.parent_phone ?? '',
      parentEmail: profile.parent_email ?? '',
    })
  }, [profile, reset])

  const onSubmit = async (values: ProfileSetupFormData) => {
    if (!user) return

    setSubmitError(null)

    try {
      const updated = await updateProfile(user.id, {
        phone: values.phone,
        school: values.school,
        parent_name: values.parentName,
        parent_phone: values.parentPhone,
        parent_email: values.parentEmail,
      })
      await refreshProfile()
      navigate(getHomePath(updated), { replace: true })
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, 'Could not save your profile. Try again.'),
      )
    }
  }

  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="We only ask for this once so you don't have to re-enter it every time you log hours."
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Your phone number"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div className="space-y-1">
          <label htmlFor="school" className="block text-sm font-medium text-slate-700">
            School
          </label>
          <input
            id="school"
            list="school-suggestions"
            className={`block w-full min-h-11 rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${errors.school ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="Start typing your school"
            {...register('school')}
          />
          <datalist id="school-suggestions">
            {SUGGESTED_SCHOOLS.map((school) => (
              <option key={school} value={school} />
            ))}
          </datalist>
          {errors.school ? (
            <p className="text-sm text-red-600">{errors.school.message}</p>
          ) : null}
        </div>

        <Input
          label="Parent or guardian name"
          autoComplete="name"
          error={errors.parentName?.message}
          {...register('parentName')}
        />
        <Input
          label="Parent or guardian phone"
          type="tel"
          autoComplete="tel"
          error={errors.parentPhone?.message}
          {...register('parentPhone')}
        />
        <Input
          label="Parent or guardian email"
          type="email"
          autoComplete="email"
          error={errors.parentEmail?.message}
          {...register('parentEmail')}
        />

        {submitError ? (
          <p className="text-sm text-red-600" role="alert">
            {submitError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Save and continue
        </Button>
      </form>
    </AuthLayout>
  )
}

export default ProfileSetupPage
