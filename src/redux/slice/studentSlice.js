import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStudents,
  fetchStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  assignStudentToClass,
  promoteStudent,
  fetchStudentStats,
  fetchStudentMonthChart,
  fetchStudentCourseChart,
} from '../actions/student';

const initialState = {
  students: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  selectedStudent: null,
  stats: {
    totalStudents: 0,
    activeEnrollments: 0,
    inactiveEnrollments: 0,
    studentsPerClass: [],
  },
  monthlyChartData: [],
  courseChartData: [],
  
  isLoading: false,
  isLoadingDetails: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isAssigning: false, 
  isPromoting: false, 
  isLoadingStats: false,
  isLoadingCharts: false,
  error: null,
  successMessage: null,
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccessMessage: (state) => { state.successMessage = null; },
    clearSelectedStudent: (state) => { state.selectedStudent = null; },
    setPage: (state, action) => { state.pagination.page = action.payload; },
    setLimit: (state, action) => { state.pagination.limit = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
     .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload.students;
        
        
        state.pagination = {
          total: action.payload.pagination?.total ?? state.pagination.total,
          pages: action.payload.pagination?.pages ?? state.pagination.pages,
          page: action.payload._requestedPage ?? action.payload.pagination?.page ?? state.pagination.page,
          limit: action.payload._requestedLimit ?? action.payload.pagination?.limit ?? state.pagination.limit,
        };
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      
      .addCase(fetchStudentById.pending, (state) => {
        state.isLoadingDetails = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.payload;
      })

      
      .addCase(createStudent.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.isCreating = false;
        state.students.unshift(action.payload); 
        state.pagination.total += 1;
        state.successMessage = 'Student created successfully';
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      
      .addCase(updateStudent.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.students.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.students[index] = { ...state.students[index], ...action.payload };
        }
        if (state.selectedStudent?._id === action.payload._id) {
            state.selectedStudent = { ...state.selectedStudent, ...action.payload };
        }
        state.successMessage = 'Student updated successfully';
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      
      .addCase(assignStudentToClass.pending, (state) => {
        state.isAssigning = true;
        state.error = null;
      })
      .addCase(assignStudentToClass.fulfilled, (state, action) => {
        state.isAssigning = false;
        state.successMessage = 'Class assigned successfully';
        
        if (state.selectedStudent && state.selectedStudent._id === action.payload.id) {
           
        }
      })
      .addCase(assignStudentToClass.rejected, (state, action) => {
        state.isAssigning = false;
        state.error = action.payload;
      })

      
      .addCase(promoteStudent.pending, (state) => {
        state.isPromoting = true;
        state.error = null;
      })
      .addCase(promoteStudent.fulfilled, (state, action) => {
        state.isPromoting = false;
        state.successMessage = 'Student promoted successfully';
      })
      .addCase(promoteStudent.rejected, (state, action) => {
        state.isPromoting = false;
        state.error = action.payload;
      })

      
      .addCase(deleteStudent.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.students = state.students.filter(s => s._id !== action.payload);
        state.pagination.total -= 1;
        state.successMessage = 'Student deleted successfully';
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })

      
      .addCase(fetchStudentStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.isLoadingStats = false;
      })
      
      
      .addCase(fetchStudentMonthChart.fulfilled, (state, action) => {
        state.monthlyChartData = action.payload;
        state.isLoadingCharts = false;
      })
      .addCase(fetchStudentCourseChart.fulfilled, (state, action) => {
        state.courseChartData = action.payload;
        state.isLoadingCharts = false;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  clearSelectedStudent,
  setPage,
  setLimit,
} = studentSlice.actions;

export default studentSlice.reducer;