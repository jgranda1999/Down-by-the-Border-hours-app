import { supabase } from '@/lib/supabase'
import type { Profile, ProfileUpdate, UserRole } from '@/types'

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate,
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export interface ListProfilesOptions {
  role?: UserRole
  school?: string
  search?: string
}

function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[._@+-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function profileMatchesSearch(profile: Profile, rawSearch: string): boolean {
  const words = normalizeForSearch(rawSearch).split(' ').filter(Boolean)
  if (words.length === 0) return true

  const haystack = normalizeForSearch(
    [profile.first_name, profile.last_name, profile.email].join(' '),
  )

  return words.every((word) => haystack.includes(word))
}

export async function listProfiles(
  opts: ListProfilesOptions = {},
): Promise<Profile[]> {
  let query = supabase
    .from('profiles')
    .select('*')
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })

  if (opts.role) {
    query = query.eq('role', opts.role)
  }

  const { data, error } = await query

  if (error) throw error

  let profiles = data

  if (opts.school?.trim()) {
    const schoolNeedle = opts.school.trim().toLowerCase()
    profiles = profiles.filter((profile) =>
      profile.school?.toLowerCase().includes(schoolNeedle),
    )
  }

  if (opts.search?.trim()) {
    profiles = profiles.filter((profile) =>
      profileMatchesSearch(profile, opts.search!),
    )
  }

  return profiles
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export function formatProfileName(profile: Profile): string {
  const name = `${profile.first_name} ${profile.last_name}`.trim()
  return name || profile.email
}
