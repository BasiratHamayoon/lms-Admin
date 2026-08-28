// redux/actions/attendance.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosInstance';

// Helper to build query params
const buildParams = (paramsObj) => {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params.append(key, value);
    }
  });
  return params.toString();
};

export const getAllStaffForAttendance = createAsyncThunk(
  'attendance/getAllStaffForAttendance',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = buildParams(params);
      const res = await api.get(`/attendance-staff-list?${queryString}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch staff');
    }
  }
);

export const getAttendanceList = createAsyncThunk(
  'attendance/getList',
  async (paramsObj = {}, { rejectWithValue }) => {
    try {
      const queryString = buildParams(paramsObj);
      const res = await api.get(`/attendance/list?${queryString}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch list');
    }
  }
);

export const getAttendanceStats = createAsyncThunk(
  'attendance/getStats',
  async (paramsObj = {}, { rejectWithValue }) => {
    try {
      const queryString = buildParams(paramsObj);
      const res = await api.get(`/attendance-stats?${queryString}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Stats failed');
    }
  }
);

export const getAttendanceCharts = createAsyncThunk(
  'attendance/getCharts',
  async (paramsObj = {}, { rejectWithValue }) => {
    try {
      const queryString = buildParams(paramsObj);
      const res = await api.get(`/attendance-charts?${queryString}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Charts failed');
    }
  }
);

export const adminCheckIn = createAsyncThunk(
  'attendance/checkIn',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/attendance-check-in', payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to check in');
    }
  }
);

export const adminCheckOut = createAsyncThunk(
  'attendance/checkOut',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/attendance-check-out', payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to check out');
    }
  }
);

export const adminMarkAbsent = createAsyncThunk(
  'attendance/markAbsent',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/attendance-mark-absent', payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark absent');
    }
  }
);

export const adminMarkLeave = createAsyncThunk(
  'attendance/markLeave',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/attendance-mark-leave', payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark leave');
    }
  }
);

export const adminBulkCheckIn = createAsyncThunk(
  'attendance/bulkCheckIn',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/attendance-bulk-check-in', payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Bulk check-in failed');
    }
  }
);

export const adminBulkCheckOut = createAsyncThunk(
  'attendance/bulkCheckOut',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/attendance-bulk-check-out', payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Bulk check-out failed');
    }
  }
);

export const adminBulkMarkAbsent = createAsyncThunk(
  'attendance/bulkMarkAbsent',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/attendance-bulk-mark-absent', payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Bulk absent failed');
    }
  }
);

export const adminBulkMarkLeave = createAsyncThunk(
  'attendance/bulkMarkLeave',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/attendance-bulk-mark-leave', payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Bulk leave failed');
    }
  }
);

export const getAttendanceDetails = createAsyncThunk(
  'attendance/getDetails',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/attendance/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch details');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/attendance/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const deleteAttendance = createAsyncThunk(
  'attendance/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/attendance/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

export const getAttendanceSummary = createAsyncThunk(
  'attendance/getSummary',
  async (paramsObj = {}, { rejectWithValue }) => {
    try {
      const queryString = buildParams(paramsObj);
      const res = await api.get(`/attendance-summary?${queryString}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Summary failed');
    }
  }
);

export const getWorkHours = createAsyncThunk(
  'attendance/getWorkHours',
  async (departmentId, { rejectWithValue }) => {
    try {
      const params = departmentId ? `?departmentId=${departmentId}` : '';
      const res = await api.get(`/attendance-work-hours${params}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Work hours failed');
    }
  }
);

export const updateWorkHours = createAsyncThunk(
  'attendance/updateWorkHours',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.put('/attendance-work-hours', payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update work hours failed');
    }
  }
);