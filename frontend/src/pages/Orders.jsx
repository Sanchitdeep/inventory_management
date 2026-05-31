import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye } from 'lucide-react'
import { Card, Button, Input, Select, LoadingSpinner, ErrorAlert, SuccessAlert, Modal, ConfirmDialog } from '@/components'
import { orderAPI, customerAPI, productAPI } from '@/services/api'
import { formatCurrency, formatDateTime } from '@/utils/helpers'

export const Orders = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ product_id: '', quantity: 1 }],
  })

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        orderAPI.getAll(),
        customerAPI.getAll(1, 100),
        productAPI.getAll(1, 100),
      ])
      setOrders(ordersRes.data)
      setCustomers(customersRes.data.customers || customersRes.data)
      setProducts(productsRes.data.products || productsRes.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setSelectedOrder(null)
    setFormData({ customer_id: '', items: [{ product_id: '', quantity: 1 }] })
    setShowModal(true)
  }

  const handleDeleteClick = (order) => {
    setSelectedOrder(order)
    setShowDeleteConfirm(true)
  }

  const handleViewDetails = async (order) => {
    try {
      const response = await orderAPI.getById(order.id)
      setOrderDetails(response.data)
      setShowDetailsModal(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch order details')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: 1 }],
    }))
  }

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    try {
      const orderData = {
        customer_id: parseInt(formData.customer_id),
        items: formData.items.map((item) => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
        })),
      }
      await orderAPI.create(orderData)
      setSuccess('Order created successfully!')
      setShowModal(false)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create order')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await orderAPI.delete(selectedOrder.id)
      setSuccess('Order deleted successfully!')
      setShowDeleteConfirm(false)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete order')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Orders</h2>
        <Button variant="primary" onClick={handleAddClick}>
          <Plus size={20} /> Create Order
        </Button>
      </div>

      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      <Card>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-right">Total Amount</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono">#{order.id}</td>
                    <td className="px-4 py-2">{order.customer_id}</td>
                    <td className="px-4 py-2 text-right font-semibold">{formatCurrency(order.total_amount)}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{formatDateTime(order.created_at)}</td>
                    <td className="px-4 py-2 text-center space-x-2 flex justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(order)}
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
          <p className="text-gray-500 text-center py-8">No orders found</p>
        )}
      </Card>

      {/* Create Order Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Order"
        footer={
          <div className="space-x-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Create
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Customer"
            value={formData.customer_id}
            onChange={handleInputChange}
            name="customer_id"
            options={customers.map((c) => ({ value: c.id, label: c.full_name }))}
            required
          />

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Order Items</h4>
            {formData.items.map((item, index) => (
              <div key={index} className="flex space-x-2 mb-3">
                <Select
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                  options={products.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` }))}
                />
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="1"
                  style={{ width: '100px' }}
                />
                <Button variant="danger" size="sm" onClick={() => removeItem(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="secondary" onClick={addItem}>
              Add Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Order Details"
      >
        {orderDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Order ID</p>
                <p className="font-semibold">#{orderDetails.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-semibold">{formatCurrency(orderDetails.total_amount)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Items</h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-1 text-left">Product</th>
                    <th className="px-2 py-1 text-center">Qty</th>
                    <th className="px-2 py-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.order_items?.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-2 py-1">{item.product_id}</td>
                      <td className="px-2 py-1 text-center">{item.quantity}</td>
                      <td className="px-2 py-1 text-right">{formatCurrency(item.unit_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${selectedOrder?.id}?`}
        isDangerous
      />
    </div>
  )
}
