import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import { Card, Button, Input, LoadingSpinner, ErrorAlert, SuccessAlert, Modal, ConfirmDialog } from '@/components'
import { productAPI } from '@/services/api'

export const Products = () => {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    sku: '',
    price: '',
    quantity_in_stock: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAll()
      setProducts(response.data.products || response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a product ID to search')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const productId = parseInt(searchQuery)
      
      if (isNaN(productId)) {
        setError('Product ID must be a number')
        setLoading(false)
        return
      }

      const response = await productAPI.getById(productId)
      setSearchResult(response.data)
      setIsSearching(true)
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Product with ID ${searchQuery} not found`)
      } else {
        setError(err.response?.data?.detail || 'Failed to search product')
      }
      setSearchResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchResult(null)
    setIsSearching(false)
    setError(null)
  }

  const handleAddClick = () => {
    setSelectedProduct(null)
    setFormData({ id: '', name: '', sku: '', price: '', quantity_in_stock: '' })
    setShowModal(true)
  }

  const handleEditClick = (product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity_in_stock: product.quantity_in_stock,
    })
    setShowModal(true)
  }

  const handleDeleteClick = (product) => {
    setSelectedProduct(product)
    setShowDeleteConfirm(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      if (selectedProduct) {
        await productAPI.update(selectedProduct.id, formData)
        setSuccess('Product updated successfully!')
      } else {
        // When creating, only send id if it's provided (non-empty)
        const createData = { ...formData }
        if (!createData.id) {
          delete createData.id
        } else {
          createData.id = parseInt(createData.id)
        }
        await productAPI.create(createData)
        setSuccess('Product created successfully!')
      }
      setShowModal(false)
      fetchProducts()
      handleClearSearch()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save product')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await productAPI.delete(selectedProduct.id)
      setSuccess('Product deleted successfully!')
      setShowDeleteConfirm(false)
      fetchProducts()
      handleClearSearch()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete product')
    }
  }

  const displayProducts = isSearching && searchResult ? [searchResult] : products

  if (loading && !isSearching) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Products</h2>
        <Button variant="primary" onClick={handleAddClick}>
          <Plus size={20} /> Add Product
        </Button>
      </div>

      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      {/* Search Bar */}
      <Card title="Search Products">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Enter Product ID to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            variant="primary" 
            onClick={handleSearch}
            disabled={loading}
          >
            <Search size={20} /> Search
          </Button>
          {isSearching && (
            <Button 
              variant="secondary" 
              onClick={handleClearSearch}
            >
              <X size={20} /> Clear
            </Button>
          )}
        </div>
      </Card>

      {isSearching && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm">
          Showing search result for Product ID: <strong>{searchQuery}</strong>
        </div>
      )}

      <Card title={isSearching ? 'Search Result' : 'All Products'}>
        {displayProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">SKU</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Stock</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayProducts.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-xs font-semibold">#{product.id}</td>
                    <td className="px-4 py-2 font-medium">{product.name}</td>
                    <td className="px-4 py-2 font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-2 text-right">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{product.quantity_in_stock}</td>
                    <td className="px-4 py-2 text-center space-x-2 flex justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(product)}
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
          <p className="text-gray-500 text-center py-8">
            {isSearching ? 'No product found with this ID' : 'No products found'}
          </p>
        )}
      </Card>

      {/* Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
        footer={
          <div className="space-x-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {selectedProduct ? 'Update' : 'Create'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {!selectedProduct && (
            <Input
              label="Product ID (Optional - leave empty for auto-increment)"
              type="number"
              value={formData.id}
              onChange={handleInputChange}
              name="id"
              placeholder="Leave empty for auto-generated ID"
              min="1"
            />
          )}
          <Input
            label="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            required
          />
          <Input
            label="SKU"
            value={formData.sku}
            onChange={handleInputChange}
            name="sku"
            required
          />
          <Input
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            name="price"
            step="0.01"
            required
          />
          <Input
            label="Quantity in Stock"
            type="number"
            value={formData.quantity_in_stock}
            onChange={handleInputChange}
            name="quantity_in_stock"
            required
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"?`}
        isDangerous
      />
    </div>
  )
}
