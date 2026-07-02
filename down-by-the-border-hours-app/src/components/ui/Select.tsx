import type { SelectHTMLAttributes } from 'react'
import { formControlBorderClass, formControlClassName } from '@/components/ui/formStyles'

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
        className={`${formControlClassName} bg-white ${formControlBorderClass(Boolean(error))} ${className}`}
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
