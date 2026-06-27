import { useProfile } from '@/hooks/useProfile'

function VolunteerDashboardPage() {
  const { profile } = useProfile()

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Hey, {profile?.first_name || 'volunteer'}!
        </h1>
        <p className="mt-2 text-slate-600">
          Your dashboard is ready. Hour logging comes in Phase 3.
        </p>
      </section>
    </div>
  )
}

export default VolunteerDashboardPage
