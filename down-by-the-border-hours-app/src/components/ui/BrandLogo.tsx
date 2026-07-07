import { BRAND_LOGO_SRC, BRAND_NAME } from '@/lib/brand'

interface BrandLogoProps {
  className?: string
  imageClassName?: string
  showName?: boolean
  nameClassName?: string
}

function BrandLogo({
  className = '',
  imageClassName = 'h-10 w-auto',
  showName = true,
  nameClassName = 'text-lg font-semibold text-brand-blue',
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={BRAND_LOGO_SRC}
        alt=""
        className={imageClassName}
        aria-hidden="true"
      />
      {showName ? <span className={nameClassName}>{BRAND_NAME}</span> : null}
    </span>
  )
}

export default BrandLogo
