import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import { login } from '@redux/actions/auth';
import { 
  storeTokens, 
  removeTokens, 
  hasStoredTokens,
  getStoredAdminData 
} from '@utils/localstorageutil';

export const signIn = asyncThunkRequest('auth/signin', body => login(body));

// Check initial auth state from localStorage
const getInitialState = () => {
  const hasTokens = hasStoredTokens();
  const storedData = getStoredAdminData();
  
  return {
    isLoggedIn: hasTokens,
    isAuthChecked: false,  // Will be set true after verification
    data: storedData,
    error: null,
    loading: false
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    forceLogout: state => {
      state.isLoggedIn = false;
      state.isAuthChecked = true;
      state.data = null;
      state.loading = false;
      state.error = null;
      removeTokens();
    },
    
    // Called when auth verification succeeds
    setAuthVerified: (state, { payload }) => {
      state.isAuthChecked = true;
      state.isLoggedIn = true;
      if (payload?.adminData) {
        state.data = payload.adminData;
      }
    },
    
    // Called when auth verification fails
    setAuthFailed: state => {
      state.isAuthChecked = true;
      state.isLoggedIn = false;
      state.data = null;
      removeTokens();
    },
    
    // Update admin data (after profile fetch)
    setAdminData: (state, { payload }) => {
      state.data = payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signIn.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.isAuthChecked = true;
        state.data = payload.adminData || payload;
        
        if (payload.accessToken && payload.refreshToken) {
          storeTokens(payload);
        }
      })
      .addCase(signIn.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.isAuthChecked = true;
        state.error = payload || error?.message || 'Something went wrong';
      });
  }
});

export const { 
  forceLogout, 
  setAuthVerified, 
  setAuthFailed,
  setAdminData 
} = authSlice.actions;

export default authSlice.reducer;