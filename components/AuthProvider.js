
'use client'

import { createContext, useState, useEffect, useContext } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for token in cookies on initial load
    const storedToken = Cookies.get('token')
    if (storedToken) {
      try {
        // Decode the token to get user data
        const decoded = jwtDecode(storedToken)
        
        // Check if token is expired
        const currentTime = Date.now() / 1000
        if (decoded.exp && decoded.exp < currentTime) {
          // Token is expired
          logout()
        } else {
          // Token is valid
          setToken(storedToken)
          setUser(decoded.user)
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    const { token, user } = data
    
    // Save token to cookies (expires in 7 days)
    Cookies.set('token', token, { expires: 7 })
    
    // Update state
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    // Remove token from cookies
    Cookies.remove('token')
    
    // Clear state
    setToken(null)
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
