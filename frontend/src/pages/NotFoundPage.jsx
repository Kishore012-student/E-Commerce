import { Link } from 'react-router-dom'
import { FaHome, FaShoppingBag } from 'react-icons/fa'

function NotFoundPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="text-center px-3">
        <div className="mb-4 position-relative d-inline-block">
          <div
            className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto"
            style={{ width: 200, height: 200 }}
          >
            <span className="display-1 fw-bold text-primary" style={{ lineHeight: 1 }}>
              404
            </span>
          </div>
          <div
            className="position-absolute bg-warning rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: 50, height: 50, top: -10, right: -10, fontSize: 24 }}
          >
            ?
          </div>
        </div>

        <h1 className="display-5 fw-bold mb-2">Page Not Found</h1>
        <p className="text-muted mb-4 fs-5" style={{ maxWidth: 450, margin: '0 auto' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/" className="btn btn-primary btn-lg px-4 d-inline-flex align-items-center gap-2">
            <FaHome /> Go Home
          </Link>
          <Link to="/products" className="btn btn-outline-primary btn-lg px-4 d-inline-flex align-items-center gap-2">
            <FaShoppingBag /> Go to Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
