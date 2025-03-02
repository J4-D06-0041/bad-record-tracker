import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiUser } from 'react-icons/fi'

function Header() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Record Management System</h1>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiUser className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.name} ({currentUser?.role})
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FiLogOut className="mr-1.5 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header