import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '@/components/ui/BrandLogo'
import { BRAND_TAGLINE } from '@/lib/brand'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-surface">
      <div className="bg-brand-primary px-4 py-2 text-center text-xs font-semibold text-brand-blue sm:text-sm">
        {BRAND_TAGLINE}
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-md rounded-xl border border-brand-border bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6 rounded-lg bg-brand-blue-light px-4 py-5 text-center">
            <Link to="/" className="inline-flex justify-center">
              <BrandLogo nameClassName="text-lg font-semibold text-brand-blue" />
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-brand-blue sm:text-2xl">{title}</h1>
            <p className="mt-2 text-sm text-brand-muted">{subtitle}</p>
          </div>

          {children}

          {footer ? <div className="mt-6 text-center text-sm text-brand-muted">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
