import Skeleton from '@/components/ui/Skeleton'

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

function TableSkeleton({ rows = 6, columns = 5 }: TableSkeletonProps) {
  return (
    <section
      className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm"
      aria-busy="true"
      aria-label="Loading table"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-brand-border bg-brand-blue-light">
            <tr>
              {Array.from({ length: columns }, (_, index) => (
                <th key={index} className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }, (_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-full max-w-[8rem]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TableSkeleton
