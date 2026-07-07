import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import BrandLogo from '@/components/ui/BrandLogo'
import { BRAND_TAGLINE } from '@/lib/brand'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { getHomePath } from '@/lib/utils/profile'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-blue text-white'
      : 'text-brand-blue hover:bg-brand-blue-light'
  }`
}

function Header() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { profile } = useProfile()
  const isAdmin = profile?.role === 'admin'

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true, state: null })
  }

  return (
    <header>
      <div className="bg-brand-primary px-4 py-2 text-center text-xs font-semibold text-brand-blue sm:text-sm">
        {BRAND_TAGLINE}
      </div>

      <div className="border-b border-brand-border bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to={getHomePath(profile)} className="min-w-0 inline-flex">
              <BrandLogo
                imageClassName="h-9 w-auto shrink-0"
                nameClassName="hidden truncate text-base font-semibold text-brand-blue sm:inline sm:text-lg"
              />
            </Link>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {profile ? (
                <p className="hidden max-w-[10rem] truncate text-sm text-brand-muted md:block">
                  {profile.first_name} {profile.last_name}
                  {isAdmin ? (
                    <span className="ml-2 rounded-full bg-brand-blue-light px-2 py-0.5 text-xs font-medium text-brand-blue">
                      Admin
                    </span>
                  ) : null}
                </p>
              ) : null}
              <Button variant="secondary" className="px-3 text-sm" onClick={handleSignOut}>
                Log out
              </Button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto rounded-lg bg-brand-blue-pale p-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {isAdmin ? (
              <>
                <NavLink to="/admin" end className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/logs" end className={navLinkClass}>
                  All logs
                </NavLink>
                <NavLink to="/admin/volunteers" end className={navLinkClass}>
                  Volunteers
                </NavLink>
                <NavLink to="/admin/manage-admins" end className={navLinkClass}>
                  Manage admins
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" end className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/hours/log" end className={navLinkClass}>
                  Log hours
                </NavLink>
                <NavLink to="/hours" end className={navLinkClass}>
                  My hours
                </NavLink>
              </>
            )}
            <NavLink to="/profile" end className={navLinkClass}>
              Profile
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
