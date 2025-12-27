import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '@/api/auth'
import { storage } from '@/api/client'
import { queryClient } from '@/lib/queryClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser())
  const [token, setToken] = useState(() => storage.getToken())
  const [loading, setLoading] = useState(!!storage.getToken())

  useEffect(() => {
    let isMounted = true
    const bootstrap = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const { data } = await authApi.me()
        if (isMounted) {
          setUser(data.data.user)
          storage.setUser(data.data.user)
        }
      } catch (error) {
        storage.clearToken()
        storage.clearUser()
        setToken(null)
        setUser(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    bootstrap()
    return () => {
      isMounted = false
    }
  }, [token])

  const handleAuthSuccess = ({ accessToken, user: userPayload }) => {
    if (accessToken) {
      storage.setToken(accessToken)
      setToken(accessToken)
    }
    if (userPayload) {
      storage.setUser(userPayload)
      setUser(userPayload)
    }
  }

  const register = async (payload) => {
    const { data } = await authApi.register(payload)
    return data.data
  }

  const verifyOtp = async (payload) => {
    const { data } = await authApi.verify(payload)
    handleAuthSuccess(data.data)
    return data.data
  }

  const resendOtp = (payload) => authApi.resendOtp(payload)

  const login = async (payload) => {
    const { data } = await authApi.login(payload)
    handleAuthSuccess(data.data)
    return data.data
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      storage.clearToken()
      storage.clearUser()
      setToken(null)
      setUser(null)
      queryClient.clear()
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      register,
      verifyOtp,
      resendOtp,
      login,
      logout,
    }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
