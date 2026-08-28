import api from '@utils/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTimetables = createAsyncThunk(
  'timetables/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null && v !== 'all' && v !== ''));
      const response = await api.get(`/timetables?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetables');
    }
  }
);

export const fetchTimetableById = createAsyncThunk(
  'timetables/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/timetables/${id}`);
      return response.data.data.timetable;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetable');
    }
  }
);

export const createTimetable = createAsyncThunk(
  'timetables/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/timetables', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data.timetable;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create timetable');
    }
  }
);

export const updateTimetable = createAsyncThunk(
  'timetables/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await api.patch(`/timetables/${id}`, data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return response.data.data.timetable;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update timetable');
    }
  }
);

export const deleteTimetable = createAsyncThunk(
  'timetables/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/timetables/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete timetable');
    }
  }
);

export const fetchTimetableStats = createAsyncThunk(
  'timetables/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/timetable-stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetable stats');
    }
  }
);

export const fetchTimetableByClassChart = createAsyncThunk(
  'timetables/fetchByClassChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/timetable-class-chart');
      return response.data.data.chart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class chart');
    }
  }
);

export const fetchTimetableStatusChart = createAsyncThunk(
  'timetables/fetchStatusChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/timetable-status-chart');
      return response.data.data.chart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch status chart');
    }
  }
);

export const fetchTimetableOptions = createAsyncThunk(
  'timetables/fetchOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/timetables-options');
      return response.data.data.timetables;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetable options');
    }
  }
);

export const fetchTimetableByClass = createAsyncThunk(
  'timetables/fetchByClass',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/timetables-class/${classId}`);
      return response.data.data.timetable;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class timetable');
    }
  }
);