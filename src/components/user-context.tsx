import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/integrations/supabase/client"
import { User as SupabaseUser, Session } from '@supabase/supabase-js'

export type UserRole = "reader" | "writer" | "admin"

export interface Profile {
  id: string
  user_id: string
  username: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  role: UserRole
  status: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  profile: Profile | null
}

interface UserContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, role?: UserRole) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  createProfile: (role: UserRole) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return
        
        console.log('Auth state changed:', event, session?.user?.id)
        setSession(session)
        
        if (session?.user) {
          // Fetch user profile asynchronously without blocking
          setTimeout(async () => {
            if (!mounted) return
            
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single()

              if (!mounted) return

              if (error) {
                console.log('Profile fetch error:', error)
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  profile: null
                })
              } else {
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  profile
                })
              }
            } catch (error) {
              console.error('Profile fetch failed:', error)
              if (mounted) {
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  profile: null
                })
              }
            }
          }, 0)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    // Check for existing session on mount
    const initializeAuth = async () => {
      if (!mounted) return
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('Session error:', error)
          setLoading(false)
          return
        }
        
        // Don't set user state here, let onAuthStateChange handle it
        if (!session) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, role: UserRole = 'reader') => {
    const redirectUrl = `${window.location.origin}/`
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          role
        }
      }
    })
    
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const createProfile = async (role: UserRole) => {
    if (!session?.user) return

    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: session.user.id,
        role,
        status: 'active'
      })

    if (error) {
      console.error('Error creating profile:', error)
    }
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signUp, 
      signIn, 
      signOut, 
      createProfile 
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}