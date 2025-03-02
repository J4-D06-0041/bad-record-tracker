import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import data from '../data/data.json'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    const user = data.users.find(
      (user) => user.username === username && user.password === password
    )

    if (user) {
      const userInfo = { ...user }
      delete userInfo.password // Don't store password in state
      
      setCurrentUser(userInfo)
      localStorage.setItem('currentUser', JSON.stringify(userInfo))
      return true
    } else {
      toast.error('Invalid username or password')
      return false
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  const value = {
    currentUser,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}