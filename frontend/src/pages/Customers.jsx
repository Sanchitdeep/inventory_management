import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Card, Button, Input, LoadingSpinner, ErrorAlert, SuccessAlert, Modal, ConfirmDialog } from '@/components'
import { customerAPI } from '@/services/api'

export const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await customerAPI.getAll()
      setCustomers(response.data.customers || response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setSelectedCustomer(null)
    setFormData({ full_name: '', email: '', phone_number: '' })
    setShowModal(true)
  }

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer)
    setFormData({
      full_name: customer.full_name,
      email: customer.email,
      phone_number: customer.phone_number,
    })
    setShowModal(true)
  }

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer)
    setShowDeleteConfirm(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      if (selectedCustomer) {
        await customerAPI.update(selectedCustomer.id, formData)
        setSuccess('Customer updated successfully!')
      } else {
        await customerAPI.create(formData)
        setSuccess('Customer created successfully!')
      }
      setShowModal(false)
      fetchCustomers()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save customer')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await customerAPI.delete(selectedCustomer.id)
      setSuccess('Customer deleted successfully!')
      setShowDeleteConfirm(false)
      fetchCustomers()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete customer')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Customers</h2>
        <Button variant="primary" onClick={handleAddClick}>
          <Plus size={20} /> Add Customer
        </Button>
      </div>

      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      <Card>
        {customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{customer.full_name}</td>
                    <td className="px-4 py-2">{customer.email}</td>
                    <td className="px-4 py-2">{customer.phone_number}</td>
                    <td className="px-4 py-2 text-center space-x-2 flex justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditClick(customer)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(customer)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No customers found</p>
        )}
      </Card>

      {/* Customer Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCustomer ? 'Edit Customer' : 'Add Customer'}
        footer={
          <div className="space-x-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {selectedCustomer ? 'Update' : 'Create'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={handleInputChange}
            name="full_name"
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            required
          />
          <Input
            label="Phone Number"
            value={formData.phone_number}
            onChange={handleInputChange}
            name="phone_number"
            required
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${selectedCustomer?.full_name}"?`}
        isDangerous
      />
    </div>
  )
}
