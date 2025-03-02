import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiUsers, FiUser, FiBriefcase, FiFileText, FiTag } from 'react-icons/fi'

function Sidebar() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center space-x-2 px-4">
        <FiFileText className="h-8 w-8" />
        <span className="text-2xl font-extrabold">RecordMS</span>
      </div>
      
      <nav className="mt-10">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
            }`
          }
        >
          <FiHome className="mr-3" />
          Dashboard
        </NavLink>

        {isAdmin && (
          <NavLink 
            to="/users" 
            className={({ isActive }) => 
              `flex items-center py-2.5 px-4 rounded transition duration-200 ${
                isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
              }`
            }
          >
            <FiUsers className="mr-3" />
            Users
          </NavLink>
        )}

        <NavLink 
          to="/persons" 
          className={({ isActive }) => 
            `flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
            }`
          }
        >
          <FiUser className="mr-3" />
          Persons
        </NavLink>

        <NavLink 
          to="/companies" 
          className={({ isActive }) => 
            `flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
            }`
          }
        >
          <FiBriefcase className="mr-3" />
          Companies
        </NavLink>

        <NavLink 
          to="/records" 
          className={({ isActive }) => 
            `flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
            }`
          }
        >
          <FiFileText className="mr-3" />
          Records
        </NavLink>

        <NavLink 
          to="/categories" 
          className={({ isActive }) => 
            `flex items-center py-2.5 px-4 rounded transition duration-200 ${
              isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
            }`
          }
        >
          <FiTag className="mr-3" />
          Categories
        </NavLink>
      </nav>
    </div>
  )
}

export default Sidebar