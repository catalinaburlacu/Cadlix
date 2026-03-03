import { useState, useEffect, useCallback } from 'react'
import { UserContext } from './UserContext'
import { defaultUser } from './userData'
import type { User, ChildrenProps } from '@/types'

const USER_STORAGE_KEY = 'cadlix_user'
const AUTH_STORAGE_KEY = 'cadlix_auth'

export function UserProvider({ children }: ChildrenProps) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (!savedUser) return null
      const parsed = JSON.parse(savedUser)
      return {
        ...defaultUser,
        ...parsed,
        stats: { ...defaultUser.stats, ...parsed.stats },
        watchList: parsed.watchList?.length ? parsed.watchList : defaultUser.watchList,
        watchHistory: parsed.watchHistory?.length ? parsed.watchHistory : defaultUser.watchHistory,
      }
    } catch {
      return null
    }
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
      return savedAuth ? JSON.parse(savedAuth) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    } catch (error) {
      console.error('Failed to save user to localStorage:', error)
    }
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated))
    } catch (error) {
      console.error('Failed to save auth state to localStorage:', error)
    }
  }, [isAuthenticated])

  const login = useCallback((userData: User = defaultUser) => {
    setUser(userData)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    try {
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updatedUser = { ...prev, ...updates }
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
      } catch (error) {
        console.error('Failed to update user in localStorage:', error)
      }
      return updatedUser
    })
  }, [])

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
