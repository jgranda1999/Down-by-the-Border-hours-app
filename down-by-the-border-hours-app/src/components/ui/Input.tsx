import { useId, useMemo, useState, type InputHTMLAttributes } from 'react'
import { formControlBorderClass, formControlClassName } from '@/components/ui/formStyles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

function Input({ label, error, id, className = '', ...props }: InputProps) {
  const reactId = useId()
  const inputId = id ?? props.name ?? reactId

  const isPassword = props.type === 'password'
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const resolvedType = useMemo(() => {
    if (!isPassword) return props.type
    return isPasswordVisible ? 'text' : 'password'
  }, [isPassword, isPasswordVisible, props.type])

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-brand-blue">
        {label}
      </label>
      <div className={isPassword ? 'relative' : undefined}>
        <input
          id={inputId}
          className={`${formControlClassName} ${formControlBorderClass(Boolean(error))} ${isPassword ? 'pr-14' : ''} ${className}`}
          {...props}
          type={resolvedType}
        />
        {isPassword ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 inline-flex min-h-9 -translate-y-1/2 items-center rounded-md px-3 text-sm font-medium text-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsPasswordVisible((current) => !current)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? 'Hide' : 'Show'}
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

export default Input
