import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400',
  secondary:
    'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 disabled:bg-slate-100',
  ghost: 'text-slate-700 hover:bg-slate-100 disabled:text-slate-400',
}

function Button({
  variant = 'primary',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading…' : children}
    </button>
  )
}

export default Button
