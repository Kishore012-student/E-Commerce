import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaTrash, FaSearch, FaTimes, FaUserShield } from 'react-icons/fa'
import Loader from '../../components/Loader'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users/admin', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const json = await res.json()
      setUsers(json.users || json || [])
    } catch {
      toast.error('Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = users.filter((u) =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId)
    try {
      const res = await fetch(`/api/users/role/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) throw new Error()
      toast.success(`User role updated to ${newRole}`)
      fetchUsers()
    } catch {
      toast.error('Failed to update role')
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (!res.ok) throw new Error()
      toast.success('User deleted')
      fetchUsers()
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <Loader text="Loading users..." />

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="fw-bold mb-0">Users</h2>
        <span className="text-muted">{users.length} total</span>
      </div>

      <div className="d-flex mb-4" style={{ maxWidth: 400 }}>
        <div className="input-group">
          <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
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
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.avatar?.url || user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: 40, height: 40, objectFit: 'cover' }}
                  />
                </td>
                <td className="fw-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className={`form-select form-select-sm ${user.role === 'admin' ? 'border-warning text-warning' : ''}`}
                      style={{ width: 'auto' }}
                      value={user.role}
                      disabled={updating === user._id}
                      onChange={(e) => {
                        const newRole = e.target.value
                        if (newRole !== user.role) handleRoleChange(user._id, newRole)
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    {user.role === 'admin' && <FaUserShield className="text-warning" />}
                    {updating === user._id && <span className="spinner-border spinner-border-sm" />}
                  </div>
                </td>
                <td className="text-muted small">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                    : 'N/A'}
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" title="Delete" disabled={deleting === user._id} onClick={() => handleDelete(user._id)}>
                    {deleting === user._id ? <span className="spinner-border spinner-border-sm" /> : <FaTrash />}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">{search ? 'No matching users' : 'No users yet'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsers
