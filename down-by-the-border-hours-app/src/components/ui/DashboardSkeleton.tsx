import Skeleton from '@/components/ui/Skeleton'

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-4 h-10 w-32" />
        <Skeleton className="mt-6 h-11 w-28" />
      </section>

      <section className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-12" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default DashboardSkeleton
