interface SpinnerProps {
  label?: string
}

function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-slate-600">{label}…</p>
    </div>
  )
}

export default Spinner
