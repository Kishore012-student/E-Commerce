import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa'
import { getOrderDetails } from '../services/orderService'
import { formatPrice } from '../utils/helpers'
import Loader from '../components/Loader'
import Breadcrumb from '../components/Breadcrumb'

function OrderSuccessPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrderDetails(id)
        setOrder(data.order || data)
      } catch {
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return <Loader />
  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    )
  }

  const estimatedDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '3-5 business days'

  return (
    <div className="container py-5">
      <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'Order Success' }]} />

      <div className="row justify-content-center">
        <div className="col-lg-6 text-center">
          <div className="mb-4">
            <FaCheckCircle className="text-success" style={{ fontSize: '5rem' }} />
          </div>

          <div className="mb-2">
            <span className="badge bg-success bg-opacity-10 text-success px-4 py-2 fs-6">
              Payment Successful
            </span>
          </div>

          <h2 className="fw-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-muted mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="card shadow-sm border-0 rounded-3 mb-4">
            <div className="card-body p-4">
              <div className="mb-3">
                <small className="text-muted text-uppercase fw-semibold">Order ID</small>
                <p className="fw-bold mb-0 fs-5">{order._id || order.id}</p>
              </div>

              <div className="mb-3">
                <small className="text-muted text-uppercase fw-semibold">Total Amount</small>
                <p className="fw-bold mb-0 fs-4 text-success">
                  {formatPrice(order.totalPrice || order.totalAmount)}
                </p>
              </div>

              <div>
                <small className="text-muted text-uppercase fw-semibold">Estimated Delivery</small>
                <p className="fw-bold mb-0 fs-5">{estimatedDelivery}</p>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Link to="/my-orders" className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2">
              View Order
            </Link>
            <Link to="/products" className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center gap-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
