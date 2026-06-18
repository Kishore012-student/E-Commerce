import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaTag, FaCreditCard, FaMoneyBillWave, FaUniversity, FaArrowLeft } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/helpers'
import { createOrder } from '../services/orderService'
import { validateCoupon } from '../services/couponService'
import Loader from '../components/Loader'
import Breadcrumb from '../components/Breadcrumb'
import { toast } from 'react-toastify'

const SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 40

const emptyAddress = {
  fullName: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'India',
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, loading: cartLoading } = useCart()
  const { user } = useAuth()

  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [address, setAddress] = useState(emptyAddress)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const items = cart?.items || []
  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const grandTotal = subtotal + shipping - couponDiscount
  const userAddresses = user?.addresses || []

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate('/cart')
    }
  }, [cartLoading, items, navigate])

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr._id)
    setAddress(addr)
    setShowAddressForm(false)
  }

  const handleAddNewAddress = () => {
    setSelectedAddressId('')
    setAddress(emptyAddress)
    setShowAddressForm(true)
  }

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await validateCoupon({ code: couponCode, orderAmount: subtotal })
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

  const isAddressValid = () => {
    return (
      address.fullName.trim() &&
      address.phone.trim() &&
      address.street.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.zipCode.trim() &&
      address.country.trim()
    )
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!isAddressValid()) {
      toast.error('Please fill in all address fields')
      return
    }
    setSubmitting(true)
    try {
      const orderData = {
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCoupon || undefined,
      }

      const { data } = await createOrder(orderData)
      toast.success('Order placed successfully!')
      navigate(`/order-success/${data.order._id || data.order.id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (cartLoading) return <Loader />

  if (items.length === 0) return null

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'Checkout' }]} />

      <form onSubmit={handlePlaceOrder}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Shipping Address</h5>

                {userAddresses.length > 0 && !showAddressForm && (
                  <>
                    <div className="mb-3">
                      {userAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          className={`border rounded-3 p-3 mb-2 cursor-pointer ${
                            selectedAddressId === addr._id ? 'border-primary bg-primary bg-opacity-10' : ''
                          }`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleAddressSelect(addr)}
                        >
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="savedAddress"
                              checked={selectedAddressId === addr._id}
                              onChange={() => handleAddressSelect(addr)}
                            />
                            <label className="form-check-label w-100">
                              <strong>{addr.fullName}</strong> - {addr.phone}
                              <br />
                              <span className="text-muted">
                                {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleAddNewAddress}
                    >
                      + Add New Address
                    </button>
                  </>
                )}

                {(showAddressForm || userAddresses.length === 0) && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Street Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="street"
                        value={address.street}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={address.country}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    {showAddressForm && (
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => {
                            setShowAddressForm(false)
                            if (selectedAddressId) {
                              const addr = userAddresses.find((a) => a._id === selectedAddressId)
                              if (addr) setAddress(addr)
                            }
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Payment Method</h5>
                <div className="d-flex flex-column gap-2">
                  <label
                    className={`border rounded-3 p-3 d-flex align-items-center gap-3 ${
                      paymentMethod === 'cod' ? 'border-primary bg-primary bg-opacity-10' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      className="form-check-input"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <FaMoneyBillWave className="fs-4 text-success" />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p className="mb-0 text-muted small">Pay when you receive</p>
                    </div>
                  </label>

                  <label
                    className={`border rounded-3 p-3 d-flex align-items-center gap-3 ${
                      paymentMethod === 'stripe' ? 'border-primary bg-primary bg-opacity-10' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      className="form-check-input"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                    />
                    <FaCreditCard className="fs-4 text-primary" />
                    <div>
                      <strong>Stripe</strong>
                      <p className="mb-0 text-muted small">Pay with credit/debit card</p>
                    </div>
                  </label>

                  <label
                    className={`border rounded-3 p-3 d-flex align-items-center gap-3 ${
                      paymentMethod === 'razorpay' ? 'border-primary bg-primary bg-opacity-10' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      className="form-check-input"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                    />
                    <FaUniversity className="fs-4 text-info" />
                    <div>
                      <strong>Razorpay</strong>
                      <p className="mb-0 text-muted small">Pay via UPI, card, netbanking</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <Link to="/cart" className="btn btn-outline-secondary d-flex align-items-center gap-2">
                <FaArrowLeft /> Back to Cart
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Order Summary</h5>

                {items.map((item) => {
                  const product = item.product
                  const price = product.discountedPrice || product.price
                  return (
                    <div key={product._id} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small">
                        {product.title} <strong className="text-dark">x{item.quantity}</strong>
                      </span>
                      <span className="fw-semibold">{formatPrice(price * item.quantity)}</span>
                    </div>
                  )
                })}

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-semibold">{formatPrice(subtotal)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-semibold">
                    {shipping === 0 ? <span className="text-success">Free</span> : formatPrice(shipping)}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Coupon ({appliedCoupon})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <hr />

                <div className="d-flex justify-content-between mb-3">
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
                      <button type="button" className="btn btn-outline-danger" onClick={handleRemoveCoupon}>
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || couponLoading}
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 btn-lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order - ${formatPrice(grandTotal)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
