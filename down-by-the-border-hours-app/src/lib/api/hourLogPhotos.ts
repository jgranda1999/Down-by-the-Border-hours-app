import { supabase } from '@/lib/supabase'

export const HOUR_LOG_PHOTOS_BUCKET = 'hour-log-photos'
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const ALLOWED_PHOTO_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])

export function getPhotoExtension(file: File): string {
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return 'jpg'
}

export function buildHourLogPhotoPath(
  volunteerId: string,
  logId: string,
  file: File,
): string {
  return `${volunteerId}/${logId}.${getPhotoExtension(file)}`
}

export function validateHourLogPhoto(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
    return 'Please take a photo using your camera (JPEG or PNG).'
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'Photo must be 5 MB or smaller.'
  }
  return null
}

export async function uploadHourLogPhoto(
  volunteerId: string,
  logId: string,
  file: File,
): Promise<string> {
  const validationError = validateHourLogPhoto(file)
  if (validationError) {
    throw new Error(validationError)
  }

  const path = buildHourLogPhotoPath(volunteerId, logId, file)
  const { error } = await supabase.storage.from(HOUR_LOG_PHOTOS_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || 'image/jpeg',
  })

  if (error) throw error
  return path
}

export async function getHourLogPhotoUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(HOUR_LOG_PHOTOS_BUCKET)
    .createSignedUrl(path, 3600)

  if (error || !data?.signedUrl) return null
  return data.signedUrl
}

export async function deleteHourLogPhoto(path: string): Promise<void> {
  const { error } = await supabase.storage.from(HOUR_LOG_PHOTOS_BUCKET).remove([path])
  if (error) throw error
}
