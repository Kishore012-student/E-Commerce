import { useState, useMemo } from 'react'
import { FaTrash, FaSearch, FaTimes, FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import useFetch from '../../hooks/useFetch'
import { getAdminProducts, deleteReview } from '../../services/productService'
import Loader from '../../components/Loader'

function AdminReviews() {
  const { data: productsData, loading, execute: refetch } = useFetch(getAdminProducts)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [deleting, setDeleting] = useState(null)

  const products = Array.isArray(productsData) ? productsData : productsData?.products || []

  const reviews = useMemo(() => {
    const all = []
    products.forEach((product) => {
      if (product.reviews?.length) {
        product.reviews.forEach((review) => {
          all.push({ ...review, product: { _id: product._id, title: product.title, images: product.images } })
        })
      }
    })
    return all
  }, [products])

  const filtered = reviews.filter((r) => {
    const matchSearch = !search ||
      r.product?.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase())
    const matchRating = ratingFilter === 0 || r.rating === ratingFilter
    return matchSearch && matchRating
  })

  const handleDelete = async (review) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    setDeleting(review._id)
    try {
      await deleteReview(review.product._id, review._id)
      toast.success('Review deleted')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <Loader text="Loading reviews..." />

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="fw-bold mb-0">Reviews</h2>
        <span className="text-muted">{reviews.length} total</span>
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <div style={{ maxWidth: 350 }}>
          <div className="input-group">
            <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by product, user, or comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-outline-secondary" onClick={() => setSearch('')}><FaTimes /></button>
            )}
          </div>
        </div>
        <div className="d-flex gap-1 flex-wrap align-items-center">
          <span className="text-muted small me-1">Rating:</span>
          {[0, 5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              className={`btn btn-sm ${ratingFilter === r ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={() => setRatingFilter(r)}
            >
              {r === 0 ? 'All' : <><FaStar className="me-1" />{r}</>}
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((review) => (
              <tr key={review._id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={review.product?.images?.[0]?.url || 'https://via.placeholder.com/40'}
                      alt=""
                      style={{ width: 36, height: 36, objectFit: 'cover' }}
                      className="rounded"
                    />
                    <span className="small fw-medium">{review.product?.title || 'N/A'}</span>
                  </div>
                </td>
                <td>{review.user?.name || 'Anonymous'}</td>
                <td>
                  <span className="text-warning">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? 'text-warning' : 'text-muted'} size={14} />
                    ))}
                  </span>
                </td>
                <td className="text-muted small" style={{ maxWidth: 300 }}>
                  <div className="text-truncate">{review.comment || '—'}</div>
                </td>
                <td className="text-muted small">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                    : 'N/A'}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    title="Delete"
                    disabled={deleting === review._id}
                    onClick={() => handleDelete(review)}
                  >
                    {deleting === review._id ? <span className="spinner-border spinner-border-sm" /> : <FaTrash />}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">{search || ratingFilter ? 'No matching reviews' : 'No reviews yet'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminReviews
