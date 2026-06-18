export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getDiscountPercent = (original, discounted) => {
  if (!discounted || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

export const truncateText = (text, maxLength = 100) => {
  if (text?.length <= maxLength) return text;
  return text?.substring(0, maxLength) + '...';
};

export const getImageUrl = (images) => {
  if (images && images.length > 0) return images[0]?.url;
  return 'https://via.placeholder.com/300x300?text=No+Image';
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };
  return colors[status] || 'secondary';
};
