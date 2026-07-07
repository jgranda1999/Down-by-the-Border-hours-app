import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-brand-border-strong bg-white p-8 text-center">
      <h2 className="text-lg font-medium text-brand-blue">{title}</h2>
      <p className="mt-2 text-sm text-brand-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export default EmptyState
