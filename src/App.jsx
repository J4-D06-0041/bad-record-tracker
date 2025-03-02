import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Persons from './pages/Persons'
import Companies from './pages/Companies'
import Records from './pages/Records'
import Categories from './pages/Categories'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

function App() {
  const { currentUser } = useAuth()

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/dashboard" replace />
    }

    return children
  }

  return (
    <Routes>
      <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" replace />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        } />
        
        <Route path="persons" element={<Persons />} />
        <Route path="companies" element={<Companies />} />
        <Route path="records" element={<Records />} />
        <Route path="categories" element={<Categories />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App