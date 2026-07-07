import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-brand-blue hover:bg-brand-primary-dark disabled:bg-brand-subtle disabled:text-white',
  secondary:
    'border border-brand-blue bg-white text-brand-blue hover:bg-brand-blue-light disabled:bg-brand-surface',
  ghost: 'text-brand-blue hover:bg-brand-blue-light disabled:text-brand-subtle',
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
