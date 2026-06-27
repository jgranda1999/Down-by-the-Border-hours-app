import { Navigate, Route, Routes } from 'react-router-dom'
import AdminRoute from '@/components/layout/AdminRoute'
import AppLayout from '@/components/layout/AppLayout'
import GuestRoute from '@/components/layout/GuestRoute'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import VolunteerRoute from '@/components/layout/VolunteerRoute'
import Spinner from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { getHomePath, isProfileComplete } from '@/lib/utils/profile'
import AdminDashboardPage from '@/pages/admin/DashboardPage'
import LoginPage from '@/pages/auth/LoginPage'
import ProfileSetupPage from '@/pages/auth/ProfileSetupPage'
import SignupPage from '@/pages/auth/SignupPage'
import VolunteerDashboardPage from '@/pages/volunteer/DashboardPage'

function HomeRedirect() {
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

  return <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile/setup" element={<ProfileSetupPage />} />

        <Route element={<AppLayout />}>
          <Route element={<VolunteerRoute />}>
            <Route path="/dashboard" element={<VolunteerDashboardPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
