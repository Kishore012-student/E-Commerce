import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { getFeaturedProducts } from '../services/productService';

const HeroBanner = () => {
  const { data: featuredProducts, loading } = useFetch(getFeaturedProducts);

  if (loading || !featuredProducts?.length) return null;

  const displayed = featuredProducts.slice(0, 4);

  return (
    <div id="heroBanner" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
      <div className="carousel-indicators">
        {displayed.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#heroBanner"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-current={index === 0 ? 'true' : undefined}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {displayed.map((product, index) => (
          <div key={product._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <div
              className="hero-slide"
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '70vh',
                minHeight: '400px',
                maxHeight: '600px',
              }}
            >
              <div className="hero-overlay" style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)',
              }} />
              <div className="carousel-caption d-flex flex-column justify-content-end h-100 pb-5" style={{ position: 'relative', zIndex: 2, textAlign: 'left', left: 0, right: 0, bottom: 0, padding: '2rem 4rem' }}>
                <h2 className="display-5 fw-bold text-white mb-3">{product.title}</h2>
                <p className="lead text-white-50 mb-4 d-none d-md-block" style={{ maxWidth: '600px' }}>
                  {product.description?.length > 150
                    ? `${product.description.substring(0, 150)}...`
                    : product.description}
                </p>
                <div>
                  <Link to={`/products/${product._id}`} className="btn btn-primary btn-lg px-4">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#heroBanner" data-bs-slide="prev">
        <FaChevronLeft className="fs-2" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroBanner" data-bs-slide="next">
        <FaChevronRight className="fs-2" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default HeroBanner;
