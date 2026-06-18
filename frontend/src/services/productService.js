import API from './axios';

export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getFeaturedProducts = () => API.get('/products/featured');
export const getTrendingProducts = () => API.get('/products/trending');
export const getNewArrivals = () => API.get('/products/new-arrivals');
export const getRelatedProducts = (id) => API.get(`/products/related/${id}`);
export const getAdminProducts = () => API.get('/products/admin');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (data) => API.put('/products/review/add', data);
export const getProductReviews = (id) => API.get(`/products/reviews?id=${id}`);
export const deleteReview = (productId, reviewId) =>
  API.delete(`/products/review/delete?productId=${productId}&id=${reviewId}`);
