import CONSTANTS from '@data/Constants';

export const storeInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorageValue = key => {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return null;
};

export const removeFromLocalStorage = key => {
  localStorage.removeItem(key);
};

export const storeTokens = data => {
  const { accessToken, refreshToken, adminData } = data;
  storeInLocalStorage(CONSTANTS.ACCESS_TOKEN, accessToken);
  storeInLocalStorage(CONSTANTS.REFRESH_TOKEN, refreshToken);
  
  // Also store admin data for persistence
  if (adminData) {
    storeInLocalStorage(CONSTANTS.ADMIN_DATA, adminData);
  }
};

export const getTokens = () => {
  const accessToken = getLocalStorageValue(CONSTANTS.ACCESS_TOKEN);
  const refreshToken = getLocalStorageValue(CONSTANTS.REFRESH_TOKEN);
  
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
};

export const getAccessToken = () => {
  return getLocalStorageValue(CONSTANTS.ACCESS_TOKEN);
};

export const getRefreshToken = () => {
  return getLocalStorageValue(CONSTANTS.REFRESH_TOKEN);
};

export const getStoredAdminData = () => {
  return getLocalStorageValue(CONSTANTS.ADMIN_DATA);
};

export const removeTokens = () => {
  removeFromLocalStorage(CONSTANTS.ACCESS_TOKEN);
  removeFromLocalStorage(CONSTANTS.REFRESH_TOKEN);
  removeFromLocalStorage(CONSTANTS.ADMIN_DATA);
};

// Alias for clarity
export const clearTokens = removeTokens;

// Check if user has valid tokens stored
export const hasStoredTokens = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken && refreshToken);
};