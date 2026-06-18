import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ value, onChange, onClear, placeholder }) => {
  const handleClear = () => {
    if (onClear) onClear();
  };

  return (
    <div className="input-group">
      <span className="input-group-text bg-white border-end-0">
        <FaSearch className="text-muted" />
      </span>
      <input
        type="text"
        className="form-control border-start-0"
        placeholder={placeholder || 'Search products...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
      />
      {value && (
        <button
          className="btn btn-outline-secondary border-start-0"
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
