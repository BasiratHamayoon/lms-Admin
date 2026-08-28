import api from '@utils/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStaffList = createAsyncThunk(
  'staff/fetchList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search, role, department, sort, order } = params;

      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      queryParams.append('staffOnly', 'true'); 
      
      if (search) queryParams.append('search', search);
      if (role && role !== 'all') queryParams.append('role', role);
      if (department && department !== 'all') queryParams.append('department', department);
      if (sort) queryParams.append('sort', sort);
      if (order) queryParams.append('order', order);

      const response = await api.get(`/all-users?${queryParams.toString()}`);
      console.log("Staff Fetched:", response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch staff'
      );
    }
  }
);

export const fetchStaffById = createAsyncThunk(
  'staff/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${id}`);
      return response.data.data.userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch staff member'
      );
    }
  }
);

export const createStaff = createAsyncThunk(
  'staff/create',
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await api.post('/create-user', staffData);
      return response.data.data.userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create staff member'
      );
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/update-user/${id}`, data);
      return response.data.data.userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update staff member'
      );
    }
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/delete-user/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete staff member'
      );
    }
  }
);

export const fetchStaffStats = createAsyncThunk(
  'staff/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/staff-stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch staff stats'
      );
    }
  }
);

export const fetchStaffMonthChart = createAsyncThunk(
  'staff/fetchMonthChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/staff-month-chart');
      console.log('Month Chart Response:', response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch chart data'
      );
    }
  }
);

export const fetchStaffRoleChart = createAsyncThunk(
  'staff/fetchRoleChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/staff-role-chart');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch role chart data'
      );
    }
  }
);