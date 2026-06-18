import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { FaTh, FaList, FaSearch, FaTimes } from 'react-icons/fa'
import useFetch from '../hooks/useFetch'
import { getProducts } from '../services/productService'
import { getCategories } from '../services/categoryService'
import FilterSidebar from '../components/FilterSidebar'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import Breadcrumb from '../components/Breadcrumb'
import ErrorComponent from '../components/ErrorComponent'

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const keyword = searchParams.get('keyword') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const [viewMode, setViewMode] = useState('grid')
  const [searchInput, setSearchInput] = useState(keyword)

  const sortMap = {
    newest: '-createdAt',
    price_asc: 'price',
    price_desc: '-price',
    rating_desc: '-ratings',
  }

  const queryParams = {}
  if (keyword) queryParams.keyword = keyword
  if (category) queryParams.category = category
  if (sort) queryParams.sort = sortMap[sort] || sort
  queryParams.page = page

  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  if (priceRange.min) queryParams['price[gte]'] = priceRange.min
  if (priceRange.max) queryParams['price[lte]'] = priceRange.max

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    execute: refetchProducts,
    setData: setProductsData,
  } = useFetch(() => getProducts(queryParams))

  const {
    data: categories,
    loading: categoriesLoading,
  } = useFetch(getCategories)

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    if (updates.category !== undefined || updates.keyword !== undefined || updates.sort !== undefined) {
      newParams.delete('page')
    }
    setSearchParams(newParams)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateParams({ keyword: searchInput, page: '' })
  }

  const clearSearch = () => {
    setSearchInput('')
    updateParams({ keyword: '' })
  }

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeFilter = (filterKey) => {
    updateParams({ [filterKey]: '' })
  }

  const activeFilters = []
  if (keyword) activeFilters.push({ key: 'keyword', label: `Search: "${keyword}"` })
  if (category) {
    const catName = categories?.categories?.find((c) => c._id === category)?.name || category
    activeFilters.push({ key: 'category', label: `Category: ${catName}` })
  }
  if (sort) {
    const sortLabels = { newest: 'Newest', price_asc: 'Price: Low to High', price_desc: 'Price: High to Low', rating_desc: 'Rating: High to Low' }
    activeFilters.push({ key: 'sort', label: `Sort: ${sortLabels[sort] || sort}` })
  }

  const products = productsData?.products || []
  const totalPages = productsData?.totalPages || 1
  const totalProducts = productsData?.totalProducts || 0

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'Products' }]} />

      <div className="row">
        <div className="col-lg-3 mb-4">
          <FilterSidebar
            categories={categories?.categories || []}
            selectedCategory={category}
            setSelectedCategory={(val) => updateParams({ category: val })}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sort}
            setSortBy={(val) => updateParams({ sort: val })}
            onApply={() => {}}
            onReset={() => {
              setSearchInput('')
              setPriceRange({ min: '', max: '' })
              setSearchParams({})
            }}
          />
        </div>

        <div className="col-lg-9">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3 mb-4">
            <form onSubmit={handleSearch} className="d-flex flex-grow-1" style={{ maxWidth: '400px' }}>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 border-end-0"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  aria-label="Search products"
                />
                {searchInput && (
                  <button className="btn btn-outline-secondary" type="button" onClick={clearSearch} aria-label="Clear search">
                    <FaTimes />
                  </button>
                )}
                <button className="btn btn-primary" type="submit">Search</button>
              </div>
            </form>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">{totalProducts} product{totalProducts !== 1 ? 's' : ''} found</span>
              <div className="btn-group ms-2" role="group" aria-label="View mode">
                <button
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <FaTh />
                </button>
                <button
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className="text-muted small">Active Filters:</span>
              {activeFilters.map((filter) => (
                <span key={filter.key} className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 py-2 px-3">
                  {filter.label}
                  <button
                    className="btn-close btn-close-sm ms-1"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() => removeFilter(filter.key)}
                    aria-label={`Remove ${filter.key} filter`}
                  />
                </span>
              ))}
            </div>
          )}

          {productsLoading ? (
            <Loader />
          ) : productsError ? (
            <ErrorComponent message={productsError} onRetry={refetchProducts} />
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No products found</h5>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
              <button className="btn btn-primary" onClick={() => { setSearchInput(''); setSearchParams({}) }}>
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="row g-3">
              {products.map((product) => (
                <div key={product._id} className="col-12 col-sm-6 col-lg-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {products.map((product) => (
                <div key={product._id} className="card shadow-sm border-0">
                  <div className="row g-0">
                    <div className="col-md-3">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'}
                        alt={product.title}
                        className="img-fluid rounded-start h-100"
                        style={{ objectFit: 'cover', minHeight: '180px' }}
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="card-body d-flex flex-column h-100">
                        <ProductCard product={product} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
