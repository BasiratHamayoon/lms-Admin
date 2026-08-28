import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assignmentApi from '../actions/assignment';

// Fetch teacher assignments with filters, search, pagination
export const fetchTeacherAssignments = createAsyncThunk(
  'assignment/fetchTeacherAssignments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await assignmentApi.getTeacherAssignments(params);
      const { assignments = [], pagination = {} } = res.data || {};

      return {
        assignments,
        meta: {
          total: pagination.total ?? 0,
          page: pagination.page ?? 1,
          limit: pagination.limit ?? 20,
          totalPages: pagination.totalPages ?? 1,
        },
        appliedFilters: {
          status: params.status || '',
          classId: params.classId || '',
          courseId: params.courseId || '',
          search: params.search || '',
        }
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch assignments'
      );
    }
  }
);

// Create assignment
export const createAssignment = createAsyncThunk(
  'assignment/createAssignment',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.createAssignment(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create assignment');
    }
  }
);

// Update assignment
export const updateAssignment = createAsyncThunk(
  'assignment/updateAssignment',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.updateAssignment(id, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update assignment');
    }
  }
);

// Delete assignment
export const deleteAssignment = createAsyncThunk(
  'assignment/deleteAssignment',
  async (id, { rejectWithValue }) => {
    try {
      await assignmentApi.deleteAssignment(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete assignment');
    }
  }
);

// Publish assignment
export const publishAssignment = createAsyncThunk(
  'assignment/publishAssignment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.publishAssignment(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish assignment');
    }
  }
);

// Assign to students
export const assignToStudents = createAsyncThunk(
  'assignment/assignToStudents',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.assignToStudents(id, data);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign students');
    }
  }
);

// Fetch assignment submissions
export const fetchAssignmentSubmissions = createAsyncThunk(
  'assignment/fetchAssignmentSubmissions',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getAssignmentSubmissions(assignmentId);
      return {
        assignmentId,
        submissions: response.data?.submissions || [],
        stats: response.data?.stats || {},
        assignment: response.data?.assignment || null
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions');
    }
  }
);

// Fetch single submission
export const fetchSingleSubmission = createAsyncThunk(
  'assignment/fetchSingleSubmission',
  async ({ assignmentId, submissionId }, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getSingleSubmission(assignmentId, submissionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submission');
    }
  }
);

// Grade submission
export const gradeSubmission = createAsyncThunk(
  'assignment/gradeSubmission',
  async ({ assignmentId, submissionId, gradeData }, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.gradeSubmission(assignmentId, submissionId, gradeData);
      return { assignmentId, submissionId, submission: response.data?.submission };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to grade submission');
    }
  }
);

// Fetch class students
export const fetchClassStudents = createAsyncThunk(
  'assignment/fetchClassStudents',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getClassStudents(classId);
      return response.data?.students || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

// Fetch class options
export const fetchAssignmentClassOptions = createAsyncThunk(
  'assignment/fetchClassOptions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getClassOptions(params);
      return response.data?.options || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class options');
    }
  }
);

// Fetch course options
export const fetchAssignmentCourseOptions = createAsyncThunk(
  'assignment/fetchCourseOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getCourseOptions();
      return response.data?.courses || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course options');
    }
  }
);

