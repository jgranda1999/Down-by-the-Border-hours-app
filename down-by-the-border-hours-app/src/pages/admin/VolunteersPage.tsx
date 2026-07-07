import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Input from '@/components/ui/Input'
import PageHeader from '@/components/ui/PageHeader'
import TableSkeleton from '@/components/ui/TableSkeleton'
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
      <PageHeader
        title="Volunteers"
        description="Search students and view their full volunteer history."
      />

      <section className="rounded-xl border border-brand-border bg-white p-4 shadow-sm sm:p-6">
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
          <Button className="w-full sm:w-auto" onClick={() => void loadVolunteers()}>
            Apply filters
          </Button>
        </div>
      </section>

      {isLoading ? <TableSkeleton columns={4} /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!isLoading && volunteers.length === 0 ? (
        <EmptyState
          title="No volunteers found"
          description="Try a different search or check back after students sign up."
        />
      ) : null}

      {!isLoading && volunteers.length > 0 ? (
        <section className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-brand-border bg-brand-blue-light">
                <tr>
                  <th className="px-4 py-3 font-medium text-brand-blue">Name</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">Email</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">School</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td className="px-4 py-3 font-medium text-brand-ink">
                      {formatProfileName(volunteer)}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{volunteer.email}</td>
                    <td className="px-4 py-3 text-brand-muted">
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
