import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import DashboardSkeleton from '@/components/ui/DashboardSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import PageHeader from '@/components/ui/PageHeader'
import { getAdminDashboardStats } from '@/lib/api/hourLogs'
import type { AdminDashboardStats } from '@/lib/api/hourLogs'
import { formatProfileName } from '@/lib/api/profiles'
import { formatDate } from '@/lib/utils/dates'
import { formatHours } from '@/lib/utils/hours'

function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true)
        const data = await getAdminDashboardStats()
        setStats(data)
        setError(null)
      } catch {
        setError('Could not load dashboard stats.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadStats()
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error || !stats) {
    return <ErrorState message={error ?? 'Dashboard unavailable.'} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin dashboard"
        description="Overview of volunteer activity across the nonprofit."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Total volunteers</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.volunteerCount}</p>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Hours this month</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {formatHours(stats.hoursThisMonth)}
          </p>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
          <Link to="/admin/logs">
            <Button variant="secondary">View all logs</Button>
          </Link>
        </div>

        {stats.recentLogs.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Hour logs will show up here when volunteers start logging."
          />
        ) : (
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
            {stats.recentLogs.map((log) => (
              <li key={log.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{log.event_name}</p>
                  <p className="text-sm text-slate-600">
                    {formatProfileName(log.volunteer)} · {formatDate(log.event_date)}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-900">
                  {formatHours(Number(log.hours))} hrs
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/volunteers">
          <Button variant="secondary">Volunteers</Button>
        </Link>
        <Link to="/admin/manage-admins">
          <Button variant="secondary">Manage admins</Button>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboardPage
