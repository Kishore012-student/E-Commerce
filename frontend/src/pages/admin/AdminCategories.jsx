import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff, FaImage } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService'
import { getAdminProducts } from '../../services/productService'
import Loader from '../../components/Loader'

const emptyCategory = { name: '', description: '', image: '' }

function AdminCategories() {
  const { data: categoriesData, loading, execute: refetch } = useFetch(getAdminCategories)
  const { data: productsData } = useFetch(getAdminProducts)

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyCategory })
  const [deleting, setDeleting] = useState(null)

  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || []
  const products = Array.isArray(productsData) ? productsData : productsData?.products || []

  const getProductCount = (catId) => products.filter((p) => (p.category?._id || p.category) === catId).length

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyCategory })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditing(cat._id)
    setForm({ name: cat.name || '', description: cat.description || '', image: cat.image || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateCategory(editing, form)
        toast.success('Category updated')
      } else {
        await createCategory(form)
        toast.success('Category created')
      }
      setShowModal(false)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    setDeleting(id)
    try {
      await deleteCategory(id)
      toast.success('Category deleted')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const toggleStatus = async (cat) => {
    try {
      await updateCategory(cat._id, { isActive: !cat.isActive })
      toast.success(`Category ${cat.isActive ? 'deactivated' : 'activated'}`)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Toggle failed')
    }
  }

  if (loading) return <Loader text="Loading categories..." />

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="fw-bold mb-0">Categories</h2>
        <button className="btn btn-primary" onClick={openAdd}><FaPlus className="me-1" /> Add Category</button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className="fw-medium d-flex align-items-center gap-2">
                  {cat.image && (
                    <img src={cat.image} alt="" style={{ width: 36, height: 36, objectFit: 'cover' }} className="rounded" />
                  )}
                  {cat.name}
                </td>
                <td className="text-muted">{cat.description || '—'}</td>
                <td>
                  <span className={`badge bg-${cat.isActive !== false ? 'success' : 'danger'}`}>
                    {cat.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{getProductCount(cat._id)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-warning" title="Edit" onClick={() => openEdit(cat)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" title={cat.isActive !== false ? 'Deactivate' : 'Activate'} onClick={() => toggleStatus(cat)}>
                      {cat.isActive !== false ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button className="btn btn-sm btn-outline-danger" title="Delete" disabled={deleting === cat._id} onClick={() => handleDelete(cat._id)}>
                      {deleting === cat._id ? <span className="spinner-border spinner-border-sm" /> : <FaTrash />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">No categories yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editing ? 'Edit Category' : 'Add Category'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input className="form-control" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaImage /></span>
                      <input className="form-control" placeholder="https://..." value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
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

export default AdminCategories
