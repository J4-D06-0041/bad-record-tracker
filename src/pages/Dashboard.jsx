import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { FiUsers, FiUser, FiBriefcase, FiFileText, FiTag } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function Dashboard() {
  const { users, persons, companies, records, categories } = useData()
  const { currentUser } = useAuth()
  
  const stats = [
    { name: 'Users', count: users.length, icon: FiUsers, color: 'bg-purple-500', link: '/users', adminOnly: true },
    { name: 'Persons', count: persons.length, icon: FiUser, color: 'bg-blue-500', link: '/persons' },
    { name: 'Companies', count: companies.length, icon: FiBriefcase, color: 'bg-green-500', link: '/companies' },
    { name: 'Records', count: records.length, icon: FiFileText, color: 'bg-yellow-500', link: '/records' },
    { name: 'Categories', count: categories.length, icon: FiTag, color: 'bg-red-500', link: '/categories' }
  ]

  const recentRecords = [...records]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {currentUser.name}! Here's an overview of your record management system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          (!stat.adminOnly || currentUser.role === 'admin') && (
            <Link 
              key={index} 
              to={stat.link}
              className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:transform hover:scale-105"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stat.count}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          )
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Records</h2>
          {recentRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.description.length > 50 
                          ? `${record.description.substring(0, 50)}...` 
                          : record.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${record.severity === 'High' ? 'bg-red-100 text-red-800' : 
                            record.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {record.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No records found.</p>
          )}
          <div className="mt-4">
            <Link to="/records" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all records →
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Admin
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <p>Can add, edit, delete users, persons, companies, records, and categories</p>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Moderator
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <p>Can add, edit persons, companies, records, and categories</p>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    User
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <p>Can view persons, companies, records, and categories</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard