import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useData()
  const { currentUser } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: ''
  })

  const canEdit = ['admin', 'moderator'].includes(currentUser.role)

  const handleOpenModal = (category = null) => {
    if (category) {
      setCurrentCategory(category)
      setFormData({
        name: category.name
      })
    } else {
      setCurrentCategory(null)
      setFormData({
        name: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentCategory(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (currentCategory) {
      updateCategory(currentCategory.id, formData)
    } else {
      addCategory(formData)
    }
    
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Categories Management</h1>
        {canEdit && (
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2" /> Add Category
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {canEdit && (
                      <>
                        <button
                          onClick={() => handleOpenModal(category)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="inline" />
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline" />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding/editing categories */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                {currentCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {currentCategory ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories