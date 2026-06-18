import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { forgotPassword, resetPassword } from '../services/authService'
import { FaEnvelope, FaLock } from 'react-icons/fa'

function ForgotPasswordPage() {
  const { token } = useParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
      toast.success('Email sent! Check your inbox.')
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await resetPassword(token, password)
      setResetDone(true)
      toast.success('Password reset successful!')
    } catch {
    } finally {
      setLoading(false)
    }
  }

  if (token && resetDone) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="card shadow-sm border-0 rounded-4" style={{ maxWidth: 440, width: '100%' }}>
          <div className="card-body p-5 text-center">
            <div className="mb-3 text-success fs-1">
              <FaLock />
            </div>
            <h4 className="fw-bold mb-2">Password Reset Successful!</h4>
            <p className="text-muted mb-4">
              Your password has been updated successfully.
            </p>
            <Link to="/login" className="btn btn-primary btn-lg w-100 fw-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (token) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="card shadow-sm border-0 rounded-4" style={{ maxWidth: 440, width: '100%' }}>
          <div className="card-body p-5">
            <h4 className="text-center fw-bold mb-1">Reset Password</h4>
            <p className="text-muted text-center mb-4">Enter your new password</p>

            <form onSubmit={handleResetSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">New Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Confirm Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : null}
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="card shadow-sm border-0 rounded-4" style={{ maxWidth: 440, width: '100%' }}>
          <div className="card-body p-5 text-center">
            <div className="mb-3 text-success fs-1">
              <FaEnvelope />
            </div>
            <h4 className="fw-bold mb-2">Check Your Inbox</h4>
            <p className="text-muted mb-4">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn btn-primary btn-lg w-100 fw-semibold">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow-sm border-0 rounded-4" style={{ maxWidth: 440, width: '100%' }}>
        <div className="card-body p-5">
          <h4 className="text-center fw-bold mb-1">Forgot Password?</h4>
          <p className="text-muted text-center mb-4">
            Enter your email and we&apos;ll send you a reset link
          </p>

          <form onSubmit={handleForgotSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : null}
              Send Reset Link
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Remember your password?{' '}
            <Link to="/login" className="text-decoration-none fw-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
