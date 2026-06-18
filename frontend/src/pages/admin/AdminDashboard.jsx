import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign, FaEye, FaPlus, FaCog } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
import { getAllOrders } from '../../services/orderService'
import { getAdminProducts } from '../../services/productService'
import { formatPrice, getStatusColor } from '../../utils/helpers'
import Loader from '../../components/Loader'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)

  const { data: ordersData, loading: ordersLoading } = useFetch(getAllOrders)
  const { data: productsData, loading: productsLoading } = useFetch(getAdminProducts)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const res = await fetch('/api/users/admin', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const json = await res.json()
      setUsers(json.users || json || [])
    } catch {
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }

  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.orders || []
  const products = Array.isArray(productsData) ? productsData : productsData?.products || []
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0)
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const stats = [
    { label: 'Total Users', value: users.length, icon: FaUsers, color: 'primary' },
    { label: 'Total Products', value: products.length, icon: FaBox, color: 'success' },
    { label: 'Total Orders', value: orders.length, icon: FaShoppingCart, color: 'info' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: FaDollarSign, color: 'warning' },
  ]

  if (usersLoading || ordersLoading || productsLoading) return <Loader text="Loading dashboard..." />

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>

      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div key={stat.label} className="col-6 col-lg-3">
            <div className={`card border-0 shadow-sm bg-${stat.color} bg-gradient text-white h-100`}>
              <div className="card-body d-flex align-items-center gap-3">
                <stat.icon size={36} className="opacity-75" />
                <div>
                  <div className="fs-4 fw-bold">{stat.value}</div>
                  <div className="small opacity-75">{stat.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-bold">Revenue Overview</div>
            <div className="card-body d-flex align-items-end gap-2" style={{ height: 200 }}>
              {orders.length > 0 ? (
                (() => {
                  const monthlyMap = {}
                  orders.forEach((o) => {
                    const d = new Date(o.createdAt)
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
                    monthlyMap[key] = (monthlyMap[key] || 0) + (o.totalPrice || o.totalAmount || 0)
                  })
                  const entries = Object.entries(monthlyMap).sort()
                  const max = Math.max(...entries.map(([, v]) => v), 1)
                  return entries.map(([month, amount]) => (
                    <div key={month} className="d-flex flex-column align-items-center flex-fill">
                      <small className="text-muted mb-1">{formatPrice(amount)}</small>
                      <div
                        className="bg-primary rounded-top w-100"
                        style={{ height: `${(amount / max) * 160}px`, minHeight: 10 }}
                      />
                      <small className="text-muted mt-1">{month.slice(-2)}</small>
                    </div>
                  ))
                })()
              ) : (
                <div className="text-muted w-100 text-center py-5">No order data yet</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-bold">Quick Actions</div>
            <div className="card-body d-flex flex-column gap-2">
              <Link to="/admin/products" className="btn btn-outline-primary d-flex align-items-center gap-2">
                <FaBox /> Manage Products
              </Link>
              <Link to="/admin/orders" className="btn btn-outline-info d-flex align-items-center gap-2">
                <FaShoppingCart /> Manage Orders
              </Link>
              <Link to="/admin/users" className="btn btn-outline-secondary d-flex align-items-center gap-2">
                <FaUsers /> Manage Users
              </Link>
              <Link to="/admin/categories" className="btn btn-outline-success d-flex align-items-center gap-2">
                <FaPlus /> Manage Categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <span className="fw-bold">Recent Orders</span>
          <Link to="/admin/orders" className="btn btn-sm btn-primary">View All</Link>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="fw-medium">#{order._id?.substring(0, 8).toUpperCase()}</td>
                    <td>{order.user?.name || order.shippingAddress?.name || 'N/A'}</td>
                    <td className="fw-bold">{formatPrice(order.totalPrice || order.totalAmount)}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(order.status)}`}>{order.status?.toUpperCase()}</span>
                    </td>
                    <td className="text-muted small">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      <Link to={`/admin/orders`} className="btn btn-sm btn-outline-secondary"><FaEye /></Link>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
