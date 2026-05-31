import { Link } from 'react-router-dom'
import { BarChart3, Package, Users, ShoppingCart } from 'lucide-react'

export const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
  ]

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
