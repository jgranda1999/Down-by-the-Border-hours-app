import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? props.name

  return (
    <div className="space-y-1">
      <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${error ? 'border-red-500' : 'border-slate-300'} ${className}`}
        rows={3}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

export default Textarea
