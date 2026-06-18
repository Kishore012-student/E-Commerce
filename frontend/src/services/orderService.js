import API from './axios';

export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/me');
export const getOrderDetails = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (id) => API.put(`/orders/cancel/${id}`);
export const getAllOrders = () => API.get('/orders/admin');
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/admin/status/${id}`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);
