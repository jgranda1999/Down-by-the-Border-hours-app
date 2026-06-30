import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import ErrorState from '@/components/ui/ErrorState'
import Spinner from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { formatProfileName, listProfiles, updateUserRole } from '@/lib/api/profiles'
import { getErrorMessage } from '@/lib/utils/errors'
import { ADMIN_ROLE_LABEL } from '@/lib/utils/profile'
import type { Profile } from '@/types'

function ManageAdminsPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const data = await listProfiles()
      setUsers(data)
      setError(null)
    } catch {
      setError('Could not load users.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  const handleToggleRole = async (target: Profile) => {
    if (target.id === user?.id) {
      setActionError('You cannot change your own role here.')
      return
    }

    const nextRole = target.role === 'admin' ? 'volunteer' : 'admin'
    const actionLabel = nextRole === 'admin' ? 'promote to admin' : 'remove admin access'

    if (!window.confirm(`${actionLabel} for ${formatProfileName(target)}?`)) {
      return
    }

    try {
      setUpdatingId(target.id)
      setActionError(null)
      const updated = await updateUserRole(target.id, nextRole)
      setUsers((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
    } catch (toggleError) {
      setActionError(
        getErrorMessage(toggleError, 'Could not update this user\'s role.'),
      )
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return <Spinner label="Loading users" />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Manage admins</h1>
        <p className="mt-1 text-sm text-slate-600">
          Promote trusted staff to admin or remove admin access. New users must sign up
          first — then you can promote them here.
        </p>
      </div>

      {actionError ? <ErrorState message={actionError} /> : null}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 font-medium text-slate-700">Email</th>
                <th className="px-4 py-3 font-medium text-slate-700">Role</th>
                <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((profile) => {
                const isSelf = profile.id === user?.id

                return (
                  <tr key={profile.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatProfileName(profile)}
                      {isSelf ? (
                        <span className="ml-2 text-xs text-slate-500">(you)</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{profile.email}</td>
                    <td className="px-4 py-3 text-slate-900">
                      {profile.role === 'admin' ? ADMIN_ROLE_LABEL : 'Volunteer'}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="secondary"
                        disabled={isSelf}
                        isLoading={updatingId === profile.id}
                        onClick={() => void handleToggleRole(profile)}
                      >
                        {profile.role === 'admin' ? 'Remove admin' : 'Make admin'}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ManageAdminsPage
