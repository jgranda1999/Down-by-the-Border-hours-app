import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getProfile } from '@/lib/api/profiles'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export interface SignUpResult {
  needsEmailConfirmation: boolean
  email: string
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isProfileLoading: boolean
  profileError: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<SignUpResult>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  applyProfileUpdate: (profile: Profile) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<Error | null>(null)

  const loadProfile = useCallback(async (userId: string) => {
    setIsProfileLoading(true)
    setProfileError(null)

    try {
      const data = await getProfile(userId)
      setProfile(data)
    } catch (error) {
      setProfile(null)
      setProfileError(
        error instanceof Error ? error : new Error('Failed to load profile'),
      )
    } finally {
      setIsProfileLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return
    }

    await loadProfile(user.id)
  }, [loadProfile, user])

  const applyProfileUpdate = useCallback((nextProfile: Profile) => {
    setProfile(nextProfile)
    setProfileError(null)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      const { data, error } = await supabase.auth.getSession()

      if (!isMounted) return

      if (error) {
        setSession(null)
        setUser(null)
        setProfile(null)
        setIsLoading(false)
        return
      }

      const nextSession = data.session
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setIsLoading(false)

      if (nextSession?.user) {
        await loadProfile(nextSession.user.id)
      }
    }

    void initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)

      if (nextSession?.user) {
        void loadProfile(nextSession.user.id)
      } else {
        setProfile(null)
        setProfileError(null)
        setIsProfileLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [loadProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (error) throw error

      return {
        needsEmailConfirmation: !data.session,
        email,
      }
    },
    [],
  )

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isLoading,
      isProfileLoading,
      profileError,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      applyProfileUpdate,
    }),
    [
      session,
      user,
      profile,
      isLoading,
      isProfileLoading,
      profileError,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      applyProfileUpdate,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
