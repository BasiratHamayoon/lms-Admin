import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import {
  fetchProfile,
  updateProfile,
  changePassword,
  changeEmail
} from '@redux/actions/setting';

export const getAdminProfile = asyncThunkRequest(
  'admin/getProfile',
  () => fetchProfile()
);

export const updateAdminProfile = asyncThunkRequest(
  'admin/updateProfile',
  body => updateProfile(body)
);

export const changeAdminPassword = asyncThunkRequest(
  'admin/changePassword',
  body => changePassword(body)
);

export const changeAdminEmail = asyncThunkRequest(
  'admin/changeEmail',
  body => changeEmail(body)
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    profile: null,

    loadingProfile: false,
    updatingProfile: false,
    changingPassword: false,
    changingEmail: false,

    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAdminProfile.pending, state => {
        state.loadingProfile = true;
        state.error = null;
      })
      .addCase(getAdminProfile.fulfilled, (state, { payload }) => {
        state.loadingProfile = false;
        state.profile = payload.adminData || payload;
      })
      .addCase(getAdminProfile.rejected, (state, { payload, error }) => {
        state.loadingProfile = false;
        state.error = payload || error?.message || 'Something went wrong';
      });

    builder
      .addCase(updateAdminProfile.pending, state => {
        state.updatingProfile = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, { payload }) => {
        state.updatingProfile = false;
        state.profile = payload.adminData || payload;
      })
      .addCase(updateAdminProfile.rejected, (state, { payload, error }) => {
        state.updatingProfile = false;
        state.error = payload || error?.message || 'Something went wrong';
      });

    builder
      .addCase(changeAdminPassword.pending, state => {
        state.changingPassword = true;
        state.error = null;
      })
      .addCase(changeAdminPassword.fulfilled, state => {
        state.changingPassword = false;
      })
      .addCase(changeAdminPassword.rejected, (state, { payload, error }) => {
        state.changingPassword = false;
        state.error = payload || error?.message || 'Something went wrong';
      });

    builder
      .addCase(changeAdminEmail.pending, state => {
        state.changingEmail = true;
        state.error = null;
      })
      .addCase(changeAdminEmail.fulfilled, (state, { payload }) => {
        state.changingEmail = false;
        if (payload?.adminData) {
          state.profile = payload.adminData;
        }
      })
      .addCase(changeAdminEmail.rejected, (state, { payload, error }) => {
        state.changingEmail = false;
        state.error = payload || error?.message || 'Something went wrong';
      });
  }
});

export default adminSlice.reducer;