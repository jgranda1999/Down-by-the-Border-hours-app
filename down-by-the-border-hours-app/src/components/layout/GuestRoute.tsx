import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { getHomePath, isProfileComplete } from '@/lib/utils/profile'

interface GuestRouteProps {
  children: ReactNode
}

function GuestRoute({ children }: GuestRouteProps) {
  const { session, isLoading: isAuthLoading } = useAuth()
  const { profile, isLoading: isProfileLoading } = useProfile()

  if (isAuthLoading || (session && isProfileLoading)) {
    return <Spinner label="Loading" />
  }

  if (session) {
    if (!isProfileComplete(profile)) {
      return <Navigate to="/profile/setup" replace />
    }

    return <Navigate to={getHomePath(profile)} replace />
  }

  return children
}

export default GuestRoute
