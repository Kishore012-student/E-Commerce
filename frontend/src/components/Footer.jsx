import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-0">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold mb-3">ShopHub</h5>
            <p className="text-secondary mb-3">
              Your one-stop destination for premium products at unbeatable prices. 
              We curate the best selection just for you.
            </p>
            <div className="d-flex gap-3 fs-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/products" className="text-secondary text-decoration-none">Products</Link></li>
              <li className="mb-2"><Link to="/about" className="text-secondary text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-secondary text-decoration-none">Contact Us</Link></li>
              <li className="mb-2"><Link to="/faq" className="text-secondary text-decoration-none">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Customer Service</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/profile" className="text-secondary text-decoration-none">My Account</Link></li>
              <li className="mb-2"><Link to="/orders" className="text-secondary text-decoration-none">Orders</Link></li>
              <li className="mb-2"><Link to="/wishlist" className="text-secondary text-decoration-none">Wishlist</Link></li>
              <li className="mb-2"><Link to="/shipping" className="text-secondary text-decoration-none">Shipping Info</Link></li>
              <li className="mb-2"><Link to="/returns" className="text-secondary text-decoration-none">Returns</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Contact Info</h6>
            <ul className="list-unstyled text-secondary">
              <li className="mb-2">123 Commerce Street, Suite 100</li>
              <li className="mb-2">New York, NY 10001</li>
              <li className="mb-2">
                <a href="tel:+1234567890" className="text-secondary text-decoration-none">+1 (234) 567-890</a>
              </li>
              <li className="mb-2">
                <a href="mailto:support@shophub.com" className="text-secondary text-decoration-none">support@shophub.com</a>
              </li>
            </ul>
            <h6 className="fw-bold mb-2 mt-4">We Accept</h6>
            <div className="d-flex gap-2 fs-4">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcPaypal />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border-top border-secondary pt-3 pb-3">
        <div className="container text-center text-secondary small">
          &copy; 2026 ShopHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
