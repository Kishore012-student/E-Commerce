import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaBox, FaEye } from 'react-icons/fa'
import { getMyOrders, cancelOrder } from '../services/orderService'
import { formatPrice, getStatusColor } from '../utils/helpers'
import Breadcrumb from '../components/Breadcrumb'
import Loader from '../components/Loader'

function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await getMyOrders()
      setOrders(data.orders || data || [])
    } catch (err) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    setCancelling(orderId)
    try {
      await cancelOrder(orderId)
      toast.success('Order cancelled successfully')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(null)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const getOrderIdDisplay = (id) => {
    if (!id) return 'N/A'
    return id.length > 10 ? `#${id.substring(0, 10).toUpperCase()}...` : `#${id.toUpperCase()}`
  }

  if (loading) return <Loader text="Loading orders..." />

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'My Orders' }]} />

      <h2 className="fw-bold mb-4">
        <FaBox className="me-2" />
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <FaBox size={60} className="text-muted mb-3" />
          <h4 className="fw-bold">No orders yet</h4>
          <p className="text-muted">Looks like you haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary px-4">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => toggleExpand(order._id)}>
                    <td className="fw-medium">{getOrderIdDisplay(order._id)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>{order.orderItems?.length || order.items?.length || 0}</td>
                    <td className="fw-bold">{formatPrice(order.totalPrice || order.totalAmount)}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(order.status)}`}>
                        {order.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" title="View Details">
                          <FaEye />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            disabled={cancelling === order._id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancel(order._id)
                            }}
                          >
                            {cancelling === order._id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              'Cancel'
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === order._id && (
                    <tr key={`${order._id}-details`}>
                      <td colSpan={6} className="bg-light p-4">
                        <div className="row g-3">
                          {order.orderItems?.map((item) => (
                            <div key={item._id || item.product} className="col-md-4">
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={item.image || (item.product?.images?.[0]?.url) || 'https://via.placeholder.com/60'}
                                  alt={item.name}
                                  className="rounded"
                                  style={{ width: 60, height: 60, objectFit: 'cover' }}
                                />
                                <div>
                                  <h6 className="mb-0">{item.name || item.product?.name}</h6>
                                  <small className="text-muted">
                                    Qty: {item.quantity} x {formatPrice(item.price)}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!order.orderItems || order.orderItems.length === 0) && (
                            <div className="col-12 text-muted text-center py-2">No item details available</div>
                          )}
                        </div>
                        <div className="mt-3 d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">
                              Shipping: {order.shippingAddress?.street}, {order.shippingAddress?.city}
                            </small>
                          </div>
                          <div className="text-end">
                            <small className="text-muted">
                              Subtotal: {formatPrice(order.subtotal)} | Tax: {formatPrice(order.taxAmount || order.tax)} | Total: <strong>{formatPrice(order.totalPrice || order.totalAmount)}</strong>
                            </small>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage
