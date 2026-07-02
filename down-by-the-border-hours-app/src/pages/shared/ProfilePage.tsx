import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PageHeader from '@/components/ui/PageHeader'
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
import { formControlBorderClass, formControlClassName } from '@/components/ui/formStyles'

const volunteerProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Add a phone number we can reach you at'),
  school: z.string().min(1, 'Pick your school or choose Not applicable'),
  parentName: z.string().min(1, 'Add a parent or guardian name'),
  parentPhone: z.string().min(1, 'Add a parent or guardian phone number'),
  parentEmail: z
    .string()
    .min(1, 'Add a parent or guardian email')
    .email('That doesn\'t look like a valid email'),
})

const adminProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Add a phone number we can reach you at'),
  school: z.string().min(1, 'Pick your school or choose Not applicable'),
  title: z.string().optional(),
})

type VolunteerProfileFormData = z.infer<typeof volunteerProfileSchema>
type AdminProfileFormData = z.infer<typeof adminProfileSchema>

function ProfilePage() {
  const { user } = useAuth()
  const { profile, applyProfileUpdate } = useProfile()
  const isAdmin = isAdminProfile(profile)

  const volunteerForm = useForm<VolunteerProfileFormData>({
    resolver: zodResolver(volunteerProfileSchema),
  })

  const adminForm = useForm<AdminProfileFormData>({
    resolver: zodResolver(adminProfileSchema),
  })

  useEffect(() => {
    if (!profile) return

    if (profile.role === 'admin') {
      adminForm.reset({
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone ?? '',
        school: profile.school ?? '',
        title: profile.title ?? '',
      })
      return
    }

    volunteerForm.reset({
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone ?? '',
      school: profile.school ?? '',
      parentName: profile.parent_name ?? '',
      parentPhone: profile.parent_phone ?? '',
      parentEmail: profile.parent_email ?? '',
    })
  }, [profile, adminForm, volunteerForm])

  const onSubmitVolunteer = async (values: VolunteerProfileFormData) => {
    if (!user) return

    try {
      const updated = await updateProfile(user.id, {
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        school: values.school,
        parent_name: values.parentName,
        parent_phone: values.parentPhone,
        parent_email: values.parentEmail,
      })
      applyProfileUpdate(updated)
      appToast.success('Profile updated.')
    } catch (error) {
      appToast.error(
        getErrorMessage(error, 'Could not save your profile. Try again.'),
      )
    }
  }

  const onSubmitAdmin = async (values: AdminProfileFormData) => {
    if (!user) return

    try {
      const updated = await updateProfile(user.id, {
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        school: values.school,
        title: values.title?.trim() || null,
      })
      applyProfileUpdate(updated)
      appToast.success('Profile updated.')
    } catch (error) {
      appToast.error(
        getErrorMessage(error, 'Could not save your profile. Try again.'),
      )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your profile"
        description="Update your info anytime. Your email can&apos;t be changed here."
        action={
          <Link to={getHomePath(profile)}>
            <Button variant="secondary" className="w-full sm:w-auto">
              Back
            </Button>
          </Link>
        }
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700">Email</p>
          <p className="mt-1 text-slate-900">{profile?.email}</p>
        </div>

        {isAdmin ? (
          <form className="space-y-4" onSubmit={adminForm.handleSubmit(onSubmitAdmin)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First name"
                autoComplete="given-name"
                error={adminForm.formState.errors.firstName?.message}
                {...adminForm.register('firstName')}
              />
              <Input
                label="Last name"
                autoComplete="family-name"
                error={adminForm.formState.errors.lastName?.message}
                {...adminForm.register('lastName')}
              />
            </div>

            <Input
              label="Phone number"
              type="tel"
              autoComplete="tel"
              error={adminForm.formState.errors.phone?.message}
              {...adminForm.register('phone')}
            />

            <div className="space-y-1">
              <label htmlFor="admin-school" className="block text-sm font-medium text-slate-700">
                School
              </label>
              <input
                id="admin-school"
                list="admin-profile-school-suggestions"
                className={`${formControlClassName} ${formControlBorderClass(Boolean(adminForm.formState.errors.school))}`}
                {...adminForm.register('school')}
              />
              <datalist id="admin-profile-school-suggestions">
                {SCHOOL_DATALIST_OPTIONS.map((school) => (
                  <option key={school} value={school} />
                ))}
              </datalist>
              {adminForm.formState.errors.school ? (
                <p className="text-sm text-red-600">
                  {adminForm.formState.errors.school.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Role</p>
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                {ADMIN_ROLE_LABEL}
              </p>
            </div>

            <Input
              label="Title (optional)"
              placeholder="e.g. Volunteer Coordinator"
              error={adminForm.formState.errors.title?.message}
              {...adminForm.register('title')}
            />

            <Button type="submit" isLoading={adminForm.formState.isSubmitting}>
              Save changes
            </Button>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={volunteerForm.handleSubmit(onSubmitVolunteer)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First name"
                autoComplete="given-name"
                error={volunteerForm.formState.errors.firstName?.message}
                {...volunteerForm.register('firstName')}
              />
              <Input
                label="Last name"
                autoComplete="family-name"
                error={volunteerForm.formState.errors.lastName?.message}
                {...volunteerForm.register('lastName')}
              />
            </div>

            <Input
              label="Your phone number"
              type="tel"
              autoComplete="tel"
              error={volunteerForm.formState.errors.phone?.message}
              {...volunteerForm.register('phone')}
            />

            <div className="space-y-1">
              <label htmlFor="school" className="block text-sm font-medium text-slate-700">
                School
              </label>
              <input
                id="school"
                list="profile-school-suggestions"
                className={`${formControlClassName} ${formControlBorderClass(Boolean(volunteerForm.formState.errors.school))}`}
                {...volunteerForm.register('school')}
              />
            <datalist id="profile-school-suggestions">
              {SCHOOL_DATALIST_OPTIONS.map((school) => (
                <option key={school} value={school} />
              ))}
            </datalist>
              {volunteerForm.formState.errors.school ? (
                <p className="text-sm text-red-600">
                  {volunteerForm.formState.errors.school.message}
                </p>
              ) : null}
            </div>

            <Input
              label="Parent or guardian name"
              error={volunteerForm.formState.errors.parentName?.message}
              {...volunteerForm.register('parentName')}
            />
            <Input
              label="Parent or guardian phone"
              type="tel"
              error={volunteerForm.formState.errors.parentPhone?.message}
              {...volunteerForm.register('parentPhone')}
            />
            <Input
              label="Parent or guardian email"
              type="email"
              error={volunteerForm.formState.errors.parentEmail?.message}
              {...volunteerForm.register('parentEmail')}
            />

            <Button type="submit" isLoading={volunteerForm.formState.isSubmitting}>
              Save changes
            </Button>
          </form>
        )}
      </section>
    </div>
  )
}

export default ProfilePage
