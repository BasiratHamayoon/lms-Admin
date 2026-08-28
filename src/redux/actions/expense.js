import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";
import { toast } from "sonner";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/expenses-list", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch expenses");
    }
  }
);

export const fetchExpenseDetails = createAsyncThunk(
  "expenses/fetchExpenseDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/expenses/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch expense details");
    }
  }
);

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await api.post("/expenses", expenseData);
      toast.success("Expense added successfully");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create expense");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/expenses/${id}`, data);
      toast.success("Expense updated successfully");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update expense");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/expenses/${id}`);
      toast.success("Expense deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete expense");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchExpenseStats = createAsyncThunk(
  "expenses/fetchExpenseStats",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/expenses-stats", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const processExpense = createAsyncThunk(
  "expenses/processExpense",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/expenses/${id}/process`, data);
      toast.success(`Expense ${data.status} successfully`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process expense");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);