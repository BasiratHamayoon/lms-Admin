import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quizApi from '../actions/quiz';


export const fetchQuizDashboardCards = createAsyncThunk(
  'quiz/fetchQuizDashboardCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizApi.getQuizDashboardCards();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz dashboard');
    }
  }
);

export const fetchQuizFilterOptions = createAsyncThunk(
  'quiz/fetchQuizFilterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizApi.getQuizFilterOptions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch filter options');
    }
  }
);

export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await quizApi.getQuizzes(params);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const createQuiz = createAsyncThunk(
  'quiz/createQuiz',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await quizApi.createQuiz(formData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create quiz');
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'quiz/updateQuiz',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await quizApi.updateQuiz(id, formData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quiz');
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quiz/deleteQuiz',
  async (id, { rejectWithValue }) => {
    try {
      await quizApi.deleteQuiz(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete quiz');
    }
  }
);

export const fetchQuizDetails = createAsyncThunk(
  'quiz/fetchQuizDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await quizApi.getQuizDetails(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz details');
    }
  }
);

export const publishQuiz = createAsyncThunk(
  'quiz/publishQuiz',
  async (id, { rejectWithValue }) => {
    try {
      const response = await quizApi.publishQuiz(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish quiz');
    }
  }
);

export const closeQuiz = createAsyncThunk(
  'quiz/closeQuiz',
  async (id, { rejectWithValue }) => {
    try {
      const response = await quizApi.closeQuiz(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close quiz');
    }
  }
);

export const gradeQuizSubmission = createAsyncThunk(
  'quiz/gradeQuizSubmission',
  async ({ quizId, submissionId, gradeData }, { rejectWithValue }) => {
    try {
      const response = await quizApi.gradeQuizSubmission(quizId, submissionId, gradeData);
      return { quizId, submissionId, ...(response.data || response) };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to grade submission');
    }
  }
);

export const downloadQuizTemplate = createAsyncThunk(
  'quiz/downloadQuizTemplate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizApi.downloadQuizTemplate();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download template');
    }
  }
);

export const fetchAllSubmissions = createAsyncThunk(
  'quiz/fetchAllSubmissions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await quizApi.getAllSubmissions(params);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions');
    }
  }
);


const initialState = {
  quizzes: [],
  quizDetails: null,
  submissions: [],
  dashboardStats: {
    totalQuizzes: 0,
    publishedQuizzes: 0,
    draftQuizzes: 0,
    closedQuizzes: 0,
    pendingGrading: 0,
    totalGraded: 0
  },
  filterOptions: {
    classes: [],
    sections: [],
    statuses: []
  },
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  },
  loading: {
    dashboard: false,
    filters: false,
    quizzes: false,
    details: false,
    create: false,
    update: false,
    delete: false,
    grade: false,
    template: false
  },
  error: null,
  filters: {
    classId: '',
    section: '',
    fromDate: '',
    toDate: '',
    searchTitle: '',
    status: ''
  }
};


