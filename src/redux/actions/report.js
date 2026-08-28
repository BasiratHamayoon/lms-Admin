// redux/actions/report.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance'; 

export const fetchReportCards = createAsyncThunk(
  'reports/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/reports/cards-fee');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cards'
      );
    }
  }
);

export const fetchGraphData = createAsyncThunk(
  'reports/fetchGraph',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/reports/fee-expense-graph');
      return response.data.data.monthly;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch graph data'
      );
    }
  }
);

/**
 * params: { page, limit, search, classId, academicYear }
 */
export const fetchFeeReports = createAsyncThunk(
  'reports/fetchFees',
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        classId,
        academicYear,
      } = params;

      const query = new URLSearchParams();
      query.append('page', page);
      query.append('limit', limit);
      if (search) query.append('search', search);
      if (classId) query.append('classId', classId);
      if (academicYear) query.append('academicYear', academicYear);

      const response = await axiosInstance.get(`/reports/fee?${query.toString()}`);
      // backend: { records, pagination }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch fee reports'
      );
    }
  }
);

/**
 * params: { page, limit, search, category, startDate, endDate }
 */
export const fetchExpenseReports = createAsyncThunk(
  'reports/fetchExpenses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        category,
        startDate,
        endDate,
      } = params;

      const query = new URLSearchParams();
      query.append('page', page);
      query.append('limit', limit);
      if (search) query.append('search', search);
      if (category) query.append('category', category);
      if (startDate) query.append('startDate', startDate);
      if (endDate) query.append('endDate', endDate);

      const response = await axiosInstance.get(`/reports/expenses?${query.toString()}`);
      // backend: { expenses, pagination }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch expense reports'
      );
    }
  }
);