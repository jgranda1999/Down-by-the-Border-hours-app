import { Navigate, Outlet } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import { useIsAdmin } from '@/hooks/useIsAdmin'

function AdminRoute() {
  const { isAdmin, isLoading } = useIsAdmin()

  if (isLoading) {
    return <Spinner label="Checking permissions" />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute
