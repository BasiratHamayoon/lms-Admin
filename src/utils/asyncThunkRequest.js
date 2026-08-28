import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorToast } from '@utils/toastUtil';

function asyncThunkRequest(typePrefix, callback) {
  return createAsyncThunk(typePrefix, async (args, { rejectWithValue }) => {
    try {
      const response = await callback(args);
      if (response?.data) {
        return response.data.data || response.data;
      }

      // Fallback for responses without .data
      return response;
    } catch (err) {
      errorToast(err?.response?.data?.message || err?.message || 'Something went wrong');
      return rejectWithValue(err?.response?.data?.message || err?.message || 'Something went wrong');
    }
  });
}

export default asyncThunkRequest;
