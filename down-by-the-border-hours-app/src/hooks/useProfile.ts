import { useAuthContext } from '@/context/AuthProvider'

export function useProfile() {
  const { profile, isProfileLoading, profileError, refreshProfile, applyProfileUpdate } =
    useAuthContext()

  return {
    profile,
    isLoading: isProfileLoading,
    error: profileError,
    refreshProfile,
    applyProfileUpdate,
  }
}
