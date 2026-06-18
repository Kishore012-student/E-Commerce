import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash, FaPlus, FaImage, FaSearch, FaStar, FaEye, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import useFetch from '../../hooks/useFetch'
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService'
import { getAdminCategories } from '../../services/categoryService'
import { formatPrice } from '../../utils/helpers'
import Loader from '../../components/Loader'

const emptyProduct = {
  title: '', description: '', price: '', discountedPrice: '', category: '', stock: '',
  isFeatured: false, isTrending: false, isNewArrival: false, images: [{ url: '' }],
}

function AdminProducts() {
  const { data: productsData, loading, execute: refetch, setData: setProductsData } = useFetch(getAdminProducts)
  const { data: categories } = useFetch(getAdminCategories)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyProduct })
  const [deleting, setDeleting] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const products = Array.isArray(productsData) ? productsData : productsData?.products || []
  const catList = Array.isArray(categories) ? categories : categories?.categories || []

  const filtered = products.filter((p) =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyProduct })
    setShowModal(true)
  }

  const openEdit = (product) => {
    setEditing(product._id)
    setForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      discountedPrice: product.discountedPrice || '',
      category: product.category?._id || product.category || '',
      stock: product.stock || '',
      isFeatured: product.isFeatured || false,
      isTrending: product.isTrending || false,
      isNewArrival: product.isNewArrival || false,
      images: product.images?.length ? product.images : [{ url: '' }],
    })
    setShowModal(true)
  }

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (index, value) => {
    const imgs = [...form.images]
    imgs[index] = { url: value }
    setForm((prev) => ({ ...prev, images: imgs }))
  }

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, { url: '' }] }))
  }

  const removeImageField = (index) => {
    if (form.images.length <= 1) return
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined,
      stock: Number(form.stock),
      images: form.images.filter((img) => img.url.trim()),
    }
    try {
      if (editing) {
        await updateProduct(editing, payload)
        toast.success('Product updated')
      } else {
        await createProduct(payload)
        toast.success('Product created')
      }
      setShowModal(false)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setDeleting(id)
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  if (loading) return <Loader text="Loading products..." />

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="fw-bold mb-0">Products</h2>
        <button className="btn btn-primary" onClick={openAdd}><FaPlus className="me-1" /> Add Product</button>
      </div>

      <div className="d-flex mb-4" style={{ maxWidth: 400 }}>
        <div className="input-group">
          <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="btn btn-outline-secondary" onClick={() => setSearch('')}><FaTimes /></button>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Badges</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <>
                <tr key={product._id} style={{ cursor: 'pointer' }} onClick={() => toggleExpand(product._id)}>
                  <td>
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/50'}
                      alt={product.title}
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                      className="rounded"
                    />
                  </td>
                  <td className="fw-medium">{product.title}</td>
                  <td>{product.category?.name || 'N/A'}</td>
                  <td className="fw-bold">
                    {formatPrice(product.discountedPrice || product.price)}
                    {product.discountedPrice && (
                      <small className="text-muted text-decoration-line-through ms-1">{formatPrice(product.price)}</small>
                    )}
                  </td>
                  <td>
                    <span className={`badge bg-${product.stock > 0 ? 'success' : 'danger'}`}>
                      {product.stock > 0 ? product.stock : 'Out'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {product.isFeatured && <span className="badge bg-warning text-dark"><FaStar className="me-1" />Featured</span>}
                      {product.isTrending && <span className="badge bg-info">Trending</span>}
                      {product.isNewArrival && <span className="badge bg-success">New</span>}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" title="View" onClick={(e) => { e.stopPropagation(); toggleExpand(product._id) }}>
                        <FaEye />
                      </button>
                      <button className="btn btn-sm btn-outline-warning" title="Edit" onClick={(e) => { e.stopPropagation(); openEdit(product) }}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" title="Delete" disabled={deleting === product._id}
                        onClick={(e) => { e.stopPropagation(); handleDelete(product._id) }}>
                        {deleting === product._id ? <span className="spinner-border spinner-border-sm" /> : <FaTrash />}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === product._id && (
                  <tr key={`${product._id}-detail`}>
                    <td colSpan={7} className="bg-light p-4">
                      <h6 className="fw-bold mb-2">Description</h6>
                      <p className="text-muted mb-3">{product.description || 'No description'}</p>
                      <div className="row g-2">
                        {product.images?.map((img, i) => (
                          <div key={i} className="col-auto">
                            <img src={img.url} alt="" style={{ width: 80, height: 80, objectFit: 'cover' }} className="rounded border" />
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">{search ? 'No matching products' : 'No products yet'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editing ? 'Edit Product' : 'Add Product'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Title *</label>
                      <input className="form-control" required value={form.title} onChange={(e) => handleFormChange('title', e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Price *</label>
                      <input type="number" className="form-control" required min={0} value={form.price} onChange={(e) => handleFormChange('price', e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Discounted Price</label>
                      <input type="number" className="form-control" min={0} value={form.discountedPrice} onChange={(e) => handleFormChange('discountedPrice', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select className="form-select" required value={form.category} onChange={(e) => handleFormChange('category', e.target.value)}>
                        <option value="">Select category</option>
                        {catList.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Stock *</label>
                      <input type="number" className="form-control" required min={0} value={form.stock} onChange={(e) => handleFormChange('stock', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows={3} value={form.description} onChange={(e) => handleFormChange('description', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Images</label>
                      {form.images.map((img, i) => (
                        <div key={i} className="input-group mb-2">
                          <input className="form-control" placeholder="Image URL" value={img.url} onChange={(e) => handleImageChange(i, e.target.value)} />
                          <button className="btn btn-outline-danger" type="button" onClick={() => removeImageField(i)} disabled={form.images.length <= 1}><FaTimes /></button>
                        </div>
                      ))}
                      <button className="btn btn-sm btn-outline-secondary" type="button" onClick={addImageField}><FaImage className="me-1" /> Add Image</button>
                    </div>
                    <div className="col-12">
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={(e) => handleFormChange('isFeatured', e.target.checked)} />
                          <label className="form-check-label" htmlFor="isFeatured">Featured</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="isTrending" checked={form.isTrending} onChange={(e) => handleFormChange('isTrending', e.target.checked)} />
                          <label className="form-check-label" htmlFor="isTrending">Trending</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="isNewArrival" checked={form.isNewArrival} onChange={(e) => handleFormChange('isNewArrival', e.target.checked)} />
                          <label className="form-check-label" htmlFor="isNewArrival">New Arrival</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" type="submit">{editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
