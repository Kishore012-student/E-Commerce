import API from './axios';

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const logoutUser = () => API.get('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/update-profile', data);
export const updatePassword = (data) => API.put('/auth/update-password', data);
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) =>
  API.put(`/auth/reset-password/${token}`, { password });
export const updateAvatar = (data) => API.put('/auth/update-avatar', data);
