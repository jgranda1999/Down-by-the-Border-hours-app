import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/utils/errors'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormData) => {
    setSubmitError(null)

    try {
      await signIn(values.email, values.password)
      const requestedPath =
        (location.state as { from?: string } | null)?.from ?? '/'
      navigate(requestedPath, { replace: true })
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Could not sign you in. Try again.'))
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to log and track your volunteer hours."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-medium text-slate-900 underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {submitError ? (
          <p className="text-sm text-red-600" role="alert">
            {submitError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
