import logoUrl from '@/assets/down_by_the_logo.png'

export const BRAND_NAME = 'Down By The Border'
export const BRAND_TAGLINE = 'My Heart Lies in the Hands of a Very Special Child'
export const BRAND_LOGO_SRC = logoUrl

/** Shared Google Drive folder for volunteer event photos (optional). */
export const EVENT_PHOTOS_DRIVE_URL =
  import.meta.env.VITE_EVENT_PHOTOS_DRIVE_URL?.trim() ?? ''

/** Matches downbytheborder.org brand colors */
export const BRAND_COLORS = {
  primary: '#EAD01D',
  primaryDark: '#D4BC1A',
  primaryLight: '#F6EFD9',
  blue: '#1D3776',
  blueDark: '#152A5C',
  blueLight: '#E8EDF7',
  bluePale: '#F0F4FA',
  ink: '#000000',
  heading: '#958F78',
  body: '#1A1A1A',
  muted: '#576275',
  subtle: '#999999',
  surface: '#F4F4F4',
  border: '#E0E0E0',
} as const
