import { useProfile } from '@/hooks/useProfile'

export function useIsAdmin() {
  const { profile, isLoading } = useProfile()

  return {
    isAdmin: profile?.role === 'admin',
    isLoading,
  }
}
