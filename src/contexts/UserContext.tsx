import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  badges: string[]
  joinedAt: string
  password?: string
}

interface UserContextType {
  currentUser: User | null
  users: User[]
  login: (identifier: string, password: string) => void
  logout: () => void
  register: (username: string, email: string, password: string) => void
  updateProfile: (updates: Partial<User>) => void
  addBadge: (userId: string, badge: string) => void
}

const UserContext = createContext<UserContextType | null>(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('portfolio-users')
    const savedCurrentUser = localStorage.getItem('portfolio-current-user')

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      // Seed with demo users
      const demoUsers: User[] = [
        {
          id: '1',
          username: 'vanshika',
          email: 'vanshika@example.com',
          bio: 'Full Stack Developer passionate about creating innovative web applications',
          badges: ['Top Contributor', 'Featured Project'],
          joinedAt: '2024-01-01',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vanshika',
          password: 'demo1234'
        },
        {
          id: '2',
          username: 'demo-user',
          email: 'demo@example.com',
          bio: 'Tech enthusiast exploring new technologies',
          badges: ['New Member'],
          joinedAt: '2024-12-01',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
          password: 'demo1234'
        }
      ]
      setUsers(demoUsers)
      localStorage.setItem('portfolio-users', JSON.stringify(demoUsers))
    }

    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser))
    }
  }, [])

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('portfolio-users', JSON.stringify(users))
  }, [users])

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('portfolio-current-user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('portfolio-current-user')
    }
  }, [currentUser])

  const login = (identifier: string, password: string) => {
    const ident = (identifier || '').trim().toLowerCase()
    const pwd = (password || '').trim()

    // Match case-insensitively; allow login by username OR email
    const user = users.find(u => {
      const uName = (u.username || '').trim().toLowerCase()
      const uMail = (u.email || '').trim().toLowerCase()
      return uName === ident || uMail === ident
    })

    if (user && user.password === pwd) {
      setCurrentUser(user)
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const register = (username: string, email: string, password: string) => {
    const uname = (username || '').trim()
    const mail = (email || '').trim()
    const pwd = (password || '').trim()
    if (!uname || !mail) throw new Error('Username and email are required')
    if (!pwd || pwd.length < 6) throw new Error('Password must be at least 6 characters')

    const unameL = uname.toLowerCase()
    const mailL = mail.toLowerCase()

    const existingUser = users.find(u => u.username.toLowerCase() === unameL || u.email.toLowerCase() === mailL)
    if (existingUser) {
      throw new Error('Username or email already exists')
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: uname,
      email: mail,
      password: pwd,
      badges: ['New Member'],
      joinedAt: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uname}`
    }

    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return

    const updatedUser = { ...currentUser, ...updates }
    setCurrentUser(updatedUser)
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u))
  }

  const addBadge = (userId: string, badge: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId && !u.badges.includes(badge)
        ? { ...u, badges: [...u.badges, badge] }
        : u
    ))

    // Update current user if it's them
    if (currentUser?.id === userId && !currentUser.badges.includes(badge)) {
      setCurrentUser(prev => prev ? { ...prev, badges: [...prev.badges, badge] } : null)
    }
  }

  const value: UserContextType = {
    currentUser,
    users,
    login,
    logout,
    register,
    updateProfile,
    addBadge
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
