import { useAuthContext } from '@/context/AuthProvider'

export function useAuth() {
  const { session, user, isLoading, signIn, signUp, signOut } = useAuthContext()

  return {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  }
}
