import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { getHomePath } from '@/lib/utils/profile'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-700 hover:bg-slate-100'
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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            to={getHomePath(profile)}
            className="text-lg font-semibold text-slate-900"
          >
            Down By The Border
          </Link>

          <div className="flex items-center gap-3">
            {profile ? (
              <p className="hidden text-sm text-slate-600 sm:block">
                {profile.first_name} {profile.last_name}
                {isAdmin ? (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    Admin
                  </span>
                ) : null}
              </p>
            ) : null}
            <Button variant="secondary" onClick={handleSignOut}>
              Log out
            </Button>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
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
    </header>
  )
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
