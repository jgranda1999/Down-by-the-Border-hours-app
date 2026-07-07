import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ServiceHourLetterPanel from '@/components/admin/ServiceHourLetterPanel'
import Button from '@/components/ui/Button'
import ErrorState from '@/components/ui/ErrorState'
import PageHeader from '@/components/ui/PageHeader'
import Skeleton from '@/components/ui/Skeleton'
import TableSkeleton from '@/components/ui/TableSkeleton'
import { listHourLogsForVolunteer, sumHours } from '@/lib/api/hourLogs'
import { formatProfileName, getProfile } from '@/lib/api/profiles'
import { formatDate, formatTime } from '@/lib/utils/dates'
import { formatHours } from '@/lib/utils/hours'
import type { HourLog, Profile } from '@/types'

function VolunteerDetailPage() {
  const { volunteerId } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [logs, setLogs] = useState<HourLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!volunteerId) return

    async function loadVolunteer() {
      try {
        setIsLoading(true)
        const [profileData, logsData] = await Promise.all([
          getProfile(volunteerId!),
          listHourLogsForVolunteer(volunteerId!),
        ])
        setProfile(profileData)
        setLogs(logsData)
        setError(null)
      } catch {
        setError('Could not load this volunteer.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadVolunteer()
  }, [volunteerId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <section className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
          <Skeleton className="h-6 w-24" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </section>
        <TableSkeleton columns={4} />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="space-y-4">
        <ErrorState message={error ?? 'Volunteer not found.'} />
        <Link to="/admin/volunteers">
          <Button variant="secondary">Back to volunteers</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={formatProfileName(profile)}
        description={profile.email}
        action={
          <Link to="/admin/volunteers">
            <Button variant="secondary" className="w-full sm:w-auto">
              Back
            </Button>
          </Link>
        }
      />

      <section className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-blue">Profile</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-brand-muted">School</dt>
            <dd className="font-medium text-brand-ink">{profile.school ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-brand-muted">Phone</dt>
            <dd className="font-medium text-brand-ink">{profile.phone ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-brand-muted">Parent / guardian</dt>
            <dd className="font-medium text-brand-ink">{profile.parent_name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-brand-muted">Parent contact</dt>
            <dd className="font-medium text-brand-ink">
              {profile.parent_phone ?? '—'}
              {profile.parent_email ? ` · ${profile.parent_email}` : ''}
            </dd>
          </div>
        </dl>
      </section>

      <ServiceHourLetterPanel volunteer={profile} logs={logs} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-brand-blue">Hour history</h2>
          <p className="text-sm text-brand-muted">
            {formatHours(sumHours(logs))} total hours
          </p>
        </div>

        {logs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-brand-border-strong bg-white p-6 text-sm text-brand-muted">
            This volunteer hasn&apos;t logged any hours yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-brand-border bg-brand-blue-light">
                  <tr>
                    <th className="px-4 py-3 font-medium text-brand-blue">Date</th>
                    <th className="px-4 py-3 font-medium text-brand-blue">Event</th>
                    <th className="px-4 py-3 font-medium text-brand-blue">Time</th>
                    <th className="px-4 py-3 font-medium text-brand-blue">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-3 text-brand-ink">{formatDate(log.event_date)}</td>
                      <td className="px-4 py-3 text-brand-ink">{log.event_name}</td>
                      <td className="px-4 py-3 text-brand-muted">
                        {formatTime(log.sign_in_time)} –{' '}
                        {log.sign_out_time ? formatTime(log.sign_out_time) : '—'}
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-ink">
                        {formatHours(Number(log.hours))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default VolunteerDetailPage
