import React from 'react'
import { Link } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import Loader from '../components/Loader'
import ErrorComponent from '../components/ErrorComponent'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import useFetch from '../hooks/useFetch'
import { getFeaturedProducts, getTrendingProducts, getNewArrivals } from '../services/productService'
import { getCategories } from '../services/categoryService'

function HomePage() {
  const {
    data: featuredProducts,
    loading: featuredLoading,
    error: featuredError,
    execute: refetchFeatured,
  } = useFetch(getFeaturedProducts)
  const {
    data: trendingProducts,
    loading: trendingLoading,
    error: trendingError,
    execute: refetchTrending,
  } = useFetch(getTrendingProducts)
  const {
    data: newArrivals,
    loading: newArrivalsLoading,
    error: newArrivalsError,
    execute: refetchNewArrivals,
  } = useFetch(getNewArrivals)
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    execute: refetchCategories,
  } = useFetch(getCategories)

  const renderProductSection = (title, data, loading, error, refetch, linkText = 'See All') => (
    <section className="mb-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-0">{title}</h2>
        <Link to="/products" className="btn btn-outline-primary btn-sm rounded-pill px-3">
          {linkText} <span className="ms-1">&rarr;</span>
        </Link>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorComponent message={error} onRetry={refetch} />
      ) : (
        <div className="row g-3">
          {data?.products?.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )

  return (
    <div>
      <HeroBanner />

      <div className="container py-5">
        {categoriesLoading ? (
          <Loader />
        ) : categoriesError ? (
          <ErrorComponent message={categoriesError} onRetry={refetchCategories} />
        ) : (
          <section className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="fw-bold mb-0">Shop by Category</h2>
              <Link to="/products" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                View All <span className="ms-1">&rarr;</span>
              </Link>
            </div>
            <div className="row g-3">
              {categories?.categories?.map((category) => (
                <div key={category._id} className="col-6 col-md-4 col-lg-2">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </section>
        )}

        {renderProductSection('Featured Products', featuredProducts, featuredLoading, featuredError, refetchFeatured)}
        {renderProductSection('Trending Now', trendingProducts, trendingLoading, trendingError, refetchTrending)}
        {renderProductSection('New Arrivals', newArrivals, newArrivalsLoading, newArrivalsError, refetchNewArrivals)}
      </div>
    </div>
  )
}

export default HomePage
