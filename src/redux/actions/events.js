import api from '@utils/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search, type, visibility, status, startDate, endDate, sort, order } = params;

      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (type && type !== 'all') queryParams.append('type', type);
      if (visibility && visibility !== 'all') queryParams.append('visibility', visibility);
      if (status && status !== 'all') queryParams.append('status', status);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (sort) queryParams.append('sort', sort);
      if (order) queryParams.append('order', order);

      const response = await api.get(`/events?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch events'
      );
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data.data.event; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch event'
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data.data.event; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create event'
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/events/${id}`, data);
      return response.data.data.event; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update event'
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete event'
      );
    }
  }
);

export const fetchEventStats = createAsyncThunk(
  'events/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch event stats'
      );
    }
  }
);