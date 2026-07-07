import { useEffect, type ReactNode } from 'react'
import Button from '@/components/ui/Button'

interface ModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
  closeLabel?: string
}

function Modal({
  isOpen,
  title,
  children,
  onClose,
  closeLabel = 'Got it',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-brand-ink/50" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md rounded-xl border border-brand-border bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="modal-title" className="text-xl font-semibold text-brand-ink">
          {title}
        </h2>
        <div className="mt-3 text-sm text-brand-muted">{children}</div>
        <div className="mt-6">
          <Button className="w-full" onClick={onClose}>
            {closeLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Modal
