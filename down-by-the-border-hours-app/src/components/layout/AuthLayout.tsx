import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Down By The Border
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        </div>

        {children}

        {footer ? <div className="mt-6 text-center text-sm text-slate-600">{footer}</div> : null}
      </div>
    </div>
  )
}

export default AuthLayout
