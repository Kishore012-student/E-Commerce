import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus, FaTag, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import { validateCoupon } from '../services/couponService'
import Loader from '../components/Loader'
import Breadcrumb from '../components/Breadcrumb'
import { toast } from 'react-toastify'

const SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 40

function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState('')

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await validateCoupon({ code: couponCode, cartTotal: subtotal })
      setCouponDiscount(data.discount || 0)
      setAppliedCoupon(couponCode)
      toast.success('Coupon applied!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon')
      setCouponDiscount(0)
      setAppliedCoupon('')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setCouponDiscount(0)
    setAppliedCoupon('')
    toast.info('Coupon removed')
  }

  const items = cart?.items || []
  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const grandTotal = subtotal + shipping - couponDiscount

  if (loading) return <Loader />

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'Cart' }]} />

      {items.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">
            <FaShoppingCart />
          </div>
          <h3 className="fw-bold">Your Cart is Empty</h3>
          <p className="text-muted mb-4">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Shopping Cart ({items.length} items)</h4>

                {items.map((item) => {
                  const product = item.product
                  const itemSubtotal = product.discountedPrice
                    ? product.discountedPrice * item.quantity
                    : product.price * item.quantity

                  return (
                    <div
                      key={product._id}
                      className="row align-items-center border-bottom pb-3 mb-3"
                    >
                      <div className="col-md-2 col-4 mb-2 mb-md-0">
                        <Link to={`/products/${product._id}`}>
                          <img
                            src={product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                            alt={product.title}
                            className="img-fluid rounded"
                            style={{ height: 100, objectFit: 'cover' }}
                          />
                        </Link>
                      </div>

                      <div className="col-md-3 col-8 mb-2 mb-md-0">
                        <Link
                          to={`/products/${product._id}`}
                          className="text-decoration-none text-dark fw-semibold"
                        >
                          {product.title}
                        </Link>
                        <p className="text-muted small mb-0 mt-1">
                          {formatPrice(product.discountedPrice || product.price)} each
                        </p>
                      </div>

                      <div className="col-md-3 col-6 mb-2 mb-md-0">
                        <div className="d-flex align-items-center border rounded w-auto">
                          <button
                            className="btn btn-light border-0 px-3 py-1"
                            onClick={() => updateQuantity(product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease"
                          >
                            <FaMinus />
                          </button>
                          <span className="px-3 py-1 fw-bold">{item.quantity}</span>
                          <button
                            className="btn btn-light border-0 px-3 py-1"
                            onClick={() => updateQuantity(product._id, item.quantity + 1)}
                            aria-label="Increase"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                      <div className="col-md-2 col-4 text-center mb-2 mb-md-0">
                        <span className="fw-bold">{formatPrice(itemSubtotal)}</span>
                      </div>

                      <div className="col-md-2 col-2 text-end">
                        <button
                          className="btn btn-outline-danger btn-sm rounded-circle"
                          style={{ width: 36, height: 36 }}
                          onClick={() => removeItem(product._id)}
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-semibold">{formatPrice(subtotal)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">
                    Shipping {shipping === 0 && <span className="text-success small">(Free)</span>}
                  </span>
                  <span className="fw-semibold">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {subtotal < SHIPPING_THRESHOLD && (
                  <p className="text-muted small mb-3">
                    Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free shipping
                  </p>
                )}

                {couponDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Coupon ({appliedCoupon})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-5">{formatPrice(grandTotal)}</span>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FaTag className="me-1" /> Coupon Code
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button className="btn btn-outline-danger" onClick={handleRemoveCoupon}>
                        Remove
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || couponLoading}
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    )}
                  </div>
                </div>

                <Link to="/checkout" className="btn btn-primary w-100 btn-lg">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
