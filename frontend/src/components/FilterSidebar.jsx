import { useState, useEffect } from 'react';

const FilterSidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  onApply,
  onReset,
}) => {
  const [localMin, setLocalMin] = useState(priceRange?.min || '');
  const [localMax, setLocalMax] = useState(priceRange?.max || '');
  const [localCategory, setLocalCategory] = useState(selectedCategory || '');
  const [localSort, setLocalSort] = useState(sortBy || '');

  useEffect(() => {
    setLocalMin(priceRange?.min || '');
    setLocalMax(priceRange?.max || '');
  }, [priceRange]);

  useEffect(() => {
    setLocalCategory(selectedCategory || '');
  }, [selectedCategory]);

  useEffect(() => {
    setLocalSort(sortBy || '');
  }, [sortBy]);

  const handleApply = () => {
    if (setSelectedCategory) setSelectedCategory(localCategory);
    if (setPriceRange) setPriceRange({ min: localMin, max: localMax });
    if (setSortBy) setSortBy(localSort);
    if (onApply) onApply();
  };

  const handleReset = () => {
    setLocalCategory('');
    setLocalMin('');
    setLocalMax('');
    setLocalSort('');
    if (setSelectedCategory) setSelectedCategory('');
    if (setPriceRange) setPriceRange({ min: '', max: '' });
    if (setSortBy) setSortBy('');
    if (onReset) onReset();
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex d-lg-none justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Filters</h5>
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#filterCollapse"
            aria-expanded="false"
            aria-controls="filterCollapse"
          >
            Toggle Filters
          </button>
        </div>
        <div className="collapse d-lg-block" id="filterCollapse">
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Categories</h6>
            <div className="d-flex flex-column gap-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="category"
                  id="catAll"
                  value=""
                  checked={localCategory === ''}
                  onChange={() => setLocalCategory('')}
                />
                <label className="form-check-label" htmlFor="catAll">All Categories</label>
              </div>
              {categories?.map((cat) => (
                <div key={cat._id || cat} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="category"
                    id={`cat_${cat._id || cat}`}
                    value={cat._id || cat}
                    checked={localCategory === (cat._id || cat)}
                    onChange={() => setLocalCategory(cat._id || cat)}
                  />
                  <label className="form-check-label" htmlFor={`cat_${cat._id || cat}`}>
                    {cat.name || cat}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Price Range</h6>
            <div className="d-flex gap-2 align-items-center">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                min="0"
                aria-label="Minimum price"
              />
              <span className="text-muted">-</span>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                min="0"
                aria-label="Maximum price"
              />
            </div>
          </div>
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Sort By</h6>
            <select
              className="form-select form-select-sm"
              value={localSort}
              onChange={(e) => setLocalSort(e.target.value)}
              aria-label="Sort by"
            >
              <option value="">Default</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price Low to High</option>
              <option value="price_desc">Price High to Low</option>
              <option value="rating_desc">Rating High to Low</option>
            </select>
          </div>
          <div className="d-grid gap-2">
            <button className="btn btn-primary" onClick={handleApply}>
              Apply Filters
            </button>
            <button className="btn btn-outline-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
