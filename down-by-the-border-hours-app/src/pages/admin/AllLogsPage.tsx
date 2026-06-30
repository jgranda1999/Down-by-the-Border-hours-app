import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import { deleteHourLog, listHourLogs } from '@/lib/api/hourLogs'
import { formatProfileName, listProfiles } from '@/lib/api/profiles'
import { downloadHourLogsCsv } from '@/lib/utils/csv'
import { formatDate, formatTime } from '@/lib/utils/dates'
import { formatHours } from '@/lib/utils/hours'
import type { HourLogWithVolunteer, Profile } from '@/types'

function AllLogsPage() {
  const [logs, setLogs] = useState<HourLogWithVolunteer[]>([])
  const [volunteers, setVolunteers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [volunteerId, setVolunteerId] = useState('')
  const [school, setSchool] = useState('')
  const [eventSearch, setEventSearch] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const volunteerOptions = useMemo(
    () => [
      { value: '', label: 'All volunteers' },
      ...volunteers.map((volunteer) => ({
        value: volunteer.id,
        label: formatProfileName(volunteer),
      })),
    ],
    [volunteers],
  )

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [logsData, volunteerData] = await Promise.all([
        listHourLogs({
          volunteerId: volunteerId || undefined,
          school: school || undefined,
          eventSearch: eventSearch || undefined,
          from: from || undefined,
          to: to || undefined,
        }),
        listProfiles({ role: 'volunteer' }),
      ])
      setLogs(logsData)
      setVolunteers(volunteerData)
      setError(null)
    } catch {
      setError('Could not load logs.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const handleApplyFilters = () => {
    void loadData()
  }

  const handleDelete = async (log: HourLogWithVolunteer) => {
    if (!window.confirm(`Delete this log for ${formatProfileName(log.volunteer)}?`)) {
      return
    }

    try {
      setDeletingId(log.id)
      await deleteHourLog(log.id)
      setLogs((current) => current.filter((item) => item.id !== log.id))
    } catch {
      setError('Could not delete that log.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">All logs</h1>
        <p className="mt-1 text-sm text-slate-600">
          View and manage volunteer hours across every school and event.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="volunteer-filter" className="block text-sm font-medium text-slate-700">
              Volunteer
            </label>
            <select
              id="volunteer-filter"
              className="block w-full min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              value={volunteerId}
              onChange={(event) => setVolunteerId(event.target.value)}
            >
              {volunteerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="School"
            placeholder="Filter by school"
            value={school}
            onChange={(event) => setSchool(event.target.value)}
          />
          <Input
            label="Event search"
            placeholder="Search event name"
            value={eventSearch}
            onChange={(event) => setEventSearch(event.target.value)}
          />
          <Input
            label="From date"
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
          <Input
            label="To date"
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleApplyFilters}>Apply filters</Button>
          <Button
            variant="secondary"
            disabled={isLoading || logs.length === 0}
            onClick={() => downloadHourLogsCsv(logs)}
          >
            Export CSV
          </Button>
        </div>
      </section>

      {isLoading ? <Spinner label="Loading logs" /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!isLoading && logs.length === 0 ? (
        <EmptyState
          title="No logs match"
          description="Try adjusting your filters or check back after volunteers log hours."
        />
      ) : null}

      {!isLoading && logs.length > 0 ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Date</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Volunteer</th>
                  <th className="px-4 py-3 font-medium text-slate-700">School</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Event</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Time</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Hours</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 text-slate-900">{formatDate(log.event_date)}</td>
                    <td className="px-4 py-3 text-slate-900">
                      <Link
                        to={`/admin/volunteers/${log.volunteer_id}`}
                        className="underline"
                      >
                        {formatProfileName(log.volunteer)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {log.volunteer.school ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-900">{log.event_name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatTime(log.sign_in_time)} –{' '}
                      {log.sign_out_time ? formatTime(log.sign_out_time) : '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatHours(Number(log.hours))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/admin/logs/${log.id}/edit`}>
                          <Button variant="secondary">Edit</Button>
                        </Link>
                        <Button
                          variant="ghost"
                          isLoading={deletingId === log.id}
                          onClick={() => void handleDelete(log)}
                        >
                          Delete
                        </Button>
                      </div>
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

export default AllLogsPage
