import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaMinus, FaPlus, FaShareAlt, FaStar, FaRegStar } from 'react-icons/fa'
import useFetch from '../hooks/useFetch'
import { getProduct, getRelatedProducts, addReview } from '../services/productService'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import Loader from '../components/Loader'
import ErrorComponent from '../components/ErrorComponent'
import ProductCard from '../components/ProductCard'
import Breadcrumb from '../components/Breadcrumb'
import Rating from '../components/Rating'
import ReviewCard from '../components/ReviewCard'
import { formatPrice, getImageUrl } from '../utils/helpers'

function ProductDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [submittingReview, setSubmittingReview] = useState(false)

  const {
    data: product,
    loading: productLoading,
    error: productError,
    execute: refetchProduct,
    setData: setProduct,
  } = useFetch(() => getProduct(id), true)

  const {
    data: relatedProducts,
    loading: relatedLoading,
    execute: refetchRelated,
  } = useFetch(() => getRelatedProducts(id), true)

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta
      if (next < 1) return 1
      const prod = product?.product
      if (prod?.stock && next > prod.stock) return prod.stock
      return next
    })
  }

  const handleAddToCart = () => {
    addToCart(product?.product?._id, quantity)
  }

  const handleWishlistToggle = () => {
    const prodId = product?.product?._id
    if (!prodId) return
    if (isInWishlist(prodId)) {
      removeFromWishlist(prodId)
    } else {
      addToWishlist(prodId)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: p.title, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewRating || !reviewComment.trim()) return
    setSubmittingReview(true)
    try {
      await addReview({ productId: product?.product?._id, rating: reviewRating, comment: reviewComment })
      setReviewRating(0)
      setReviewComment('')
      await refetchProduct()
    } catch {} finally {
      setSubmittingReview(false)
    }
  }

  if (productLoading) return <Loader />
  if (productError) return <ErrorComponent message={productError} onRetry={refetchProduct} />
  if (!product?.product) return null

  const p = product.product
  const images = p.images?.length > 0 ? p.images : [{ url: 'https://via.placeholder.com/600x600?text=No+Image' }]
  const discountPercent = p.discountedPrice
    ? Math.round(((p.price - p.discountedPrice) / p.price) * 100)
    : 0
  const inStock = p.stock > 0
  const related = relatedProducts?.products || []

  return (
    <div className="container py-4">
      <Breadcrumb
        items={[
          { name: 'Home', link: '/' },
          { name: p.category?.name || 'Category', link: `/products?category=${p.category?._id || ''}` },
          { name: p.title },
        ]}
      />

      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-3">
            <img
              src={images[selectedImage]?.url}
              alt={p.title}
              className="w-100"
              style={{ height: '450px', objectFit: 'cover' }}
            />
          </div>
          {images.length > 1 && (
            <div className="d-flex gap-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`${p.title} ${index + 1}`}
                  className={`rounded border ${selectedImage === index ? 'border-primary' : 'border-light'} cursor-pointer`}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    opacity: selectedImage === index ? 1 : 0.5,
                  }}
                  onClick={() => setSelectedImage(index)}
                  onMouseEnter={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <h1 className="fw-bold mb-2">{p.title}</h1>

          <div className="d-flex align-items-center gap-2 mb-3">
            <Rating value={p.ratings || 0} />
            <span className="text-muted small">({p.numOfReviews || 0} reviews)</span>
          </div>

          <div className="mb-3">
            {p.discountedPrice ? (
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold text-danger fs-3">{formatPrice(p.discountedPrice)}</span>
                <span className="text-muted text-decoration-line-through fs-5">{formatPrice(p.price)}</span>
                <span className="badge bg-success bg-opacity-10 text-success fs-6">{discountPercent}% OFF</span>
              </div>
            ) : (
              <span className="fw-bold fs-3">{formatPrice(p.price)}</span>
            )}
          </div>

          <div className="mb-3">
            {inStock ? (
              <span className="badge bg-success bg-opacity-10 text-success py-2 px-3">
                <span className="fw-bold">&bull;</span> In Stock
              </span>
            ) : (
              <span className="badge bg-danger bg-opacity-10 text-danger py-2 px-3">
                <span className="fw-bold">&bull;</span> Out of Stock
              </span>
            )}
          </div>

          <p className="text-muted mb-4">{p.description}</p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center border rounded">
              <button
                className="btn btn-light border-0 px-3 py-2"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <FaMinus />
              </button>
              <span className="px-3 py-2 fw-bold">{quantity}</span>
              <button
                className="btn btn-light border-0 px-3 py-2"
                onClick={() => handleQuantityChange(1)}
                disabled={!inStock || quantity >= p.stock}
                aria-label="Increase quantity"
              >
                <FaPlus />
              </button>
            </div>

            <button
              className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <button
              className={`btn d-flex align-items-center justify-content-center rounded-circle ${isInWishlist(p._id) ? 'btn-danger' : 'btn-outline-danger'}`}
              style={{ width: 44, height: 44 }}
              onClick={handleWishlistToggle}
              title={isInWishlist(p._id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FaHeart />
            </button>

            <button
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 44, height: 44 }}
              onClick={handleShare}
              title="Share"
            >
              <FaShareAlt />
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-7">
          <h4 className="fw-bold mb-4">Reviews ({p.reviews?.length || p.numOfReviews || 0})</h4>

          {p.reviews?.length > 0 ? (
            p.reviews.map((review, index) => (
              <ReviewCard key={review._id || index} review={review} />
            ))
          ) : (
            <p className="text-muted">No reviews yet. Be the first to review!</p>
          )}

          <div className="mt-4">
            <h5 className="fw-bold mb-3">Write a Review</h5>
            {user ? (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Rating</label>
                  <div className="d-flex align-items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="btn p-0 border-0 bg-transparent"
                        style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        {star <= (hoverRating || reviewRating) ? (
                          <FaStar className="text-warning" />
                        ) : (
                          <FaRegStar className="text-warning" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="reviewComment" className="form-label fw-semibold">Your Review</label>
                  <textarea
                    id="reviewComment"
                    className="form-control"
                    rows="4"
                    placeholder="Share your experience with this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!reviewRating || !reviewComment.trim() || submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="alert alert-info d-flex align-items-center gap-2">
                <span>Please <Link to="/login" className="alert-link">login</Link> to write a review.</span>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <h4 className="fw-bold mb-4">Related Products</h4>
          {relatedLoading ? (
            <Loader />
          ) : related.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {related.slice(0, 4).map((r) => (
                <ProductCard key={r._id} product={r} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No related products found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
