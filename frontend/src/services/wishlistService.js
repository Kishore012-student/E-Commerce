import API from './axios';

export const getWishlist = () => API.get('/wishlist');
export const addToWishlist = (productId) => API.post('/wishlist/add', { productId });
export const removeFromWishlist = (id) => API.delete(`/wishlist/remove/${id}`);
