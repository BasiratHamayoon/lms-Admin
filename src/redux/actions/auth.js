import api from '@utils/axiosInstance';

export const login = data => api.post('/login', data);