const initialState = {
  assignments: [],
  submissions: [],
  submissionsByAssignment: {},
  classStudents: [],
  classOptions: [],
  courseOptions: [],
  selectedAssignment: null,
  selectedSubmission: null,
  meta: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1
  },
  loading: {
    assignments: false,
    submissions: false,
    students: false,
    options: false,
    create: false,
    update: false,
    delete: false,
    grade: false,
    publish: false,
    assign: false
  },
  error: null,
  filters: {
    status: '',
    classId: '',
    courseId: '',
    search: ''
  }
};

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    setSelectedAssignment: (state, action) => {
      state.selectedAssignment = action.payload;
    },
    setSelectedSubmission: (state, action) => {
      state.selectedSubmission = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        classId: '',
        courseId: '',
        search: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearClassStudents: (state) => {
      state.classStudents = [];
    },
    resetAssignmentState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch Teacher Assignments
      .addCase(fetchTeacherAssignments.pending, (state) => {
        state.loading.assignments = true;
        state.error = null;
      })
      .addCase(fetchTeacherAssignments.fulfilled, (state, action) => {
        state.loading.assignments = false;
        state.assignments = action.payload.assignments;
        state.meta = action.payload.meta;
        if (action.payload.appliedFilters) {
          state.filters = action.payload.appliedFilters;
        }
      })
      .addCase(fetchTeacherAssignments.rejected, (state, action) => {
        state.loading.assignments = false;
        state.error = action.payload;
      })

      // Create Assignment
      .addCase(createAssignment.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload.data?.assignment) {
          state.assignments.unshift(action.payload.data.assignment);
          state.meta.total += 1;
        }
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      // Update Assignment
      .addCase(updateAssignment.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedAssignment = action.payload.data?.assignment;
        if (updatedAssignment) {
          const index = state.assignments.findIndex(a => a._id === updatedAssignment._id);
          if (index !== -1) {
            state.assignments[index] = updatedAssignment;
          }
          if (state.selectedAssignment?._id === updatedAssignment._id) {
            state.selectedAssignment = updatedAssignment;
          }
        }
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      // Delete Assignment
      .addCase(deleteAssignment.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.assignments = state.assignments.filter(a => a._id !== action.payload);
        state.meta.total = Math.max(0, state.meta.total - 1);
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      })

      // Publish Assignment
      .addCase(publishAssignment.pending, (state) => {
        state.loading.publish = true;
        state.error = null;
      })
      .addCase(publishAssignment.fulfilled, (state, action) => {
        state.loading.publish = false;
        const publishedAssignment = action.payload.data?.assignment;
        if (publishedAssignment) {
          const index = state.assignments.findIndex(a => a._id === publishedAssignment._id);
          if (index !== -1) {
            state.assignments[index] = publishedAssignment;
          }
          if (state.selectedAssignment?._id === publishedAssignment._id) {
            state.selectedAssignment = publishedAssignment;
          }
        }
      })
      .addCase(publishAssignment.rejected, (state, action) => {
        state.loading.publish = false;
        state.error = action.payload;
      })

      // Assign to Students
      .addCase(assignToStudents.pending, (state) => {
        state.loading.assign = true;
        state.error = null;
      })
      .addCase(assignToStudents.fulfilled, (state, action) => {
        state.loading.assign = false;
        const index = state.assignments.findIndex(a => a._id === action.payload.id);
        if (index !== -1 && action.payload.data?.assignedCount !== undefined) {
          state.assignments[index] = {
            ...state.assignments[index],
            assignedTo: new Array(action.payload.data.assignedCount).fill(null),
            submissionStats: {
              ...state.assignments[index].submissionStats,
              total: action.payload.data.assignedCount
            }
          };
        }
      })
      .addCase(assignToStudents.rejected, (state, action) => {
        state.loading.assign = false;
        state.error = action.payload;
      })

      // Fetch Assignment Submissions
      .addCase(fetchAssignmentSubmissions.pending, (state) => {
        state.loading.submissions = true;
        state.error = null;
      })
      .addCase(fetchAssignmentSubmissions.fulfilled, (state, action) => {
        state.loading.submissions = false;
        const { assignmentId, submissions, assignment } = action.payload;

        state.submissionsByAssignment[assignmentId] = submissions;

        const enhancedSubmissions = submissions.map(sub => ({
          ...sub,
          assignmentId,
          assignmentTitle: assignment?.title,
          totalMarks: assignment?.totalMarks
        }));

        state.submissions = [
          ...state.submissions.filter(s => s.assignmentId !== assignmentId),
          ...enhancedSubmissions
        ];
      })
      .addCase(fetchAssignmentSubmissions.rejected, (state, action) => {
        state.loading.submissions = false;
        state.error = action.payload;
      })

      // Fetch Single Submission
      .addCase(fetchSingleSubmission.pending, (state) => {
        state.loading.submissions = true;
      })
      .addCase(fetchSingleSubmission.fulfilled, (state, action) => {
        state.loading.submissions = false;
        state.selectedSubmission = action.payload?.submission;
        state.selectedAssignment = action.payload?.assignment || state.selectedAssignment;
      })
      .addCase(fetchSingleSubmission.rejected, (state, action) => {
        state.loading.submissions = false;
        state.error = action.payload;
      })

      // Grade Submission
      .addCase(gradeSubmission.pending, (state) => {
        state.loading.grade = true;
        state.error = null;
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        state.loading.grade = false;
        const { assignmentId, submissionId, submission } = action.payload;

        const index = state.submissions.findIndex(s => s._id === submissionId);
        if (index !== -1) {
          state.submissions[index] = { ...state.submissions[index], ...submission };
        }

        if (state.submissionsByAssignment[assignmentId]) {
          const subIndex = state.submissionsByAssignment[assignmentId].findIndex(s => s._id === submissionId);
          if (subIndex !== -1) {
            state.submissionsByAssignment[assignmentId][subIndex] = {
              ...state.submissionsByAssignment[assignmentId][subIndex],
              ...submission
            };
          }
        }

        if (state.selectedSubmission?._id === submissionId) {
          state.selectedSubmission = { ...state.selectedSubmission, ...submission };
        }
      })
      .addCase(gradeSubmission.rejected, (state, action) => {
        state.loading.grade = false;
        state.error = action.payload;
      })

      // Fetch Class Students
      .addCase(fetchClassStudents.pending, (state) => {
        state.loading.students = true;
        state.error = null;
      })
      .addCase(fetchClassStudents.fulfilled, (state, action) => {
        state.loading.students = false;
        state.classStudents = action.payload;
      })
      .addCase(fetchClassStudents.rejected, (state, action) => {
        state.loading.students = false;
        state.error = action.payload;
      })

      // Fetch Class Options
      .addCase(fetchAssignmentClassOptions.pending, (state) => {
        state.loading.options = true;
      })
      .addCase(fetchAssignmentClassOptions.fulfilled, (state, action) => {
        state.loading.options = false;
        state.classOptions = action.payload;
      })
      .addCase(fetchAssignmentClassOptions.rejected, (state, action) => {
        state.loading.options = false;
        state.error = action.payload;
      })

      // Fetch Course Options
      .addCase(fetchAssignmentCourseOptions.pending, (state) => {
        state.loading.options = true;
      })
      .addCase(fetchAssignmentCourseOptions.fulfilled, (state, action) => {
        state.loading.options = false;
        state.courseOptions = action.payload;
      })
      .addCase(fetchAssignmentCourseOptions.rejected, (state, action) => {
        state.loading.options = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSelectedAssignment,
  setSelectedSubmission,
  setFilters,
  clearFilters,
  clearError,
  clearClassStudents,
  resetAssignmentState
} = assignmentSlice.actions;

// Selectors
export const selectAssignments = (state) => state.assignment.assignments;
export const selectSubmissions = (state) => state.assignment.submissions;
export const selectSubmissionsByAssignment = (assignmentId) => (state) =>
  state.assignment.submissionsByAssignment[assignmentId] || [];
export const selectClassStudents = (state) => state.assignment.classStudents;
export const selectAssignmentClassOptions = (state) => state.assignment.classOptions;
export const selectAssignmentCourseOptions = (state) => state.assignment.courseOptions;
export const selectSelectedAssignment = (state) => state.assignment.selectedAssignment;
export const selectSelectedSubmission = (state) => state.assignment.selectedSubmission;
export const selectMeta = (state) => state.assignment.meta;
export const selectLoading = (state) => state.assignment.loading;
export const selectError = (state) => state.assignment.error;
export const selectFilters = (state) => state.assignment.filters;

export const selectAssignmentStats = (state) => {
  const assignments = state.assignment?.assignments || [];
  const submissions = state.assignment?.submissions || [];
  const meta = state.assignment?.meta || {};

  return {
    total: meta.total || assignments.length,
    active: assignments.filter(a => a?.status === 'published').length,
    draft: assignments.filter(a => a?.status === 'draft').length,
    pendingGrading: submissions.filter(s => s?.status === 'submitted').length,
    graded: submissions.filter(s => s?.status === 'graded').length,
  };
};

export default assignmentSlice.reducer;