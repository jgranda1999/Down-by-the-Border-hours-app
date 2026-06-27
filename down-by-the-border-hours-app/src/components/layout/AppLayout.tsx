import { Link, Outlet } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { getHomePath } from '@/lib/utils/profile'

function Header() {
  const { signOut } = useAuth()
  const { profile } = useProfile()

  const handleSignOut = () => {
    void signOut()
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
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
              {profile.role === 'admin' ? (
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
