import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { setUploadProgress } from '../slice/surveySlice';

export const fetchQuestions = createAsyncThunk(
  'survey/fetchQuestions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().survey;
      const { pagination, filters, searchTerm } = state;

      const queryParams = new URLSearchParams();
      
      
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());

      
      if (searchTerm && searchTerm.trim()) {
        queryParams.append('search', searchTerm.trim());
      }

      
      if (filters.active && filters.active !== 'all') {
        const activeValue = filters.active === 'active' ? 'true' : 'false';
        queryParams.append('active', activeValue);
      }

      
      if (filters.category && filters.category !== 'all') {
        queryParams.append('category', filters.category);
      }

      console.log('Fetching questions with params:', queryParams.toString()); 

      const response = await axiosInstance.get(`/teacher-survey/questions?${queryParams.toString()}`);
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const createQuestion = createAsyncThunk(
  'survey/createQuestion',
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/teacher-survey/questions', questionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create question');
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'survey/updateQuestion',
  async ({ id, questionData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/teacher-survey/questions/${id}`, questionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update question');
    }
  }
);

export const deactivateQuestion = createAsyncThunk(
  'survey/deactivateQuestion',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/teacher-survey/questions/${id}`);
      return { _id: id, ...response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate question');
    }
  }
);

export const bulkUploadQuestions = createAsyncThunk(
  'survey/bulkUploadQuestions',
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      dispatch(setUploadProgress(0));

      const response = await axiosInstance.post('/teacher-survey/questions/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(setUploadProgress(percentCompleted));
          }
        }
      });

      dispatch(setUploadProgress(100));

      if (!response.data.success) {
        let errorMessage = response.data.message || 'Bulk upload failed.';
        if (response.data.data?.errors?.length) {
          errorMessage += ` Errors: ${response.data.data.errors.join(', ')}`;
        }
        return rejectWithValue(errorMessage);
      }

      return response.data.data;
    } catch (error) {
      dispatch(setUploadProgress(0));
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during bulk upload.';
      return rejectWithValue(errorMessage);
    }
  }
);