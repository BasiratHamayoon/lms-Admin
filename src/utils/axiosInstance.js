import axios from 'axios';
import i18n from 'i18next';
import { getLocalStorageValue, removeTokens, storeTokens } from '@utils/localstorageutil';
import CONSTANTS from '@data/Constants';
import { forceLogout } from '@redux/slice/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

export const attachStore = store => {
  api.interceptors.request.use(config => {
    const token = getLocalStorageValue(CONSTANTS.ACCESS_TOKEN);
    
    // --- FIX START ---
    
    // This variable holds the full language code, e.g., 'en-GB'
    const language = i18n.language || localStorage.getItem('i18nextLng') || 'en';
    
    // This new line extracts only the primary language code, e.g., 'en'
    const primaryLang = language.split('-')[0];
    
    // --- FIX END ---
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // The Accept-Language header can still contain the full regional code, which is fine.
    config.headers['Accept-Language'] = language;
    
    if (!config.params) {
      config.params = {};
    }
    
    // Use the corrected `primaryLang` for the URL parameter to satisfy the API.
    config.params.lang = primaryLang;
    
    return config;
  });

  api.interceptors.response.use(
    response => response,
    async error => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        const refresh = getLocalStorageValue(CONSTANTS.REFRESH_TOKEN);
        if (!refresh) {
          store.dispatch(forceLogout());
          return Promise.reject(error);
        }

        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refreshToken: refresh },
            { withCredentials: true }
          );
          storeTokens(data.data);
          return api(original); 
        } catch {
          removeTokens();
          store.dispatch(forceLogout());
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;