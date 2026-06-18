import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaTrash, FaEye, FaSearch, FaTimes } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
import { getAllOrders, updateOrderStatus, deleteOrder } from '../../services/orderService'
import { formatPrice, getStatusColor } from '../../utils/helpers'
import Loader from '../../components/Loader'

const statuses = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

function AdminOrders() {
  const { data: ordersData, loading, execute: refetch, setData: setOrdersData } = useFetch(getAllOrders)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.orders || []

  const filtered = orders.filter((o) => {
    const matchStatus = filter === 'All' || o.status === filter
    const matchSearch = !search ||
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order status updated to ${newStatus}`)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    setDeleting(id)
    try {
      await deleteOrder(id)
      toast.success('Order deleted')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <Loader text="Loading orders..." />

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="fw-bold mb-0">Orders</h2>
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="d-flex" style={{ maxWidth: 300 }}>
          <div className="input-group">
            <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-outline-secondary" onClick={() => setSearch('')}><FaTimes /></button>
            )}
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilter(s)}
            >
              {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <>
                <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => toggleExpand(order._id)}>
                  <td className="fw-medium">#{order._id?.substring(0, 8).toUpperCase()}</td>
                  <td>{order.user?.name || order.shippingAddress?.name || 'N/A'}</td>
                  <td>{order.orderItems?.length || order.items?.length || 0}</td>
                  <td className="fw-bold">{formatPrice(order.totalPrice || order.totalAmount)}</td>
                  <td>{order.paymentMethod || order.paymentInfo?.method || 'N/A'}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(order.status)}`}>{order.status?.toUpperCase()}</span>
                  </td>
                  <td className="text-muted small">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button className="btn btn-sm btn-outline-primary" title="View" onClick={() => toggleExpand(order._id)}>
                        <FaEye />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" title="Delete" disabled={deleting === order._id} onClick={() => handleDelete(order._id)}>
                        {deleting === order._id ? <span className="spinner-border spinner-border-sm" /> : <FaTrash />}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === order._id && (
                  <tr key={`${order._id}-detail`}>
                    <td colSpan={8} className="bg-light p-4">
                      <div className="row g-3">
                        {order.orderItems?.map((item) => (
                          <div key={item._id || item.product} className="col-md-4">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image || item.product?.images?.[0]?.url || 'https://via.placeholder.com/60'}
                                alt={item.name}
                                className="rounded"
                                style={{ width: 60, height: 60, objectFit: 'cover' }}
                              />
                              <div>
                                <h6 className="mb-0 small">{item.name || item.product?.name}</h6>
                                <small className="text-muted">Qty: {item.quantity} x {formatPrice(item.price)}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!order.orderItems || order.orderItems.length === 0) && (
                          <div className="col-12 text-muted text-center py-2">No item details</div>
                        )}
                      </div>
                      <div className="d-flex flex-wrap gap-2 mt-3 justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <small className="text-muted">Update Status:</small>
                          <select
                            className="form-select form-select-sm"
                            style={{ width: 'auto' }}
                            value={order.status}
                            disabled={updating === order._id}
                            onChange={(e) => {
                              const newStatus = e.target.value
                              if (newStatus !== order.status) handleStatusChange(order._id, newStatus)
                            }}
                          >
                            {statuses.filter((s) => s !== 'All').map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          {updating === order._id && <span className="spinner-border spinner-border-sm" />}
                        </div>
                        <div className="text-end">
                          <small className="text-muted">
                            Subtotal: {formatPrice(order.subtotal)} | Tax: {formatPrice(order.taxAmount || order.tax)} | Total: <strong>{formatPrice(order.totalPrice || order.totalAmount)}</strong>
                          </small>
                        </div>
                      </div>
                      {order.shippingAddress && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Ship to: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zip}
                          </small>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminOrders
