import api from '@utils/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search, type, active } = params;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (type) queryParams.append('type', type);
      if (active !== undefined && active !== 'all') queryParams.append('active', active);

      const response = await api.get(`/departments?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch departments'
      );
    }
  }
);

export const fetchDepartmentById = createAsyncThunk(
  'departments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/departments/${id}`);
      return response.data.data.department;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch department'
      );
    }
  }
);

export const fetchDepartmentOptions = createAsyncThunk(
  'departments/fetchOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/departments-options'); 
      console.log("Fetched department options:", response.data);
      
      const data = response.data;
            if (data.data && Array.isArray(data.data.departments)) {
        return data.data.departments;
      }
            if (Array.isArray(data.data)) {
        return data.data;
      }
      
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch department options'
      );
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/create',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/departments', departmentData);
      return response.data.data.department;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create department'
      );
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/departments/${id}`, data);
      return response.data.data.department;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update department'
      );
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/departments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete department'
      );
    }
  }
);

export const fetchDepartmentStats = createAsyncThunk(
  'departments/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/departments/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch department stats'
      );
    }
  }
);

export const fetchActiveInactiveChart = createAsyncThunk(
  'departments/fetchActiveInactiveChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/departments/status/chart');
      return response.data.data.chart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch chart data'
      );
    }
  }
);

export const fetchMemberDistributionChart = createAsyncThunk(
  'departments/fetchMemberDistributionChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/departments/members/chart');
      return response.data.data.chart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch distribution chart'
      );
    }
  }
);