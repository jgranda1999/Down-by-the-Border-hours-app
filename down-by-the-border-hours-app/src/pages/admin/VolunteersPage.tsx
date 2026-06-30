import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import { formatProfileName, listProfiles } from '@/lib/api/profiles'
import type { Profile } from '@/types'

function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [school, setSchool] = useState('')

  const loadVolunteers = async () => {
    try {
      setIsLoading(true)
      const data = await listProfiles({
        role: 'volunteer',
        search: search || undefined,
        school: school || undefined,
      })
      setVolunteers(data)
      setError(null)
    } catch {
      setError('Could not load volunteers.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadVolunteers()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Volunteers</h1>
        <p className="mt-1 text-sm text-slate-600">
          Search students and view their full volunteer history.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Search"
            placeholder="Name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Input
            label="School"
            placeholder="Filter by school"
            value={school}
            onChange={(event) => setSchool(event.target.value)}
          />
        </div>
        <div className="mt-4">
          <Button onClick={() => void loadVolunteers()}>Apply filters</Button>
        </div>
      </section>

      {isLoading ? <Spinner label="Loading volunteers" /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!isLoading && volunteers.length === 0 ? (
        <EmptyState
          title="No volunteers found"
          description="Try a different search or check back after students sign up."
        />
      ) : null}

      {!isLoading && volunteers.length > 0 ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Email</th>
                  <th className="px-4 py-3 font-medium text-slate-700">School</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatProfileName(volunteer)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{volunteer.email}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {volunteer.school ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/volunteers/${volunteer.id}`}>
                        <Button variant="secondary">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default VolunteersPage
