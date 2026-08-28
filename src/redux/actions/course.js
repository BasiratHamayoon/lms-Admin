import api from '@utils/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search, category, active, sortBy, order } = params;
      const queryParams = new URLSearchParams({ page, limit });
      if (search) queryParams.append('search', search);
      if (category && category !== 'all') queryParams.append('category', category);
      if (active !== undefined && active !== 'all') queryParams.append('active', active);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (order) queryParams.append('order', order);
      const response = await api.get(`/courses?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data.data.course;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data.data.course;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/courses/${id}`, data);
      return response.data.data.course;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/courses/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
  }
);

export const fetchCourseStats = createAsyncThunk(
  'courses/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/courses/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course stats');
    }
  }
);

export const fetchCourseOptions = createAsyncThunk(
  'courses/fetchOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/course-options');
      return response.data.data.courses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course options');
    }
  }
);