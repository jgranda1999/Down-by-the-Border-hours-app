import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import VerificationPhotoView from '@/components/hour-logs/VerificationPhotoView'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Input from '@/components/ui/Input'
import PageHeader from '@/components/ui/PageHeader'
import TableSkeleton from '@/components/ui/TableSkeleton'
import { formControlClassName, formControlBorderClass } from '@/components/ui/formStyles'
import { deleteHourLog, listHourLogs } from '@/lib/api/hourLogs'
import { formatProfileName, listProfiles } from '@/lib/api/profiles'
import { downloadHourLogsCsv } from '@/lib/utils/csv'
import { appToast } from '@/lib/toast'
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
      appToast.success('Log deleted.')
    } catch {
      appToast.error('Could not delete that log.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="All logs"
        description="View and manage volunteer hours across every school and event."
      />

      <section className="rounded-xl border border-brand-border bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="volunteer-filter" className="block text-sm font-medium text-brand-blue">
              Volunteer
            </label>
            <select
              id="volunteer-filter"
              className={`${formControlClassName} bg-white ${formControlBorderClass()}`}
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
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button className="w-full sm:w-auto" onClick={handleApplyFilters}>
            Apply filters
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="secondary"
            disabled={isLoading || logs.length === 0}
            onClick={() => {
              downloadHourLogsCsv(logs)
              appToast.success('CSV downloaded.')
            }}
          >
            Export CSV
          </Button>
        </div>
      </section>

      {isLoading ? <TableSkeleton columns={7} /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!isLoading && logs.length === 0 ? (
        <EmptyState
          title="No logs match"
          description="Try adjusting your filters or check back after volunteers log hours."
        />
      ) : null}

      {!isLoading && logs.length > 0 ? (
        <section className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-brand-border bg-brand-blue-light">
                <tr>
                  <th className="px-4 py-3 font-medium text-brand-blue">Date</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">Volunteer</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">School</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">Event</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">Time</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">Hours</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">Photo</th>
                  <th className="px-4 py-3 font-medium text-brand-blue">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 text-brand-ink">{formatDate(log.event_date)}</td>
                    <td className="px-4 py-3 text-brand-ink">
                      <Link
                        to={`/admin/volunteers/${log.volunteer_id}`}
                        className="font-medium text-brand-blue underline hover:text-brand-blue-dark"
                      >
                        {formatProfileName(log.volunteer)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {log.volunteer.school ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-brand-ink">{log.event_name}</td>
                    <td className="px-4 py-3 text-brand-muted">
                      {formatTime(log.sign_in_time)} –{' '}
                      {log.sign_out_time ? formatTime(log.sign_out_time) : '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-ink">
                      {formatHours(Number(log.hours))}
                    </td>
                    <td className="px-4 py-3">
                      <VerificationPhotoView
                        photoPath={log.verification_photo_path}
                        compact
                      />
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
