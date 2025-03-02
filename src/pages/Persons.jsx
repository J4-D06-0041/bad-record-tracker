import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { FiEdit2, FiTrash2, FiPlus, FiEye } from 'react-icons/fi'

function Persons() {
  const { persons, addPerson, updatePerson, deletePerson } = useData()
  const { currentUser } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)
  const [currentPerson, setCurrentPerson] = useState(null)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    address: '',
    dateOfBirth: '',
    contact: '',
    notes: ''
  })

  const canEdit = ['admin', 'moderator'].includes(currentUser.role)

  const handleOpenModal = (person = null, viewOnly = false) => {
    setIsViewMode(viewOnly)
    if (person) {
      setCurrentPerson(person)
      setFormData({
        firstname: person.firstname,
        lastname: person.lastname,
        address: person.address,
        dateOfBirth: person.dateOfBirth,
        contact: person.contact,
        notes: person.notes
      })
    } else {
      setCurrentPerson(null)
      setFormData({
        firstname: '',
        lastname: '',
        address: '',
        dateOfBirth: '',
        contact: '',
        notes: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentPerson(null)
    setIsViewMode(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (currentPerson) {
      updatePerson(currentPerson.id, formData)
    } else {
      addPerson(formData)
    }
    
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      deletePerson(id)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Persons Management</h1>
        {canEdit && (
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2" /> Add Person
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
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {persons.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {person.firstname} {person.lastname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {person.dateOfBirth}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {person.contact.split(',')[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(person, true)}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <FiEye className="inline" />
                    </button>
                    {canEdit && (
                      <>
                        <button
                          onClick={() => handleOpenModal(person, false)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="inline" />
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(person.id)}
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

      {/* Modal for adding/editing/viewing persons */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                {isViewMode ? 'View Person' : currentPerson ? 'Edit Person' : 'Add New Person'}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact (email, phone)</label>
                  <input
                    type="text"
                    name="contact"
                    id="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    id="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isViewMode}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  ></textarea>
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
                      {currentPerson ? 'Update' : 'Add'}
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

export default Persons