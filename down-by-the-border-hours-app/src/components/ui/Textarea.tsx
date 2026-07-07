import type { TextareaHTMLAttributes } from 'react'
import { formControlBorderClass, formControlClassName } from '@/components/ui/formStyles'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? props.name

  return (
    <div className="space-y-1">
      <label htmlFor={textareaId} className="block text-sm font-medium text-brand-blue">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`${formControlClassName} ${formControlBorderClass(Boolean(error))} ${className}`}
        rows={3}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

export default Textarea
