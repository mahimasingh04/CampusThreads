// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import { currentUserAtom, authLoadingAtom, User } from '@/store/authState'

interface AuthContextType {
  user: User | null
  loading: boolean
  login(email: string, password: string): Promise<void>
  signup(name: string, email: string, password: string): Promise<void>
  logout(): void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useRecoilState(currentUserAtom)
  const [loading, setLoading] = useRecoilState(authLoadingAtom)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(false)
  }, [setLoading])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      const u: User = { id: data.user.id, name: data.user.name, email: data.user.email }
      setUser(u)
      localStorage.setItem('token', data.token)
      toast.success('Login successful!')
      navigate('/feed')
    } catch (err: any) {
      toast.error(err.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Signup failed')
      toast.success('Account created — please log in.')
      navigate('/signin')
    } catch (err: any) {
      toast.error(err.message || 'Signup failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    toast.success('Logged out!')
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, signup, logout, isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

