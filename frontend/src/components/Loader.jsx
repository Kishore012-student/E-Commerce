import React from 'react'

function Loader({ size = 'lg', text = '', overlay = false }) {
  const spinnerSize = size === 'sm' ? 'spinner-border-sm' : ''

  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className={`spinner-border text-primary ${spinnerSize}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-2 mb-0 text-muted">{text}</p>}
    </div>
  )

  if (overlay) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 9999 }}>
        {content}
      </div>
    )
  }

  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      {content}
    </div>
  )
}

export default Loader
