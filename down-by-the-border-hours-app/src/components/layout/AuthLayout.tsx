import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '@/components/ui/BrandLogo'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6 sm:py-8">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 rounded-lg bg-slate-50 px-4 py-5 text-center">
          <Link to="/" className="inline-flex justify-center">
            <BrandLogo />
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        </div>

        {children}

        {footer ? <div className="mt-6 text-center text-sm text-slate-600">{footer}</div> : null}
      </div>
    </div>
  )
}

export default AuthLayout
