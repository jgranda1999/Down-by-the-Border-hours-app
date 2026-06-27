import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { getHomePath, isProfileComplete } from '@/lib/utils/profile'

function ProtectedRoute() {
  const { session, isLoading: isAuthLoading } = useAuth()
  const { profile, isLoading: isProfileLoading, error } = useProfile()
  const location = useLocation()

  if (isAuthLoading || (session && isProfileLoading)) {
    return <Spinner label="Checking your session" />
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-red-600">
          We couldn&apos;t load your profile. Try refreshing the page.
        </p>
      </div>
    )
  }

  const onProfileSetup = location.pathname === '/profile/setup'

  if (!isProfileComplete(profile) && !onProfileSetup) {
    return <Navigate to="/profile/setup" replace />
  }

  if (isProfileComplete(profile) && onProfileSetup) {
    return <Navigate to={getHomePath(profile)} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
