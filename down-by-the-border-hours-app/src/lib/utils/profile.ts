import type { Profile } from '@/types'

export const SCHOOL_NOT_APPLICABLE = 'Not applicable'

export function getHomePath(profile: Profile | null): '/admin' | '/dashboard' {
  return profile?.role === 'admin' ? '/admin' : '/dashboard'
}

export function isAdminProfile(profile: Profile | null): boolean {
  return profile?.role === 'admin'
}

export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false

  return Boolean(profile.phone?.trim() && profile.school?.trim())
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

export const SCHOOL_DATALIST_OPTIONS = [
  SCHOOL_NOT_APPLICABLE,
  ...SUGGESTED_SCHOOLS,
] as const

export const ADMIN_ROLE_LABEL = 'Admin'
