'use client'

import { useState, useEffect } from 'react'
import { api } from '../api-handler'

// Models
interface User {
  id: string
  createdAt: string
  updatedAt: string
  firstName: string
  lastName: string
  email: string
  isEmailVerified: boolean
  phone: string
  isPhoneVerified: boolean
}

interface UserSessionState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useUserSession(): UserSessionState & {
  refetch: () => Promise<void>
  signOut: () => Promise<void>
} {
  const [state, setState] = useState<UserSessionState>({
    user: null,
    loading: true,
    error: null
  })

  const fetchUserSession = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await api.get<User>('/api/v1/users/me')

      if (error || !data) {
        throw new Error(error?.message || 'Failed to fetch user')
      }

      setState({
        user: data,
        loading: false,
        error: null
      })
    } catch (err) {
      setState({
        user: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      })
    }
  }

  const signOut = async () => {
    try {
      await api.post('/api/users/sign-out')
      setState({ user: null, loading: false, error: null })
    } catch (err) {
      setState({
        user: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Sign out failed'
      })
    }
  }

  useEffect(() => {
    fetchUserSession()
  }, [])

  return {
    ...state,
    refetch: fetchUserSession,
    signOut
  }
}
