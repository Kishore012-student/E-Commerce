import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import { FaHeart } from 'react-icons/fa'

function WishlistPage() {
  const { wishlist } = useWishlist()
  const products = wishlist?.products || []

  const breadcrumbItems = [
    { name: 'Home', link: '/' },
    { name: 'Wishlist', link: '/wishlist' },
  ]

  if (products.length === 0) {
    return (
      <div className="container py-5">
        <Breadcrumb items={breadcrumbItems} />
        <div className="text-center py-5">
          <div className="mb-3 text-muted" style={{ fontSize: '4rem' }}>
            <FaHeart />
          </div>
          <h4 className="fw-bold">Your wishlist is empty</h4>
          <p className="text-muted mb-4">
            Start adding items you love to your wishlist!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg fw-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <Breadcrumb items={breadcrumbItems} />
      <div className="d-flex align-items-center gap-2 mb-4">
        <h4 className="fw-bold mb-0">My Wishlist</h4>
        <span className="badge bg-primary rounded-pill fs-6">{products.length}</span>
      </div>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product._id} className="col-6 col-md-4 col-lg-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishlistPage
