import React from 'react'
import { Link } from 'react-router-dom'

function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category._id}`}
      className="text-decoration-none"
    >
      <div
        className="card border-0 rounded-3 overflow-hidden shadow-sm category-card"
        style={{
          height: '200px',
          backgroundImage: `url(${category.image || 'https://via.placeholder.com/400x200?text=Category'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div
          className="d-flex align-items-end justify-content-center h-100"
          style={{
            background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.7))',
          }}
        >
          <h5 className="text-white fw-bold pb-3 mb-0">{category.name}</h5>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
