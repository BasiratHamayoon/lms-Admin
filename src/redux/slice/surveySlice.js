import { createSlice } from '@reduxjs/toolkit';
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deactivateQuestion,
  bulkUploadQuestions
} from '../actions/survey';

const initialState = {
  questions: [],
  pagination: { 
    total: 0, 
    page: 1, 
    limit: 10, 
    totalPages: 1 
  },
  filters: { 
    active: 'all', 
    category: 'all' 
  },
  searchTerm: '',
  loading: false,
  error: null,
  availableCategories: [
    "teaching", "behavior", "communication", "punctuality",
    "teamwork", "initiative", "professionalDevelopment", "other",
    "facilities", "curriculum", "administration", "resources",
    "environment", "support", "overall"
  ],
  uploadProgress: 0
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; 
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.pagination.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    
    resetFilters: (state) => {
      state.filters = { active: 'all', category: 'all' };
      state.searchTerm = '';
      state.pagination.page = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        
        const payload = action.payload || {};
        state.questions = payload.questions || [];
        
        
        if (payload.pagination) {
          state.pagination = {
            ...state.pagination,
            total: payload.pagination.total || 0,
            totalPages: payload.pagination.pages || payload.pagination.totalPages || 1,
            page: payload.pagination.page || state.pagination.page,
            limit: payload.pagination.limit || state.pagination.limit,
          };
        } else {
          
          state.pagination = {
            ...state.pagination,
            total: payload.total || state.questions.length,
            totalPages: Math.ceil((payload.total || state.questions.length) / state.pagination.limit),
          };
        }
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        
      })
      
      
      .addCase(createQuestion.pending, (state) => {
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.error = null;
        
        if (action.payload?.question) {
          state.questions.unshift(action.payload.question);
          state.pagination.total += 1;
        }
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      
      .addCase(updateQuestion.pending, (state) => {
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.error = null;
        const updatedQuestion = action.payload?.question || action.payload;
        if (updatedQuestion?._id) {
          state.questions = state.questions.map(q =>
            q._id === updatedQuestion._id ? updatedQuestion : q
          );
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      
      .addCase(deactivateQuestion.pending, (state) => {
        state.error = null;
      })
      .addCase(deactivateQuestion.fulfilled, (state, action) => {
        state.error = null;
        const deactivatedId = action.payload?._id || action.meta?.arg;
        if (deactivatedId) {
          state.questions = state.questions.filter(q => q._id !== deactivatedId);
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      })
      .addCase(deactivateQuestion.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      
      .addCase(bulkUploadQuestions.pending, (state) => {
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(bulkUploadQuestions.fulfilled, (state) => {
        state.error = null;
        state.uploadProgress = 100;
      })
      .addCase(bulkUploadQuestions.rejected, (state, action) => {
        state.error = action.payload;
        state.uploadProgress = 0;
      });
  },
});

export const { 
  setPagination, 
  setFilters, 
  setSearchTerm, 
  clearError, 
  setUploadProgress,
  resetFilters 
} = surveySlice.actions;

export default surveySlice.reducer;