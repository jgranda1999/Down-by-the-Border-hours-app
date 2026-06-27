import { Navigate, Outlet } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import { useIsAdmin } from '@/hooks/useIsAdmin'

function VolunteerRoute() {
  const { isAdmin, isLoading } = useIsAdmin()

  if (isLoading) {
    return <Spinner label="Loading" />
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

export default VolunteerRoute
