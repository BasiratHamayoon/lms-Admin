import api from '@utils/axiosInstance';

export const fetchProfile = () => api.get('/profile');
export const updateProfile = body => api.patch('/profile', body);
export const changePassword = body => api.patch('/change-password', body);
export const changeEmail = body => api.patch('/change-email', body);