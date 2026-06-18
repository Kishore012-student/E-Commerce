import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaUser, FaMoon, FaSun, FaBars, FaSearch, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useWishlist } from '../context/WishlistContext'

function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { wishlist } = useWishlist()
  const [searchTerm, setSearchTerm] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${searchTerm.trim()}`)
      setSearchTerm('')
      setExpanded(false)
    }
  }

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    setExpanded(false)
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/" onClick={() => setExpanded(false)}>
          ShopHub
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-controls="navbarNav"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/" onClick={() => setExpanded(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/products') ? 'active' : ''}`} to="/products" onClick={() => setExpanded(false)}>
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/about') ? 'active' : ''}`} to="/about" onClick={() => setExpanded(false)}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact') ? 'active' : ''}`} to="/contact" onClick={() => setExpanded(false)}>
                Contact
              </Link>
            </li>
          </ul>

          <form className="d-flex me-3 my-2 my-lg-0" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search"
              />
              <button className="btn btn-outline-light" type="submit">
                <FaSearch />
              </button>
            </div>
          </form>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>

            <Link
              to="/wishlist"
              className="btn btn-outline-light btn-sm position-relative d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}
              onClick={() => setExpanded(false)}
              title="Wishlist"
            >
              <FaHeart />
              {wishlist.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="btn btn-outline-light btn-sm position-relative d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}
              onClick={() => setExpanded(false)}
              title="Cart"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <button
                  className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded={dropdownOpen}
                >
                  <FaUser className="me-1" />
                  <span className="d-none d-md-inline">{user.name || 'User'}</span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}>
                  <li>
                    <Link className="dropdown-item" to="/profile" onClick={() => { setDropdownOpen(false); setExpanded(false) }}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders" onClick={() => { setDropdownOpen(false); setExpanded(false) }}>
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/wishlist" onClick={() => { setDropdownOpen(false); setExpanded(false) }}>
                      Wishlist
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-1">
                <Link className="btn btn-outline-light btn-sm" to="/login" onClick={() => setExpanded(false)}>
                  Login
                </Link>
                <Link className="btn btn-primary btn-sm" to="/signup" onClick={() => setExpanded(false)}>
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
