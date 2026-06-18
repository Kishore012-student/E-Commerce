import API from './axios';

export const validateCoupon = (data) => API.post('/coupons/validate', data);
export const getCoupons = () => API.get('/coupons');
export const createCoupon = (data) => API.post('/coupons', data);
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);
