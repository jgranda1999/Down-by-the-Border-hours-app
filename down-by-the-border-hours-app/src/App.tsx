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
import AdminEditLogPage from '@/pages/admin/AdminEditLogPage'
import AllLogsPage from '@/pages/admin/AllLogsPage'
import AdminDashboardPage from '@/pages/admin/DashboardPage'
import ManageAdminsPage from '@/pages/admin/ManageAdminsPage'
import VolunteerDetailPage from '@/pages/admin/VolunteerDetailPage'
import VolunteersPage from '@/pages/admin/VolunteersPage'
import LoginPage from '@/pages/auth/LoginPage'
import ProfileSetupPage from '@/pages/auth/ProfileSetupPage'
import SignupPage from '@/pages/auth/SignupPage'
import ProfilePage from '@/pages/shared/ProfilePage'
import EditLogPage from '@/pages/volunteer/EditLogPage'
import LogHoursPage from '@/pages/volunteer/LogHoursPage'
import MyHoursPage from '@/pages/volunteer/MyHoursPage'
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
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<VolunteerRoute />}>
            <Route path="/dashboard" element={<VolunteerDashboardPage />} />
            <Route path="/hours/log" element={<LogHoursPage />} />
            <Route path="/hours" element={<MyHoursPage />} />
            <Route path="/hours/:logId/edit" element={<EditLogPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/logs" element={<AllLogsPage />} />
            <Route path="/admin/logs/:logId/edit" element={<AdminEditLogPage />} />
            <Route path="/admin/volunteers" element={<VolunteersPage />} />
            <Route path="/admin/volunteers/:volunteerId" element={<VolunteerDetailPage />} />
            <Route path="/admin/manage-admins" element={<ManageAdminsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
