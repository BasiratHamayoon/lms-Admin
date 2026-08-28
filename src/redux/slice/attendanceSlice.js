import { createSlice } from '@reduxjs/toolkit';
import {
  getAllStaffForAttendance,
  adminBulkCheckIn,
  adminBulkCheckOut,
  adminBulkMarkAbsent,
  adminBulkMarkLeave,
  adminCheckIn,
  adminCheckOut,
  adminMarkAbsent,
  adminMarkLeave,
  getAttendanceList,
  getAttendanceDetails,
  getAttendanceStats,
  deleteAttendance,
  getAttendanceCharts,
  getAttendanceSummary,
  getWorkHours,
  updateWorkHours,
  updateAttendance
} from '../actions/attendance';

const initialState = {
  staffList: [],
  staffByRole: {},
  totalStaff: 0,
  workHours: null,
  attendanceRecords: [],
  pagination: { total: 0, page: 1, limit: 10, pages: 0 },
  selectedAttendance: null,
  stats: null,
  summary: [],
  chartData: [],
  loading: {
    staff: false,
    list: false,
    details: false,
    action: false,
    stats: false,
    summary: false,
    charts: false,
    workHours: false
  },
  error: null,
  bulkResults: null,
  actionSuccess: false
};

const updateStaffAttendance = (staffList, userId, attendanceData) => {
  return staffList.map(staff => {
    if (staff._id === userId || staff._id?.toString() === userId) {
      return { ...staff, attendance: attendanceData };
    }
    return staff;
  });
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAttendance: (state) => {
      state.selectedAttendance = null;
    },
    clearBulkResults: (state) => {
      state.bulkResults = null;
    },
    clearActionSuccess: (state) => {
      state.actionSuccess = false;
    },
    resetAttendanceState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllStaffForAttendance.pending, (state) => {
        state.loading.staff = true;
        state.error = null;
      })
      .addCase(getAllStaffForAttendance.fulfilled, (state, action) => {
        state.loading.staff = false;
        state.staffList = action.payload?.staff || [];
        state.staffByRole = action.payload?.byRole || {};
        state.totalStaff = action.payload?.total || 0;
        state.workHours = action.payload?.workHours || null;
      })
      .addCase(getAllStaffForAttendance.rejected, (state, action) => {
        state.loading.staff = false;
        state.error = action.payload;
      })

      .addCase(getAttendanceList.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(getAttendanceList.fulfilled, (state, action) => {
        state.loading.list = false;
        state.attendanceRecords = action.payload?.attendanceRecords || [];
        state.pagination = action.payload?.pagination || { total: 0, page: 1, limit: 10, pages: 0 };
      })
      .addCase(getAttendanceList.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload;
      })

      .addCase(getAttendanceDetails.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(getAttendanceDetails.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedAttendance = action.payload?.attendance;
      })
      .addCase(getAttendanceDetails.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.payload;
      })

      .addCase(adminCheckIn.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(adminCheckIn.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionSuccess = true;
        const { attendance } = action.payload || {};
        if (attendance) { state.staffList = updateStaffAttendance(state.staffList, attendance.userId, { _id: attendance._id, status: attendance.status, timeIn: attendance.timeIn, timeOut: attendance.timeOut, totalHours: attendance.totalHours || 0 }); }
      })
      .addCase(adminCheckIn.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(adminCheckOut.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(adminCheckOut.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionSuccess = true;
        const { attendance } = action.payload || {};
        if (attendance) { state.staffList = updateStaffAttendance(state.staffList, attendance.userId, { _id: attendance._id, status: attendance.status, timeIn: attendance.timeIn, timeOut: attendance.timeOut, totalHours: attendance.totalHours || 0 }); }
      })
      .addCase(adminCheckOut.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(adminMarkAbsent.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(adminMarkAbsent.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionSuccess = true;
        const { attendance } = action.payload || {};
        if (attendance) { state.staffList = updateStaffAttendance(state.staffList, attendance.userId, { _id: attendance._id, status: 'absent', timeIn: null, timeOut: null, totalHours: 0 }); }
      })
      .addCase(adminMarkAbsent.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(adminMarkLeave.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(adminMarkLeave.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionSuccess = true;
        const { attendance } = action.payload || {};
        if (attendance) { state.staffList = updateStaffAttendance(state.staffList, attendance.userId, { _id: attendance._id, status: 'leave', timeIn: null, timeOut: null, totalHours: 0 }); }
      })
      .addCase(adminMarkLeave.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(adminBulkCheckIn.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(adminBulkCheckIn.fulfilled, (state, action) => { state.loading.action = false; state.bulkResults = action.payload; state.actionSuccess = true; })
      .addCase(adminBulkCheckIn.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(adminBulkCheckOut.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(adminBulkCheckOut.fulfilled, (state, action) => { state.loading.action = false; state.bulkResults = action.payload; state.actionSuccess = true; })
      .addCase(adminBulkCheckOut.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(adminBulkMarkAbsent.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(adminBulkMarkAbsent.fulfilled, (state, action) => { state.loading.action = false; state.bulkResults = action.payload; state.actionSuccess = true; })
      .addCase(adminBulkMarkAbsent.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(adminBulkMarkLeave.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(adminBulkMarkLeave.fulfilled, (state, action) => { state.loading.action = false; state.bulkResults = action.payload; state.actionSuccess = true; })
      .addCase(adminBulkMarkLeave.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(updateAttendance.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionSuccess = true;
        const updated = action.payload?.attendance;
        if (updated) {
          const recordIndex = state.attendanceRecords.findIndex(r => r._id === updated._id);
          if (recordIndex !== -1) { state.attendanceRecords[recordIndex] = { ...state.attendanceRecords[recordIndex], ...updated }; }
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(deleteAttendance.pending, (state) => { state.loading.action = true; state.error = null; })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading.action = false;
        state.actionSuccess = true;
        const { id: deletedId } = action.meta.arg;
        state.attendanceRecords = state.attendanceRecords.filter(r => r._id !== deletedId);
      })
      .addCase(deleteAttendance.rejected, (state, action) => { state.loading.action = false; state.error = action.payload; })

      .addCase(getAttendanceStats.pending, (state) => { state.loading.stats = true; state.error = null; })
      .addCase(getAttendanceStats.fulfilled, (state, action) => { state.loading.stats = false; state.stats = action.payload?.stats; })
      .addCase(getAttendanceStats.rejected, (state, action) => { state.loading.stats = false; state.error = action.payload; })

      .addCase(getAttendanceSummary.pending, (state) => { state.loading.summary = true; state.error = null; })
      .addCase(getAttendanceSummary.fulfilled, (state, action) => { state.loading.summary = false; state.summary = action.payload?.summary || []; })
      .addCase(getAttendanceSummary.rejected, (state, action) => { state.loading.summary = false; state.error = action.payload; })

      .addCase(getAttendanceCharts.pending, (state) => { state.loading.charts = true; state.error = null; })
      .addCase(getAttendanceCharts.fulfilled, (state, action) => { state.loading.charts = false; state.chartData = action.payload?.data || []; })
      .addCase(getAttendanceCharts.rejected, (state, action) => { state.loading.charts = false; state.error = action.payload; })

      .addCase(getWorkHours.pending, (state) => { state.loading.workHours = true; state.error = null; })
      .addCase(getWorkHours.fulfilled, (state, action) => { state.loading.workHours = false; state.workHours = action.payload?.workHours; })
      .addCase(getWorkHours.rejected, (state, action) => { state.loading.workHours = false; state.error = action.payload; })

      .addCase(updateWorkHours.pending, (state) => { state.loading.workHours = true; state.error = null; })
      .addCase(updateWorkHours.fulfilled, (state, action) => { state.loading.workHours = false; state.workHours = action.payload?.workHours; state.actionSuccess = true; })
      .addCase(updateWorkHours.rejected, (state, action) => { state.loading.workHours = false; state.error = action.payload; });
  }
});

export const {
  clearError,
  clearSelectedAttendance,
  clearBulkResults,
  clearActionSuccess,
  resetAttendanceState
} = attendanceSlice.actions;

export default attendanceSlice.reducer;