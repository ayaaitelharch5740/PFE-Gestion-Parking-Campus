import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(stored => { if (stored) setUser(JSON.parse(stored)) })
      .finally(() => setLoading(false))
  }, [])

  const login = async (token, userData) => {
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user'])
    setUser(null)
  }

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, logout } },
    children
  )
}

export const useAuth = () => useContext(AuthContext)