const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setSelectedQuiz: (state, action) => {
      state.quizDetails = action.payload;
    },
    setSelectedSubmission: (state, action) => {
      state.selectedSubmission = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      
      state.meta.page = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.meta.page = 1;
    },
    setPage: (state, action) => {
      state.meta.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.meta.limit = action.payload;
      state.meta.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetQuizState: () => initialState,
    updateQuizInList: (state, action) => {
      const index = state.quizzes.findIndex(
        q => (q.id || q._id) === (action.payload.id || action.payload._id)
      );
      if (index !== -1) {
        state.quizzes[index] = { ...state.quizzes[index], ...action.payload };
      }
    },
    clearQuizDetails: (state) => {
      state.quizDetails = null;
      state.submissions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchQuizDashboardCards.pending, (state) => {
        state.loading.dashboard = true;
        state.error = null;
      })
      .addCase(fetchQuizDashboardCards.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchAllSubmissions.pending, (state) => {
  state.loading.submissions = true;
  state.error = null;
})
.addCase(fetchAllSubmissions.fulfilled, (state, action) => {
  state.loading.submissions = false;
  state.submissions = action.payload.submissions || [];
  state.submissionsMeta = action.payload.pagination || {};
})
.addCase(fetchAllSubmissions.rejected, (state, action) => {
  state.loading.submissions = false;
  state.error = action.payload;
})
      .addCase(fetchQuizDashboardCards.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error = action.payload;
      })

      
      .addCase(fetchQuizFilterOptions.pending, (state) => {
        state.loading.filters = true;
      })
      .addCase(fetchQuizFilterOptions.fulfilled, (state, action) => {
        state.loading.filters = false;
        state.filterOptions = action.payload;
      })
      .addCase(fetchQuizFilterOptions.rejected, (state, action) => {
        state.loading.filters = false;
        state.error = action.payload;
      })

      
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading.quizzes = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading.quizzes = false;
        const data = action.payload;
        if (data) {
          state.quizzes = data.quizzes || [];
          if (data.pagination) {
            state.meta = {
              total: data.pagination.totalQuizzes || 0,
              page: data.pagination.currentPage || 1,
              limit: data.pagination.limit || 10,
              totalPages: data.pagination.totalPages || 1
            };
          }
        }
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading.quizzes = false;
        state.error = action.payload;
      })

      
      .addCase(createQuiz.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload) {
          state.quizzes.unshift(action.payload);
          state.meta.total += 1;
        }
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      
      .addCase(updateQuiz.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedQuiz = action.payload;
        if (updatedQuiz) {
          const index = state.quizzes.findIndex(
            q => (q.id || q._id) === (updatedQuiz.id || updatedQuiz._id)
          );
          if (index !== -1) {
            state.quizzes[index] = updatedQuiz;
          }
          if (state.quizDetails && 
              (state.quizDetails.id || state.quizDetails._id) === (updatedQuiz.id || updatedQuiz._id)) {
            state.quizDetails = { ...state.quizDetails, ...updatedQuiz };
          }
        }
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      
      .addCase(deleteQuiz.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.quizzes = state.quizzes.filter(
          q => (q.id || q._id) !== action.payload && (q._id || q.id) !== action.payload
        );
        state.meta.total = Math.max(0, state.meta.total - 1);
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      })

      
      .addCase(fetchQuizDetails.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchQuizDetails.fulfilled, (state, action) => {
        state.loading.details = false;
        state.quizDetails = action.payload;
        state.submissions = action.payload?.submissions || [];
      })
      .addCase(fetchQuizDetails.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.payload;
      })

      
      .addCase(publishQuiz.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(publishQuiz.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedQuiz = action.payload;
        if (updatedQuiz) {
          const index = state.quizzes.findIndex(
            q => (q.id || q._id) === (updatedQuiz.id || updatedQuiz._id)
          );
          if (index !== -1) {
            state.quizzes[index] = { ...state.quizzes[index], ...updatedQuiz };
          }
          if (state.quizDetails) {
            state.quizDetails = { ...state.quizDetails, ...updatedQuiz };
          }
        }
      })
      .addCase(publishQuiz.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      
      .addCase(closeQuiz.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(closeQuiz.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedQuiz = action.payload;
        if (updatedQuiz) {
          const index = state.quizzes.findIndex(
            q => (q.id || q._id) === (updatedQuiz.id || updatedQuiz._id)
          );
          if (index !== -1) {
            state.quizzes[index] = { ...state.quizzes[index], ...updatedQuiz };
          }
          if (state.quizDetails) {
            state.quizDetails = { ...state.quizDetails, ...updatedQuiz };
          }
        }
      })
      .addCase(closeQuiz.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      
      .addCase(gradeQuizSubmission.pending, (state) => {
        state.loading.grade = true;
        state.error = null;
      })
      .addCase(gradeQuizSubmission.fulfilled, (state, action) => {
        state.loading.grade = false;
        if (action.payload?.submission) {
          const index = state.submissions.findIndex(
            s => (s._id || s.id) === action.payload.submissionId
          );
          if (index !== -1) {
            state.submissions[index] = {
              ...state.submissions[index],
              ...action.payload.submission
            };
          }
        }
      })
      .addCase(gradeQuizSubmission.rejected, (state, action) => {
        state.loading.grade = false;
        state.error = action.payload;
      })

      
      .addCase(downloadQuizTemplate.pending, (state) => {
        state.loading.template = true;
      })
      .addCase(downloadQuizTemplate.fulfilled, (state) => {
        state.loading.template = false;
      })
      .addCase(downloadQuizTemplate.rejected, (state, action) => {
        state.loading.template = false;
        state.error = action.payload;
      });
  }
});


export const {
  setSelectedQuiz,
  setSelectedSubmission,
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
  clearError,
  resetQuizState,
  updateQuizInList,
  clearQuizDetails
} = quizSlice.actions;


export const selectQuizzes = (state) => state.quiz.quizzes;
export const selectQuizDetails = (state) => state.quiz.quizDetails;
export const selectSubmissions = (state) => state.quiz.submissions;
export const selectDashboardStats = (state) => state.quiz.dashboardStats;
export const selectFilterOptions = (state) => state.quiz.filterOptions;
export const selectMeta = (state) => state.quiz.meta;
export const selectLoading = (state) => state.quiz.loading;
export const selectError = (state) => state.quiz.error;
export const selectQuizFilters = (state) => state.quiz.filters;


export const selectQuizStats = (state) => {
  const dashboard = state.quiz.dashboardStats;
  const quizzes = state.quiz.quizzes || [];
  const submissions = state.quiz.submissions || [];

  return {
    total: dashboard.totalQuizzes || quizzes.length,
    active: dashboard.publishedQuizzes || quizzes.filter(q => q.status === 'published').length,
    draft: dashboard.draftQuizzes || quizzes.filter(q => q.status === 'draft').length,
    closed: dashboard.closedQuizzes || quizzes.filter(q => q.status === 'closed').length,
    pendingGrading: dashboard.pendingGrading || submissions.filter(s => s.status === 'submitted' || s.status === 'pending').length,
    graded: dashboard.totalGraded || submissions.filter(s => s.status === 'graded').length,
    averageScore: submissions.length > 0
      ? Math.round(
          submissions
            .filter(s => s.status === 'graded' && s.totalMarks != null)
            .reduce((sum, s) => sum + ((s.totalMarks || 0) / (s.maxMarks || 100) * 100), 0) / 
          Math.max(1, submissions.filter(s => s.status === 'graded').length)
        )
      : 0
  };
};

export default quizSlice.reducer;