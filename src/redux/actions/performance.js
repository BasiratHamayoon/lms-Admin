import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance"; 


export const fetchOverallKPIs = createAsyncThunk(
  "performance/fetchKPIs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/performance/kpis");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch KPIs");
    }
  }
);

export const fetchPerformanceSummary = createAsyncThunk(
  "performance/fetchSummary",
  async ({ from, to } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/performance/summary", { params: { from, to } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch summary");
    }
  }
);

export const fetchStaffKPIs = createAsyncThunk(
  "performance/fetchStaffKPIs",
  // 1. Add 'lang' to the destructured arguments
  async ({ page, limit, search, status, department, sort, order, lang }, { rejectWithValue }) => {
    try {
      // 2. Include 'lang' in the params object
      const params = { page, limit, search, status, department, sort, order, lang };
      
      // Clean up undefined/empty params
      Object.keys(params).forEach(key => (params[key] === undefined || params[key] === '') && delete params[key]);

      const response = await axios.get("/performance/staff-kpis", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch staff list");
    }
  }
);

export const fetchStaffKPIDetail = createAsyncThunk(
  "performance/fetchStaffKPIDetail",
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/performance-staff-kpis/${teacherId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch staff detail");
    }
  }
);


