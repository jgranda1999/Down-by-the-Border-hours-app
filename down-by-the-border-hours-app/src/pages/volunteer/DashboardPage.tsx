import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import DashboardSkeleton from '@/components/ui/DashboardSkeleton'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { listHourLogsForVolunteer, sumHours } from '@/lib/api/hourLogs'
import { formatDate } from '@/lib/utils/dates'
import { formatHours } from '@/lib/utils/hours'
import type { HourLog } from '@/types'

function VolunteerDashboardPage() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [logs, setLogs] = useState<HourLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    async function loadLogs() {
      try {
        setIsLoading(true)
        const data = await listHourLogsForVolunteer(user!.id)
        setLogs(data)
        setError(null)
      } catch {
        setError('Could not load your hours. Try refreshing.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadLogs()
  }, [user])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const recentLogs = logs.slice(0, 5)
  const totalHours = sumHours(logs)

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Hey, {profile?.first_name || 'volunteer'}!
        </h1>
        <p className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
          {formatHours(totalHours)} <span className="text-lg font-normal text-slate-600">total hours</span>
        </p>
        <div className="mt-6">
          <Link to="/hours/log">
            <Button>Log hours</Button>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
          {logs.length > 0 ? (
            <Link to="/hours" className="text-sm font-medium text-slate-700 underline">
              View all
            </Link>
          ) : null}
        </div>

        {recentLogs.length === 0 ? (
          <EmptyState
            title="No hours logged yet"
            description="After your first event, log your hours here so your school can see them."
            action={
              <Link to="/hours/log">
                <Button>Log your first hours</Button>
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{log.event_name}</p>
                  <p className="text-sm text-slate-600">{formatDate(log.event_date)}</p>
                </div>
                <p className="text-sm font-medium text-slate-900">
                  {formatHours(Number(log.hours))} hrs
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default VolunteerDashboardPage
