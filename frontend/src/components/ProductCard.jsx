import React from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice, getDiscountPercent, getImageUrl, truncateText } from '../utils/helpers'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product._id)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-warning" />)
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />)
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />)
      }
    }
    return stars
  }

  const discountPercent = getDiscountPercent(product.price, product.discountedPrice)

  return (
    <div className="card h-100 border-0 rounded-3 shadow-sm product-card" style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.15)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)'}
    >
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <img
          src={getImageUrl(product.images)}
          alt={product.title}
          className="card-img-top h-100 w-100"
          style={{ objectFit: 'cover' }}
        />
        <button
          className="btn position-absolute top-0 end-0 m-2 p-2 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: 36,
            height: 36,
            backgroundColor: isInWishlist(product._id) ? '#e74c3c' : 'rgba(255,255,255,0.8)',
            color: isInWishlist(product._id) ? '#fff' : '#333',
            border: 'none',
            transition: 'all 0.3s ease',
          }}
          onClick={handleWishlistToggle}
          title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FaHeart />
        </button>
        {product.category && (
          <span className="position-absolute bottom-0 start-0 m-2 badge bg-primary bg-opacity-75">
            {product.category.name || product.category}
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
          <h6 className="card-title fw-semibold mb-1" style={{ lineHeight: 1.3 }}>
            {truncateText(product.title, 50)}
          </h6>
        </Link>

        <div className="mb-2">
          {product.discountedPrice ? (
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-danger fs-5">{formatPrice(product.discountedPrice)}</span>
              <span className="text-muted text-decoration-line-through small">{formatPrice(product.price)}</span>
              {discountPercent > 0 && (
                <span className="badge bg-success bg-opacity-10 text-success">{discountPercent}% OFF</span>
              )}
            </div>
          ) : (
            <span className="fw-bold fs-5">{formatPrice(product.price)}</span>
          )}
        </div>

        <div className="d-flex align-items-center gap-1 mb-2">
          {renderStars(product.ratings || 0)}
          <span className="text-muted small ms-1">({product.numOfReviews || 0})</span>
        </div>

        <div className="mt-auto">
          {product.stock > 0 ? (
            <button
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={() => addToCart(product._id, 1)}
            >
              <FaShoppingCart /> Add to Cart
            </button>
          ) : (
            <span className="badge bg-secondary w-100 py-2">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
