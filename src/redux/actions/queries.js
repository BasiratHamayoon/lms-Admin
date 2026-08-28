import {  createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "sonner";


export const fetchQueries = createAsyncThunk(
  "queries/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      
      const response = await axiosInstance.get("/queries", { params });
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch queries");
    }
  }
);

export const fetchQueryStats = createAsyncThunk(
  "queries/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/queries-stats"); 
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const fetchQueryDetails = createAsyncThunk(
  "queries/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/queries/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch details");
    }
  }
);

export const replyToQuery = createAsyncThunk(
  "queries/reply",
  async ({ id, message }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(`/queries/${id}/reply`, { message });
      toast.success("Reply sent successfully");
      dispatch(fetchQueryDetails(id)); 
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reply");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteQuery = createAsyncThunk(
  "queries/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/queries/${id}`);
      toast.success("Query deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete query");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
