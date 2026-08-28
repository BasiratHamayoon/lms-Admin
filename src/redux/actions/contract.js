import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchContracts = createAsyncThunk(
  "contracts/fetchList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/contracts", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch contracts");
    }
  }
);

export const fetchContractById = createAsyncThunk(
  "contracts/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/contracts/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch contract details");
    }
  }
);

export const createContract = createAsyncThunk(
  "contracts/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/contracts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create contract");
    }
  }
);

export const updateContract = createAsyncThunk(
  "contracts/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/contracts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update contract");
    }
  }
);

export const deleteContract = createAsyncThunk(
  "contracts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/contracts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete contract");
    }
  }
);

export const fetchContractStats = createAsyncThunk(
  "contracts/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/contracts-stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const fetchContractTypeChart = createAsyncThunk(
  "contracts/fetchTypeChart",
  async (lang, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/contracts-type-chart", { params: { lang } });
      return response.data.data.chart.map(item => ({ name: item.label, value: item.value }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch type chart");
    }
  }
);

export const fetchContractExpiryChart = createAsyncThunk(
  "contracts/fetchExpiryChart",
  async (lang, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/contracts-expiry-chart", { params: { lang } });
      return response.data.data.chart.map(item => ({ name: item.label, value: item.value }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch expiry chart");
    }
  }
);