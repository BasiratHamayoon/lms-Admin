
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeeStructuresListAPI,
  createFeeStructureAPI,
  getFeeStructureDetailsAPI,
  updateFeeStructureAPI,
  deleteFeeStructureAPI,
  getStudentFeesListAPI,
  assignFeeStructureAPI,
  getStudentFeeDetailsAPI,
  recordFeePaymentAPI,
  addFeeDiscountAPI,
  getFeeStatsAPI,
  getFeeCollectionChartAPI,
  getFeeStatusChartAPI,
  getStudentOptionsAPI,
  deleteFeePaymentAPI,
  deleteStudentFeeAPI
} from '../actions/fees';

const initialState = {
  feeStructures: [],
  currentFeeStructure: null,
  feeStructuresPagination: {
    totalStructures: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
  },

  studentFees: [],
  currentStudentFee: null,
  studentFeesPagination: {
    totalStudentFees: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
  },

  studentOptions: [],
  studentOptionsLoading: false,
  studentOptionsPagination: {
    total: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 20,
  },

  feeStats: null,
  feeCollectionChartData: [],
  feeStatusChartData: [],

  // ✅ CHANGE: Use separate loading states instead of one boolean
  loading: {
    list: false,      // For both fee structures and student fees lists
    stats: false,     // For stats
    charts: false,    // For charts
    details: false,   // For fetching details
    action: false,    // For create/update/delete operations
  },
  
  error: null,
  success: false,
};
export const getFeeStructuresList = createAsyncThunk(
  'fees/getFeeStructuresList',
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await getFeeStructuresListAPI(queryParams);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createFeeStructure = createAsyncThunk(
  'fees/createFeeStructure',
  async (feeStructureData, { rejectWithValue }) => {
    try {
      const response = await createFeeStructureAPI(feeStructureData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getFeeStructureDetails = createAsyncThunk(
  'fees/getFeeStructureDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getFeeStructureDetailsAPI(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateFeeStructure = createAsyncThunk(
  'fees/updateFeeStructure',
  async ({ id, feeStructureData }, { rejectWithValue }) => {
    try {
      const response = await updateFeeStructureAPI(id, feeStructureData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteFeeStructure = createAsyncThunk(
  'fees/deleteFeeStructure',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteFeeStructureAPI(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const getStudentFeesList = createAsyncThunk(
  'fees/getStudentFeesList',
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await getStudentFeesListAPI(queryParams);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const assignFeeStructure = createAsyncThunk(
  'fees/assignFeeStructure',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const response = await assignFeeStructureAPI(assignmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStudentFeeDetails = createAsyncThunk(
  'fees/getStudentFeeDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getStudentFeeDetailsAPI(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const recordFeePayment = createAsyncThunk(
  'fees/recordFeePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await recordFeePaymentAPI(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addFeeDiscount = createAsyncThunk(
  'fees/addFeeDiscount',
  async ({ id, discountData }, { rejectWithValue }) => {
    try {
      const response = await addFeeDiscountAPI(id, discountData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const getFeeStats = createAsyncThunk(
  'fees/getFeeStats',
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await getFeeStatsAPI(queryParams);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getFeeCollectionChart = createAsyncThunk(
  'fees/getFeeCollectionChart',
  async (year, { rejectWithValue }) => {
    try {
      const response = await getFeeCollectionChartAPI(year);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getFeeStatusChart = createAsyncThunk(
  'fees/getFeeStatusChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeeStatusChartAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const getStudentOptions = createAsyncThunk(
  'fees/getStudentOptions',
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await getStudentOptionsAPI(queryParams);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteStudentFee = createAsyncThunk(
  'fees/deleteStudentFee',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteStudentFeeAPI(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteFeePayment = createAsyncThunk(
  'fees/deleteFeePayment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteFeePaymentAPI(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const feeSlice = createSlice({
  name: 'fees',
  initialState,
  reducers: {
    resetFeeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.feeCollectionChartData = [];
      state.feeStatusChartData = [];
      state.feeStructuresPagination = { ...initialState.feeStructuresPagination };
      state.studentFeesPagination = { ...initialState.studentFeesPagination };
    },
    clearCurrentFeeStructure: (state) => {
      state.currentFeeStructure = null;
    },
    clearCurrentStudentFee: (state) => {
      state.currentStudentFee = null;
    },
    clearStudentOptions: (state) => {
      state.studentOptions = [];
      state.studentOptionsPagination = { ...initialState.studentOptionsPagination };
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getFeeStructuresList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeStructuresList.fulfilled, (state, action) => {
        state.loading = false;
        state.feeStructures = action.payload.data?.feeStructures || [];
        state.feeStructuresPagination = action.payload.data?.pagination || initialState.feeStructuresPagination;
        state.success = true;
      })
      .addCase(getFeeStructuresList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(createFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeeStructure.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getFeeStructureDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeStructureDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFeeStructure = action.payload.data;
        state.success = true;
      })
      .addCase(getFeeStructureDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(updateFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeeStructure.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(deleteFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeeStructure.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getStudentFeesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentFeesList.fulfilled, (state, action) => {
        state.loading = false;
        state.studentFees = action.payload.data?.studentFees || [];
        state.studentFeesPagination = action.payload.data?.pagination || initialState.studentFeesPagination;
        state.success = true;
      })
      .addCase(getStudentFeesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(assignFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignFeeStructure.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(assignFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getStudentFeeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentFeeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudentFee = action.payload.data;
        state.success = true;
      })
      .addCase(getStudentFeeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(recordFeePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordFeePayment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(recordFeePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(addFeeDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeeDiscount.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addFeeDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getFeeStats.pending, (state) => {
        state.error = null;
      })
      .addCase(getFeeStats.fulfilled, (state, action) => {
        state.feeStats = action.payload.data;
      })
      .addCase(getFeeStats.rejected, (state, action) => {
        state.error = action.payload;
      })

      
      .addCase(getFeeCollectionChart.pending, (state) => {
        state.error = null;
      })
      .addCase(getFeeCollectionChart.fulfilled, (state, action) => {
        const payload = action.payload;
        state.feeCollectionChartData = Array.isArray(payload?.data) ? payload.data : [];
      })
      .addCase(getFeeCollectionChart.rejected, (state, action) => {
        state.error = action.payload;
        state.feeCollectionChartData = [];
      })

      
      .addCase(getFeeStatusChart.pending, (state) => {
        state.error = null;
      })
      .addCase(getFeeStatusChart.fulfilled, (state, action) => {
        const payload = action.payload;
        state.feeStatusChartData = Array.isArray(payload?.data) ? payload.data : [];
      })
      .addCase(getFeeStatusChart.rejected, (state, action) => {
        state.error = action.payload;
        state.feeStatusChartData = [];
      })

      
      .addCase(getStudentOptions.pending, (state) => {
        state.studentOptionsLoading = true;
      })
      .addCase(getStudentOptions.fulfilled, (state, action) => {
        state.studentOptionsLoading = false;
        state.studentOptions = action.payload.data?.options || [];
        state.studentOptionsPagination = action.payload.data?.pagination || initialState.studentOptionsPagination;
      })
      .addCase(getStudentOptions.rejected, (state) => {
        state.studentOptionsLoading = false;
        state.studentOptions = [];
      })

        .addCase(deleteStudentFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudentFee.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        
      })
      .addCase(deleteStudentFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(deleteFeePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeePayment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        
      })
      .addCase(deleteFeePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetFeeState,
  clearCurrentFeeStructure,
  clearCurrentStudentFee,
  clearStudentOptions,
} = feeSlice.actions;

export default feeSlice.reducer;