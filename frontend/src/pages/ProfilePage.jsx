import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaUser, FaCamera, FaTimes, FaLock, FaMapMarkerAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { updateProfile, updatePassword, updateAvatar } from '../services/authService'
import { getImageUrl } from '../utils/helpers'
import Breadcrumb from '../components/Breadcrumb'
import Loader from '../components/Loader'

function ProfilePage() {
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [addresses, setAddresses] = useState([])
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false,
  })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
      const saved = localStorage.getItem('addresses')
      if (saved) setAddresses(JSON.parse(saved))
    }
  }, [user])

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await updateProfile(profile)
      setUser(data.user)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const { data } = await updateAvatar(formData)
      setUser(data.user)
      toast.success('Avatar updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update avatar')
    }
  }

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      toast.success('Password updated successfully')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const saveAddresses = (updated) => {
    setAddresses(updated)
    localStorage.setItem('addresses', JSON.stringify(updated))
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    if (!addressForm.fullName || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
      toast.error('Please fill in all required fields')
      return
    }
    let updated
    if (editingAddress) {
      updated = addresses.map((a) => (a.id === editingAddress.id ? { ...addressForm, id: editingAddress.id } : a))
      toast.success('Address updated')
    } else {
      updated = [...addresses, { ...addressForm, id: Date.now() }]
      toast.success('Address added')
    }
    saveAddresses(updated)
    setShowAddressModal(false)
    setEditingAddress(null)
    resetAddressForm()
  }

  const deleteAddress = (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    const updated = addresses.filter((a) => a.id !== id)
    saveAddresses(updated)
    toast.success('Address deleted')
  }

  const editAddress = (addr) => {
    setEditingAddress(addr)
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      isDefault: addr.isDefault,
    })
    setShowAddressModal(true)
  }

  const resetAddressForm = () => {
    setAddressForm({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false,
    })
  }

  const openNewAddress = () => {
    setEditingAddress(null)
    resetAddressForm()
    setShowAddressModal(true)
  }

  const avatarUrl = user?.avatar
    ? typeof user.avatar === 'string'
      ? user.avatar
      : user.avatar?.url
    : null

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'My Profile' }]} />

      <h2 className="fw-bold mb-4">
        <FaUser className="me-2" />
        My Profile
      </h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser className="me-1" /> Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <FaMapMarkerAlt className="me-1" /> Addresses
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <FaLock className="me-1" /> Change Password
          </button>
        </li>
      </ul>

      {activeTab === 'profile' && (
        <div className="row">
          <div className="col-lg-4 text-center mb-4">
            <div className="position-relative d-inline-block">
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden border"
                style={{ width: 150, height: 150 }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-100 h-100 object-fit-cover" />
                ) : (
                  <FaUser size={50} className="text-secondary" />
                )}
              </div>
              <label
                className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle p-2"
                style={{ cursor: 'pointer' }}
              >
                <FaCamera />
                <input type="file" accept="image/*" className="d-none" onChange={handleAvatarChange} />
              </label>
            </div>
          </div>
          <div className="col-lg-8">
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={profile.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>
              <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Saved Addresses</h5>
            <button className="btn btn-primary btn-sm" onClick={openNewAddress}>
              + Add New Address
            </button>
          </div>
          {addresses.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaMapMarkerAlt size={40} className="mb-3" />
              <p>No addresses saved yet.</p>
            </div>
          ) : (
            <div className="row g-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h6 className="fw-bold mb-1">{addr.fullName}</h6>
                        {addr.isDefault && <span className="badge bg-primary">Default</span>}
                      </div>
                      <p className="mb-1 text-muted small">{addr.phone}</p>
                      <p className="mb-2">
                        {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                        <br />
                        {addr.country}
                      </p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => editAddress(addr)}>
                          Edit
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteAddress(addr.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'password' && (
        <div className="row">
          <div className="col-lg-6">
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingAddress ? 'Edit Address' : 'Add New Address'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddressModal(false)} />
              </div>
              <form onSubmit={handleAddressSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Street</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm((p) => ({ ...p, zipCode: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Country</label>
                      <input type="text" className="form-control" value={addressForm.country} disabled />
                    </div>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="defaultAddress"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="defaultAddress">
                      Set as default address
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddressModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAddress ? 'Update' : 'Save'} Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
