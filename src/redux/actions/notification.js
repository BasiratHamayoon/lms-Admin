import api from '@utils/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        type,
        priority,
        status,
        targetAudience,
        targetClass,
        sortBy,
        order
      } = params;

      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (type && type !== 'all') queryParams.append('type', type);
      if (priority && priority !== 'all') queryParams.append('priority', priority);
      if (status && status !== 'all') queryParams.append('status', status);
      if (targetAudience && targetAudience !== 'all') queryParams.append('targetAudience', targetAudience);
      if (targetClass && targetClass !== 'all') queryParams.append('targetClass', targetClass);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (order) queryParams.append('order', order);

      const response = await api.get(`/notifications?${queryParams.toString()}`);
      console.log('Fetched notifications response:', response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notifications'
      );
    }
  }
);

export const fetchNotificationById = createAsyncThunk(
  'notifications/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notifications/${id}`);
      return response.data.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notification'
      );
    }
  }
);

export const createNotification = createAsyncThunk(
  'notifications/create',
  async (formData, { rejectWithValue }) => {
    try {
      const isFormData = formData instanceof FormData;
      const response = await api.post('/notifications', formData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return response.data.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create notification'
      );
    }
  }
);

export const updateNotification = createAsyncThunk(
  'notifications/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await api.put(`/notifications/${id}`, data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return response.data.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update notification'
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete notification'
      );
    }
  }
);

export const publishNotification = createAsyncThunk(
  'notifications/publish',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/notifications/${id}/publish`);
      return response.data.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to publish notification'
      );
    }
  }
);

export const archiveNotification = createAsyncThunk(
  'notifications/archive',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/notifications/${id}/archive`);
      return response.data.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to archive notification'
      );
    }
  }
);

export const fetchNotificationStats = createAsyncThunk(
  'notifications/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications-stats');
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notification stats'
      );
    }
  }
);