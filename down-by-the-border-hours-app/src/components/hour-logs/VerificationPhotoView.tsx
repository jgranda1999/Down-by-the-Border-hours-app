import { useEffect, useState } from 'react'
import { getHourLogPhotoUrl } from '@/lib/api/hourLogPhotos'
import Skeleton from '@/components/ui/Skeleton'

interface VerificationPhotoViewProps {
  photoPath: string | null | undefined
  label?: string
  className?: string
  compact?: boolean
}

function VerificationPhotoView({
  photoPath,
  label = 'Verification photo',
  className = '',
  compact = false,
}: VerificationPhotoViewProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(photoPath))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!photoPath) {
      setUrl(null)
      setIsLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    const path = photoPath

    async function loadUrl() {
      try {
        setIsLoading(true)
        const signedUrl = await getHourLogPhotoUrl(path)
        if (cancelled) return
        if (!signedUrl) {
          setError('Could not load verification photo.')
          setUrl(null)
          return
        }
        setUrl(signedUrl)
        setError(null)
      } catch {
        if (!cancelled) {
          setError('Could not load verification photo.')
          setUrl(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadUrl()
    return () => {
      cancelled = true
    }
  }, [photoPath])

  if (!photoPath) {
    return (
      <span className={`text-sm text-brand-muted ${className}`}>No photo</span>
    )
  }

  if (isLoading) {
    return compact ? (
      <span className={`text-sm text-brand-muted ${className}`}>Loading…</span>
    ) : (
      <Skeleton className={`h-40 w-full max-w-xs rounded-lg ${className}`} />
    )
  }

  if (error || !url) {
    return <span className={`text-sm text-red-600 ${className}`}>{error ?? 'Unavailable'}</span>
  }

  if (compact) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-sm font-medium text-brand-blue underline hover:text-brand-blue-dark ${className}`}
      >
        View selfie
      </a>
    )
  }

  return (
    <div className={className}>
      <p className="mb-2 text-sm font-medium text-brand-body">{label}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block">
        <img
          src={url}
          alt="Volunteer event verification selfie"
          className="max-h-64 w-full max-w-xs rounded-lg border border-brand-border object-cover shadow-sm"
        />
      </a>
      <p className="mt-1 text-xs text-brand-muted">Tap to open full size</p>
    </div>
  )
}

export default VerificationPhotoView
