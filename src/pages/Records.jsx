import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { FiEdit2, FiTrash2, FiPlus, FiEye } from 'react-icons/fi'

function Records() {
  const { 
    records, 
    persons, 
    companies, 
    categories, 
    addRecord, 
    updateRecord, 
    deleteRecord,
    getPersonById,
    getCompanyById,
    getCategoryById
  } = useData()
  const { currentUser } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [formData, setFormData] = useState({
    proof: '',
    description: '',
    severity: 'Low',
    personId: '',
    companyId: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  })

  const canEdit = ['admin', 'moderator'].includes(currentUser.role)

  const handleOpenModal = (record = null, viewOnly = false) => {
    setIsViewMode(viewOnly)
    if (record) {
      setCurrentRecord(record)
      setFormData({
        proof: record.proof,
        description: record.description,
        severity: record.severity,
        personId: record.personId,
        companyId: record.companyId,
        categoryId: record.categoryId,
        date: record.date
      })
    } else {
      setCurrentRecord(null)
      setFormData({
        proof: '',
        description: '',
        severity: 'Low',
        personId: persons.length > 0 ? persons[0].id : '',
        companyId: companies.length > 0 ? companies[0].id : '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        date: new Date().toISOString().split('T')[0]
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentRecord(null)
    setIsViewMode(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name.endsWith('Id') ? parseInt(value) : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (currentRecord) {
      updateRecord(currentRecord.id, formData)
    } else {
      addRecord(formData)
    }
    
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteRecord(id)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Records Management</h1>
        {canEdit && (
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2" /> Add Record
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => {
                const person = getPersonById(record.personId)
                const company = getCompanyById(record.companyId)
                const category = getCategoryById(record.categoryId)
                
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.description.length > 30 
                        ? `${record.description.substring(0, 30)}...` 
                        : record.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person ? `${person.firstname} ${person.lastname}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company ? company.name : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category ? category.name : 'Unknown'}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(record, true)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                      >
                        <FiEye className="inline" />
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleOpenModal(record, false)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FiEdit2 className="inline" />
                          </button>
                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="inline" />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding/editing/viewing records */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                {isViewMode ? 'View Record' : currentRecord ? 'Edit Record' : 'Add New Record'}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label htmlFor="proof" className="block text-sm font-medium text-gray-700">Proof (file name)</label>
                  <input
                    type="text"
                    name="proof"
                    id="proof"
                    value={formData.proof}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700">Severity</label>
                  <select
                    name="severity"
                    id="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="personId" className="block text-sm font-medium text-gray-700">Person</label>
                  <select
                    name="personId"
                    id="personId"
                    value={formData.personId}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {persons.map(person => (
                      <option key={person.id} value={person.id}>
                        {person.firstname} {person.lastname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">Company</label>
                  <select
                    name="companyId"
                    id="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="categoryId"
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-secondary"
                  >
                    {isViewMode ? 'Close' : 'Cancel'}
                  </button>
                  {!isViewMode && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {currentRecord ? 'Update' : 'Add'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Records