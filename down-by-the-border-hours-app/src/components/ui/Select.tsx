import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

function Select({ label, error, id, options, className = '', ...props }: SelectProps) {
  const selectId = id ?? props.name

  return (
    <div className="space-y-1">
      <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={selectId}
        className={`block w-full min-h-11 rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${error ? 'border-red-500' : 'border-slate-300'} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

export default Select
