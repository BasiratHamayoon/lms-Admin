import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "sonner";

// --- ACTIONS ---

export const fetchStaffList = createAsyncThunk(
  "salary/fetchStaffList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/staff-list", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch staff list");
    }
  }
);

export const fetchSalaryList = createAsyncThunk(
  "salary/fetchList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/salary-list", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch salaries");
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "salary/fetchPaymentHistory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/salary-payment-history", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment history");
    }
  }
);

export const fetchSalaryDetails = createAsyncThunk(
  "salary/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/salary/${id}`);
      return response.data.data.salary;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch details");
    }
  }
);

export const fetchPaymentDetails = createAsyncThunk(
  "salary/fetchPaymentDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/salary-payment-history/${id}`);
      return response.data.data.payment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment details");
    }
  }
);


export const fetchSalarySummary = createAsyncThunk(
  "salary/fetchSummary",
  async ({ month, year, lang }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/salary-summary", { params: { month, year, lang } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch summary");
    }
  }
);

export const generateSalaries = createAsyncThunk(
  "salary/generate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/salary/generate", data);
      toast.success(response.data.message || "Salary generated successfully");
      return response.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to generate salaries";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateSalary = createAsyncThunk(
  "salary/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/salary/${id}`, data);
      toast.success("Salary updated successfully");
      return { id, ...response.data.data };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update salary";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const paySalary = createAsyncThunk(
  "salary/pay",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/salary/pay", data);
      toast.success("Payment recorded successfully");
      return response.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to record payment";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteSalary = createAsyncThunk(
  "salary/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/salary/${id}`);
      toast.success("Salary deleted successfully");
      return id;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete salary";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deletePayment = createAsyncThunk(
  "salary/deletePayment",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/salary/payment/${id}`);
      toast.success("Payment record deleted");
      return id;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete payment";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// --- SLICE ---

const initialState = {
  salaries: [],
  paymentHistory: [],
  staffList: [],
  summary: { totalAmount: 0, paidCount: 0, unpaidCount: 0, totalCount: 0 },
  salaryDetails: null,
  selectedPaymentDetails: null,
  pagination: { total: 0, page: 1, pages: 1, limit: 10 },
  historyPagination: { total: 0, page: 1, pages: 1, limit: 10 },
  loading: false,
  staffLoading: false,
  detailsLoading: false,
  actionLoading: false,
  error: null,
};

const salarySlice = createSlice({
  name: "salary",
  initialState,
  reducers: {
    clearDetails: (state) => {
      state.salaryDetails = null;
      state.selectedPaymentDetails = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const createLoadingHandler = (state) => { state.actionLoading = true; state.error = null; };
    const createSuccessHandler = (state) => { state.actionLoading = false; };
    const createRejectedHandler = (state, action) => { state.actionLoading = false; state.error = action.payload; };
    
    builder
      .addCase(fetchStaffList.pending, (state) => { state.staffLoading = true; })
      .addCase(fetchStaffList.fulfilled, (state, action) => {
        state.staffLoading = false;
        state.staffList = action.payload.staff || [];
      })
      .addCase(fetchStaffList.rejected, (state, action) => { state.staffLoading = false; state.error = action.payload; })

      .addCase(fetchSalaryList.pending, (state) => { state.loading = true; })
      .addCase(fetchSalaryList.fulfilled, (state, action) => {
        state.loading = false;
        state.salaries = action.payload.salaries || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSalaryList.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchPaymentHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload.payments || [];
        state.historyPagination = action.payload.pagination;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchSalaryDetails.pending, (state) => { state.detailsLoading = true; })
      .addCase(fetchSalaryDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.salaryDetails = action.payload;
      })
      .addCase(fetchSalaryDetails.rejected, (state, action) => { state.detailsLoading = false; state.error = action.payload; })

      .addCase(fetchPaymentDetails.pending, (state) => { state.detailsLoading = true; })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedPaymentDetails = action.payload;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => { state.detailsLoading = false; state.error = action.payload; })

      .addCase(fetchSalarySummary.fulfilled, (state, action) => { state.summary = { ...state.summary, ...action.payload.summary }; })
      
      .addCase(generateSalaries.pending, createLoadingHandler).addCase(generateSalaries.fulfilled, createSuccessHandler).addCase(generateSalaries.rejected, createRejectedHandler)
      .addCase(paySalary.pending, createLoadingHandler).addCase(paySalary.fulfilled, createSuccessHandler).addCase(paySalary.rejected, createRejectedHandler)
      .addCase(updateSalary.pending, createLoadingHandler).addCase(updateSalary.fulfilled, createSuccessHandler).addCase(updateSalary.rejected, createRejectedHandler)
      
      .addCase(deleteSalary.fulfilled, (state, action) => { state.salaries = state.salaries.filter((s) => s.id !== action.payload); })
      .addCase(deletePayment.fulfilled, (state, action) => { state.paymentHistory = state.paymentHistory.filter((p) => p.id !== action.payload); });
  },
});

export const { clearDetails, resetError } = salarySlice.actions;
export default salarySlice.reducer;