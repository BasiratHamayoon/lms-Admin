import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gradeService from '../actions/grades'; // Assuming this service exists
import { toast } from 'sonner';

const initialState = {
  grades: [],
  currentGrade: null,
  gradeDetails: null, // Added to store details for the view modal
  stats: null,
  pagination: {
    totalDocs: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  },
  classOptions: [],
  courseOptions: [],
  classStudents: [],
  loading: false,
  optionsLoading: false,
  studentsLoading: false,
  detailsLoading: false, // Added specific loading state for details
  error: null,
  success: false,
  message: '',
};

// --- All existing thunks remain the same ---
export const fetchClassGrades = createAsyncThunk(
  'grades/fetchByClass',
  async ({ classId, params = {} }, thunkAPI) => {
    try {
      const response = await gradeService.getClassGrades(classId, params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching grades');
    }
  }
);
// ... (fetchClassSubjectGrades, createGrade, etc.)

// --- ADD THIS NEW THUNK ---
export const fetchGradeDetails = createAsyncThunk(
  'grades/fetchDetails',
  async (gradeId, thunkAPI) => {
    try {
      // Assuming your service has a method like getGradeById
      const response = await gradeService.getGradeById(gradeId);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching grade details';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// ... (all other thunks like updateGrade, publishGrade etc. remain here)

export const fetchClassSubjectGrades = createAsyncThunk('grades/fetchByClassSubject', async ({ classId, courseId, params = {} }, thunkAPI) => { try { const response = await gradeService.getClassSubjectGrades(classId, courseId, params); return response.data; } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching subject grades'); } });
export const createGrade = createAsyncThunk('grades/create', async (gradeData, thunkAPI) => { try { const response = await gradeService.createGrade(gradeData); toast.success('Grade created successfully'); return response.data; } catch (error) { const message = error.response?.data?.message || 'Error creating grade'; toast.error(message); return thunkAPI.rejectWithValue(message); } });
export const uploadGradesExcel = createAsyncThunk('grades/uploadExcel', async (formData, thunkAPI) => { try { const response = await gradeService.uploadGradesExcel(formData); const { successCount, errorCount } = response.data; if (errorCount > 0) { toast.warning(`Uploaded ${successCount} grades with ${errorCount} errors`); } else { toast.success(`Successfully uploaded ${successCount} grades`); } return response.data; } catch (error) { const message = error.response?.data?.message || 'Error uploading excel'; toast.error(message); return thunkAPI.rejectWithValue(message); } });
export const updateGrade = createAsyncThunk('grades/update', async ({ id, data }, thunkAPI) => { try { const response = await gradeService.updateGrade(id, data); toast.success('Grade updated successfully'); return response.data; } catch (error) { const message = error.response?.data?.message || 'Error updating grade'; toast.error(message); return thunkAPI.rejectWithValue(message); } });
export const addAssessment = createAsyncThunk('grades/addAssessment', async ({ id, assessmentData }, thunkAPI) => { try { const response = await gradeService.addAssessment(id, assessmentData); toast.success('Assessment added successfully'); return response.data; } catch (error) { const message = error.response?.data?.message || 'Error adding assessment'; toast.error(message); return thunkAPI.rejectWithValue(message); } });
export const publishGrade = createAsyncThunk('grades/publish', async (id, thunkAPI) => { try { const response = await gradeService.publishGrade(id); toast.success('Grade published successfully'); return response.data; } catch (error) { const message = error.response?.data?.message || 'Error publishing grade'; toast.error(message); return thunkAPI.rejectWithValue(message); } });
export const bulkPublishGrades = createAsyncThunk('grades/bulkPublish', async (gradeIds, thunkAPI) => { try { const response = await gradeService.bulkPublishGrades(gradeIds); toast.success(`Published ${response.data.modifiedCount} grades`); return { gradeIds, ...response.data }; } catch (error) { const message = error.response?.data?.message || 'Error publishing grades'; toast.error(message); return thunkAPI.rejectWithValue(message); } });
export const archiveGrade = createAsyncThunk('grades/archive', async (id, thunkAPI) => { try { const response = await gradeService.archiveGrade(id); toast.success('Grade archived successfully'); return response.data; } catch (error) { const message = error.response?.data?.message || 'Error archiving grade'; toast.error(message); return thunkAPI.rejectWithValue(message); } });
export const deleteGrade = createAsyncThunk('grades/delete', async (id, thunkAPI) => { try { await gradeService.deleteGrade(id); toast.success('Grade deleted successfully'); return id; } catch (error) { const message = error.response?.data?.message || 'Error deleting grade'; toast.error(message); return thunkAPI.rejectWithValue(message); } });
export const deleteAssessment = createAsyncThunk('grades/deleteAssessment', async ({ gradeId, assessmentName }, thunkAPI) => { try { const response = await gradeService.deleteAssessment(gradeId, assessmentName); toast.success('Assessment deleted successfully'); return response.data; } catch (error) { const message = error.response?.data?.message || 'Error deleting assessment'; toast.error(message); return thunkAPI.rejectWithValue(message); } });
export const fetchClassOptions = createAsyncThunk('grades/fetchClassOptions', async (params = {}, thunkAPI) => { try { const response = await gradeService.getClassOptions(params); return response.data.options; } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching class options'); } });
export const fetchCourseOptions = createAsyncThunk('grades/fetchCourseOptions', async (_, thunkAPI) => { try { const response = await gradeService.getCourseOptions(); return response.data.courses; } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching course options'); } });
export const fetchClassStudents = createAsyncThunk('grades/fetchClassStudents', async (classId, thunkAPI) => { try { const response = await gradeService.getClassStudents(classId); return response.data.students; } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching students'); } });


const gradeSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    clearErrors: (state) => { state.error = null; },
    resetSuccess: (state) => { state.success = false; state.message = ''; },
    setCurrentGrade: (state, action) => { state.currentGrade = action.payload; },
    clearCurrentGrade: (state) => { state.currentGrade = null; },
    clearClassStudents: (state) => { state.classStudents = []; },
    setPagination: (state, action) => { state.pagination = { ...state.pagination, ...action.payload }; },
  },
  extraReducers: (builder) => {
    builder
      // --- All existing builder cases remain the same ---
      .addCase(fetchClassGrades.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchClassGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = action.payload.data || action.payload.grades || action.payload;
        state.stats = action.payload.stats || null;
        if (action.payload.meta) {
          state.pagination = {
            totalDocs: action.payload.meta.totalDocs || 0,
            totalPages: action.payload.meta.totalPages || 0,
            currentPage: action.payload.meta.currentPage || 1,
            limit: action.payload.meta.limit || 10
          };
        }
      })
      .addCase(fetchClassGrades.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // ... (other cases)

      // --- ADD THESE NEW CASES ---
      .addCase(fetchGradeDetails.pending, (state) => {
        state.detailsLoading = true;
        state.gradeDetails = null; // Clear old data on new fetch
      })
      .addCase(fetchGradeDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.gradeDetails = action.payload.data || action.payload; // Assuming data is nested
      })
      .addCase(fetchGradeDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      // --- END OF NEW CASES ---

      .addCase(fetchClassSubjectGrades.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchClassSubjectGrades.fulfilled, (state, action) => { state.loading = false; state.grades = action.payload.data || action.payload.grades || action.payload; state.stats = action.payload.stats || null; if (action.payload.meta) { state.pagination = { totalDocs: action.payload.meta.totalDocs || 0, totalPages: action.payload.meta.totalPages || 0, currentPage: action.payload.meta.currentPage || 1, limit: action.payload.meta.limit || 10 }; } })
      .addCase(fetchClassSubjectGrades.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createGrade.pending, (state) => { state.loading = true; })
      .addCase(createGrade.fulfilled, (state, action) => { state.loading = false; state.success = true; state.message = 'Grade created successfully'; })
      .addCase(createGrade.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(uploadGradesExcel.pending, (state) => { state.loading = true; })
      .addCase(uploadGradesExcel.fulfilled, (state, action) => { state.loading = false; state.success = true; state.message = `Uploaded ${action.payload.successCount} grades`; })
      .addCase(uploadGradesExcel.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateGrade.pending, (state) => { state.loading = true; })
      .addCase(updateGrade.fulfilled, (state, action) => { state.loading = false; const index = state.grades.findIndex(g => g._id === action.payload._id); if (index !== -1) { state.grades[index] = action.payload; } state.success = true; state.message = 'Grade updated successfully'; })
      .addCase(updateGrade.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addAssessment.fulfilled, (state, action) => { const index = state.grades.findIndex(g => g._id === action.payload._id); if (index !== -1) { state.grades[index] = action.payload; } state.success = true; })
      .addCase(publishGrade.fulfilled, (state, action) => { const index = state.grades.findIndex(g => g._id === action.payload._id); if (index !== -1) { state.grades[index] = action.payload; } })
      .addCase(bulkPublishGrades.fulfilled, (state, action) => { const { gradeIds } = action.payload; state.grades = state.grades.map(g => gradeIds.includes(g._id) ? { ...g, status: 'published' } : g ); })
      .addCase(archiveGrade.fulfilled, (state, action) => { const index = state.grades.findIndex(g => g._id === action.payload._id); if (index !== -1) { state.grades[index] = action.payload; } })
      .addCase(deleteGrade.fulfilled, (state, action) => { state.grades = state.grades.filter(g => g._id !== action.payload); state.pagination.totalDocs = Math.max(0, state.pagination.totalDocs - 1); })
      .addCase(deleteAssessment.fulfilled, (state, action) => { if (action.payload._id) { const index = state.grades.findIndex(g => g._id === action.payload._id); if (index !== -1) { state.grades[index] = action.payload; } } })
      .addCase(fetchClassOptions.pending, (state) => { state.optionsLoading = true; })
      .addCase(fetchClassOptions.fulfilled, (state, action) => { state.optionsLoading = false; state.classOptions = action.payload || []; })
      .addCase(fetchClassOptions.rejected, (state, action) => { state.optionsLoading = false; state.error = action.payload; })
      .addCase(fetchCourseOptions.pending, (state) => { state.optionsLoading = true; })
      .addCase(fetchCourseOptions.fulfilled, (state, action) => { state.optionsLoading = false; state.courseOptions = action.payload || []; })
      .addCase(fetchCourseOptions.rejected, (state, action) => { state.optionsLoading = false; state.error = action.payload; })
      .addCase(fetchClassStudents.pending, (state) => { state.studentsLoading = true; })
      .addCase(fetchClassStudents.fulfilled, (state, action) => { state.studentsLoading = false; state.classStudents = action.payload || []; })
      .addCase(fetchClassStudents.rejected, (state, action) => { state.studentsLoading = false; state.error = action.payload; });
  },
});

export const selectGrades = (state) => state.grades.grades;
export const selectGradeStats = (state) => state.grades.stats;
export const selectGradeLoading = (state) => state.grades.loading;
export const selectGradePagination = (state) => state.grades.pagination;
export const selectClassOptions = (state) => state.grades.classOptions;
export const selectCourseOptions = (state) => state.grades.courseOptions;
export const selectClassStudents = (state) => state.grades.classStudents;
export const selectOptionsLoading = (state) => state.grades.optionsLoading;
export const selectStudentsLoading = (state) => state.grades.studentsLoading;

export const { clearErrors, resetSuccess, setCurrentGrade, clearCurrentGrade, clearClassStudents, setPagination } = gradeSlice.actions;
export default gradeSlice.reducer;