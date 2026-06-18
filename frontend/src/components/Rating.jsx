import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

function Rating({ value, text, color = '#f8c84a' }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} style={{ color }} />)
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} style={{ color }} />)
    } else {
      stars.push(<FaRegStar key={i} style={{ color }} />)
    }
  }

  return (
    <div className="d-inline-flex align-items-center gap-1">
      {stars}
      {text && <span className="text-muted small ms-1">{text}</span>}
    </div>
  )
}

export default Rating
