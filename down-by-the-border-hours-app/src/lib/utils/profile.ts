import type { Profile } from '@/types'

export function getHomePath(profile: Profile | null): '/admin' | '/dashboard' {
  return profile?.role === 'admin' ? '/admin' : '/dashboard'
}

export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false

  return Boolean(
    profile.phone?.trim() &&
      profile.school?.trim() &&
      profile.parent_name?.trim() &&
      profile.parent_phone?.trim() &&
      profile.parent_email?.trim(),
  )
}

export const SUGGESTED_SCHOOLS = [
  'Veterans High School',
  'SJA',
  'Porter',
  'Hanna',
  'Pace',
  'Rivera',
  'Jubilee',
  'IDEA',
  'Harmony',
  'UTRGV',
] as const
