import { useEffect, useState } from 'react'
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react'
import { Card, StatCard, LoadingSpinner, ErrorAlert } from '@/components'
import { dashboardAPI } from '@/services/api'
import { formatCurrency } from '@/utils/helpers'

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await dashboardAPI.getMetrics()
      setMetrics(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch dashboard metrics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={error} />

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={metrics?.total_products || 0}
          icon={Package}
          color="blue"
        />
        <StatCard
          label="Total Customers"
          value={metrics?.total_customers || 0}
          icon={Users}
          color="green"
        />
        <StatCard
          label="Total Orders"
          value={metrics?.total_orders || 0}
          icon={ShoppingCart}
          color="purple"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(metrics?.total_revenue || 0)}
          icon={DollarSign}
          color="red"
        />
      </div>

      {/* Low Stock Products */}
      <Card title="Low Stock Products">
        {metrics?.low_stock_products?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">SKU</th>
                  <th className="px-4 py-2 text-right">Stock</th>
                  <th className="px-4 py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {metrics.low_stock_products.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2 font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-2 text-right">
                      <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded">
                        {product.quantity_in_stock}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">{formatCurrency(product.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No low stock products</p>
        )}
      </Card>
    </div>
  )
}
