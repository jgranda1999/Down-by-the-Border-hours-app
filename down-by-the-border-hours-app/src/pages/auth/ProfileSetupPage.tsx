import { useEffect } from 'react'
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
import { appToast } from '@/lib/toast'
import { getErrorMessage } from '@/lib/utils/errors'
import {
  ADMIN_ROLE_LABEL,
  getHomePath,
  isAdminProfile,
  SCHOOL_DATALIST_OPTIONS,
} from '@/lib/utils/profile'

const profileSetupSchema = z.object({
  phone: z.string().min(1, 'We need a phone number to reach you'),
  school: z.string().min(1, 'Pick your school or choose Not applicable'),
})

type ProfileSetupFormData = z.infer<typeof profileSetupSchema>

function ProfileSetupPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, applyProfileUpdate } = useProfile()
  const isAdmin = isAdminProfile(profile)

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
    },
  })

  useEffect(() => {
    if (!profile) return

    reset({
      phone: profile.phone ?? '',
      school: profile.school ?? '',
    })
  }, [profile, reset])

  const onSubmit = async (values: ProfileSetupFormData) => {
    if (!user) return

    try {
      const updated = await updateProfile(user.id, {
        phone: values.phone,
        school: values.school,
      })
      applyProfileUpdate(updated)
      navigate(getHomePath(updated), { replace: true })
    } catch (error) {
      appToast.error(
        getErrorMessage(error, 'Could not save your profile. Try again.'),
      )
    }
  }

  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="Just a couple details so we know how to reach you. Parent info can be added later from your profile."
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
            {SCHOOL_DATALIST_OPTIONS.map((school) => (
              <option key={school} value={school} />
            ))}
          </datalist>
          <p className="text-xs text-slate-500">
            Staff and admins can choose &ldquo;Not applicable&rdquo;.
          </p>
          {errors.school ? (
            <p className="text-sm text-red-600">{errors.school.message}</p>
          ) : null}
        </div>

        {isAdmin ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-700">Role</p>
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
              {ADMIN_ROLE_LABEL}
            </p>
          </div>
        ) : null}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Save and continue
        </Button>
      </form>
    </AuthLayout>
  )
}

export default ProfileSetupPage
