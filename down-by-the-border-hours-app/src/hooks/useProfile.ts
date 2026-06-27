import { useAuthContext } from '@/context/AuthProvider'

export function useProfile() {
  const { profile, isProfileLoading, profileError, refreshProfile } =
    useAuthContext()

  return {
    profile,
    isLoading: isProfileLoading,
    error: profileError,
    refreshProfile,
  }
}
