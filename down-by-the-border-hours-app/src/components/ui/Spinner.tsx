interface SpinnerProps {
  label?: string
}

function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-brand-blue-light border-t-brand-blue"
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-brand-muted">{label}…</p>
    </div>
  )
}

export default Spinner
