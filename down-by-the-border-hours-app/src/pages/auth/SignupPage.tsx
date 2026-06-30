import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/utils/errors'

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

type SignupFormData = z.infer<typeof signupSchema>

function SignupPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (values: SignupFormData) => {
    setSubmitError(null)

    try {
      const result = await signUp(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
      )

      if (result.needsEmailConfirmation) {
        setConfirmationEmail(result.email)
        return
      }

      navigate('/profile/setup', { replace: true })
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Could not create your account. Try again.'))
    }
  }

  const handleCloseModal = () => {
    setConfirmationEmail(null)
    navigate('/login', { replace: true })
  }

  return (
    <>
      <AuthLayout
        title="Create your account"
        subtitle="Sign up to start tracking your volunteer hours."
        footer={
          <>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-slate-900 underline">
              Sign in
            </Link>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First name"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last name"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {submitError ? (
            <p className="text-sm text-red-600" role="alert">
              {submitError}
            </p>
          ) : null}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>
      </AuthLayout>

      <Modal
        isOpen={confirmationEmail !== null}
        title="Check your email"
        onClose={handleCloseModal}
        closeLabel="Go to sign in"
      >
        <p>
          We sent a confirmation link to{' '}
          <strong className="text-slate-900">{confirmationEmail}</strong>.
        </p>
        <p className="mt-3">
          Open that email and click the link to finish signing up. Once you&apos;re
          confirmed, come back here and sign in to complete your profile.
        </p>
      </Modal>
    </>
  )
}

export default SignupPage
