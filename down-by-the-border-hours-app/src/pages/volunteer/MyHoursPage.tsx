import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Spinner from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { deleteHourLog, listHourLogsForVolunteer, sumHours } from '@/lib/api/hourLogs'
import { formatDate, formatTime } from '@/lib/utils/dates'
import { canEditLog, formatHours } from '@/lib/utils/hours'
import type { HourLog } from '@/types'

type SortDirection = 'asc' | 'desc'

function MyHoursPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<HourLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadLogs = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const data = await listHourLogsForVolunteer(user.id)
      setLogs(data)
      setError(null)
    } catch {
      setError('Could not load your hours. Try refreshing.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadLogs()
  }, [user])

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => {
      const comparison = a.event_date.localeCompare(b.event_date)
      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [logs, sortDirection])

  const handleDelete = async (log: HourLog) => {
    if (!canEditLog(log)) return
    if (!window.confirm('Delete this hour log? This cannot be undone.')) return

    try {
      setDeletingId(log.id)
      await deleteHourLog(log.id)
      setLogs((current) => current.filter((item) => item.id !== log.id))
    } catch {
      setError('Could not delete that log. It may be older than 24 hours.')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <Spinner label="Loading your hours" />
  }

  if (error && logs.length === 0) {
    return <ErrorState message={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My hours</h1>
          <p className="mt-1 text-sm text-slate-600">
            {formatHours(sumHours(logs))} total hours logged
          </p>
        </div>
        <Link to="/hours/log">
          <Button>Log hours</Button>
        </Link>
      </div>

      {error ? <ErrorState message={error} /> : null}

      {sortedLogs.length === 0 ? (
        <EmptyState
          title="No hours yet"
          description="Once you log hours for an event, they'll show up here."
          action={
            <Link to="/hours/log">
              <Button>Log hours</Button>
            </Link>
          }
        />
      ) : (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1"
                      onClick={() =>
                        setSortDirection((current) =>
                          current === 'desc' ? 'asc' : 'desc',
                        )
                      }
                    >
                      Date
                      <span className="text-xs text-slate-500">
                        {sortDirection === 'desc' ? '↓' : '↑'}
                      </span>
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-700">Event</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Time</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Hours</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedLogs.map((log) => {
                  const editable = canEditLog(log)

                  return (
                    <tr key={log.id}>
                      <td className="px-4 py-3 text-slate-900">{formatDate(log.event_date)}</td>
                      <td className="px-4 py-3 text-slate-900">{log.event_name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatTime(log.sign_in_time)} – {log.sign_out_time ? formatTime(log.sign_out_time) : '—'}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {formatHours(Number(log.hours))}
                      </td>
                      <td className="px-4 py-3">
                        {editable ? (
                          <div className="flex flex-wrap gap-2">
                            <Link to={`/hours/${log.id}/edit`}>
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
                        ) : (
                          <span className="text-xs text-slate-500">Locked</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default MyHoursPage
