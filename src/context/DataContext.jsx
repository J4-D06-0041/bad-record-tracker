import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import initialData from '../data/data.json'

const DataContext = createContext()

export function useData() {
  return useContext(DataContext)
}

export function DataProvider({ children }) {
  // Initialize state with data from JSON file
  const [users, setUsers] = useState(initialData.users)
  const [persons, setPersons] = useState(initialData.persons)
  const [companies, setCompanies] = useState(initialData.companies)
  const [categories, setCategories] = useState(initialData.categories)
  const [records, setRecords] = useState(initialData.records)

  // Users CRUD operations
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
    }
    setUsers([...users, newUser])
    toast.success('User added successfully')
  }

  const updateUser = (id, updatedUser) => {
    setUsers(users.map(user => user.id === id ? { ...user, ...updatedUser } : user))
    toast.success('User updated successfully')
  }

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id))
    toast.success('User deleted successfully')
  }

  // Persons CRUD operations
  const addPerson = (person) => {
    const newPerson = {
      ...person,
      id: persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1
    }
    setPersons([...persons, newPerson])
    toast.success('Person added successfully')
  }

  const updatePerson = (id, updatedPerson) => {
    setPersons(persons.map(person => person.id === id ? { ...person, ...updatedPerson } : person))
    toast.success('Person updated successfully')
  }

  const deletePerson = (id) => {
    // Check if person is referenced in any records
    const isReferenced = records.some(record => record.personId === id)
    if (isReferenced) {
      toast.error('Cannot delete person because they are referenced in records')
      return false
    }
    
    setPersons(persons.filter(person => person.id !== id))
    toast.success('Person deleted successfully')
    return true
  }

  // Companies CRUD operations
  const addCompany = (company) => {
    const newCompany = {
      ...company,
      id: companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1
    }
    setCompanies([...companies, newCompany])
    toast.success('Company added successfully')
  }

  const updateCompany = (id, updatedCompany) => {
    setCompanies(companies.map(company => company.id === id ? { ...company, ...updatedCompany } : company))
    toast.success('Company updated successfully')
  }

  const deleteCompany = (id) => {
    // Check if company is referenced in any records
    const isReferenced = records.some(record => record.companyId === id)
    if (isReferenced) {
      toast.error('Cannot delete company because it is referenced in records')
      return false
    }
    
    setCompanies(companies.filter(company => company.id !== id))
    toast.success('Company deleted successfully')
    return true
  }

  // Categories CRUD operations
  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1
    }
    setCategories([...categories, newCategory])
    toast.success('Category added successfully')
  }

  const updateCategory = (id, updatedCategory) => {
    setCategories(categories.map(category => category.id === id ? { ...category, ...updatedCategory } : category))
    toast.success('Category updated successfully')
  }

  const deleteCategory = (id) => {
    // Check if category is referenced in any records
    const isReferenced = records.some(record => record.categoryId === id)
    if (isReferenced) {
      toast.error('Cannot delete category because it is referenced in records')
      return false
    }
    
    setCategories(categories.filter(category => category.id !== id))
    toast.success('Category deleted successfully')
    return true
  }

  // Records CRUD operations
  const addRecord = (record) => {
    const newRecord = {
      ...record,
      id: records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1,
      date: record.date || new Date().toISOString().split('T')[0]
    }
    setRecords([...records, newRecord])
    toast.success('Record added successfully')
  }

  const updateRecord = (id, updatedRecord) => {
    setRecords(records.map(record => record.id === id ? { ...record, ...updatedRecord } : record))
    toast.success('Record updated successfully')
  }

  const deleteRecord = (id) => {
    setRecords(records.filter(record => record.id !== id))
    toast.success('Record deleted successfully')
    return true
  }

  // Helper functions to get related entities
  const getPersonById = (id) => persons.find(person => person.id === id)
  const getCompanyById = (id) => companies.find(company => company.id === id)
  const getCategoryById = (id) => categories.find(category => category.id === id)

  const value = {
    users,
    persons,
    companies,
    categories,
    records,
    addUser,
    updateUser,
    deleteUser,
    addPerson,
    updatePerson,
    deletePerson,
    addCompany,
    updateCompany,
    deleteCompany,
    addCategory,
    updateCategory,
    deleteCategory,
    addRecord,
    updateRecord,
    deleteRecord,
    getPersonById,
    getCompanyById,
    getCategoryById
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}