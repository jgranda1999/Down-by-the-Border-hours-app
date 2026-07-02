import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Input from '@/components/ui/Input'
import PageHeader from '@/components/ui/PageHeader'
import TableSkeleton from '@/components/ui/TableSkeleton'
import { useAuth } from '@/hooks/useAuth'
import { formatProfileName, listProfiles, updateUserRole } from '@/lib/api/profiles'
import { appToast } from '@/lib/toast'
import { getErrorMessage } from '@/lib/utils/errors'
import { ADMIN_ROLE_LABEL } from '@/lib/utils/profile'
import type { Profile } from '@/types'

function ManageAdminsPage() {
  const { user } = useAuth()
  const [admins, setAdmins] = useState<Profile[]>([])
  const [volunteerResults, setVolunteerResults] = useState<Profile[]>([])
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadAdmins = async () => {
    try {
      setIsLoadingAdmins(true)
      const data = await listProfiles({ role: 'admin' })
      setAdmins(data)
      setError(null)
    } catch {
      setError('Could not load admins.')
    } finally {
      setIsLoadingAdmins(false)
    }
  }

  useEffect(() => {
    void loadAdmins()
  }, [])

  const searchVolunteers = async () => {
    const query = search.trim()
    if (!query) {
      setVolunteerResults([])
      setHasSearched(false)
      return
    }

    try {
      setIsSearching(true)
      setHasSearched(true)
      const data = await listProfiles({ role: 'volunteer', search: query })
      setVolunteerResults(data)
    } catch {
      appToast.error('Could not search volunteers.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleDemote = async (target: Profile) => {
    if (target.id === user?.id) {
      appToast.error('You cannot change your own role here.')
      return
    }

    if (
      !window.confirm(`Remove admin access for ${formatProfileName(target)}?`)
    ) {
      return
    }

    try {
      setUpdatingId(target.id)
      await updateUserRole(target.id, 'volunteer')
      setAdmins((current) => current.filter((item) => item.id !== target.id))
      appToast.success('Admin access removed.')
    } catch (demoteError) {
      appToast.error(
        getErrorMessage(demoteError, 'Could not update this user\'s role.'),
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handlePromote = async (target: Profile) => {
    if (
      !window.confirm(`Promote ${formatProfileName(target)} to admin?`)
    ) {
      return
    }

    try {
      setUpdatingId(target.id)
      const updated = await updateUserRole(target.id, 'admin')
      setAdmins((current) =>
        [...current, updated].sort((a, b) =>
          `${a.last_name} ${a.first_name}`.localeCompare(
            `${b.last_name} ${b.first_name}`,
          ),
        ),
      )
      setVolunteerResults((current) =>
        current.filter((item) => item.id !== target.id),
      )
      appToast.success(`${formatProfileName(updated)} is now an admin.`)
    } catch (promoteError) {
      appToast.error(
        getErrorMessage(promoteError, 'Could not update this user\'s role.'),
      )
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoadingAdmins) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Manage admins</h1>
        </div>
        <TableSkeleton columns={4} rows={3} />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage admins"
        description="View current admins and promote trusted volunteers. New users must sign up first — then you can search for them below."
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-slate-900">Current admins</h2>
          <p className="mt-1 text-sm text-slate-600">
            {admins.length === 1
              ? '1 admin account'
              : `${admins.length} admin accounts`}
          </p>
        </div>

        {admins.length === 0 ? (
          <EmptyState
            title="No admins found"
            description="Promote a volunteer below to give them admin access."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Email</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Role</th>
                    <th className="px-4 py-3 font-medium text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {admins.map((profile) => {
                    const isSelf = profile.id === user?.id

                    return (
                      <tr key={profile.id}>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {formatProfileName(profile)}
                          {isSelf ? (
                            <span className="ml-2 text-xs text-slate-500">
                              (you)
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {profile.email}
                        </td>
                        <td className="px-4 py-3 text-slate-900">
                          {ADMIN_ROLE_LABEL}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="secondary"
                            disabled={isSelf}
                            isLoading={updatingId === profile.id}
                            onClick={() => void handleDemote(profile)}
                          >
                            Remove admin
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-slate-900">
            Promote a volunteer
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Search by name or email to find someone to make an admin.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <form
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
            onSubmit={(event) => {
              event.preventDefault()
              void searchVolunteers()
            }}
          >
            <div className="flex-1">
              <Input
                label="Search volunteers"
                placeholder="Name or email"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto" isLoading={isSearching}>
              Search
            </Button>
          </form>
        </div>

        {isSearching ? <TableSkeleton columns={4} rows={2} /> : null}

        {!isSearching && !hasSearched ? (
          <EmptyState
            title="Search for a volunteer"
            description="Enter a name or email above to find someone to promote."
          />
        ) : null}

        {!isSearching && hasSearched && volunteerResults.length === 0 ? (
          <EmptyState
            title="No volunteers found"
            description="Try a different name or email, or ask them to sign up first."
          />
        ) : null}

        {!isSearching && volunteerResults.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Email</th>
                    <th className="px-4 py-3 font-medium text-slate-700">
                      School
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {volunteerResults.map((profile) => (
                    <tr key={profile.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {formatProfileName(profile)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {profile.email}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {profile.school ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          isLoading={updatingId === profile.id}
                          onClick={() => void handlePromote(profile)}
                        >
                          Make admin
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default ManageAdminsPage
