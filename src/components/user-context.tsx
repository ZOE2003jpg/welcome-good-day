import { createContext, useContext, useState, ReactNode } from "react"

export type UserRole = "reader" | "writer" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (email: string, password: string, role: UserRole) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, password: string, role: UserRole) => {
    // Mock login - in real app this would call an API
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    }
    setUser(mockUser)
    localStorage.setItem('vine-user', JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vine-user')
  }

  // Check for existing user on mount
  useState(() => {
    const savedUser = localStorage.getItem('vine-user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('vine-user')
      }
    }
  })

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
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