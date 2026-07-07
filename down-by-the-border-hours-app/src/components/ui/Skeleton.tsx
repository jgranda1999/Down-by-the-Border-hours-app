interface SkeletonProps {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-brand-border ${className}`} aria-hidden="true" />
}

export default Skeleton
