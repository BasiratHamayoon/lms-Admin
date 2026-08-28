// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@redux/slice/authSlice';
import { attachStore } from '@utils/axiosInstance';
import userSlice from '@redux/slice/userSlice';
import settingSlice from '@redux/slice/settingSlice'
import dashboardSlice from '@redux/slice/dashboardSlice'
import staffSlice from '@redux/slice/staffSlice'
import studentReducer from '@redux/slice/studentSlice'
import classReducer from '@redux/slice/classSlice'
import departmentReducer from '@redux/slice/departmentSlice'
import courseReducer from '@redux/slice/couseSlice';
import eventReducer from '@redux/slice/eventSlice';
import timetableReducer from '@redux/slice/timetableSlice';
import notificationReducer from '@redux/slice/notificationSlice'
import attendanceReducer from '@redux/slice/attendanceSlice'
import expenseSlice from '@redux/slice/expenseSlice'
import reportReducer from '@redux/slice/reportSlice';
import contractSlice from '@redux/slice/contractSlice'
import performanceReducer from '@redux/slice/performanceSlice'
import surveyReducer from '@redux/slice/surveySlice'
import feeReducer from '@redux/slice/feeSlice'
import leaveReducer from '@redux/slice/leave'
import gradeReducer from '@redux/slice/gradeSlice'
import teacherTimetableReducer from '@redux/slice/teacherTimetableSlice'
import queriesReducer from '@redux/slice/queriesSlice'
import salaryReducer from '@redux/slice/salarySlice'
import assignmentReducer from '@redux/slice/assignmentSlice'
import quizReducer from '@redux/slice/quizSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    users: userSlice,
    setting: settingSlice,
    dashboard: dashboardSlice,
    staff: staffSlice,
    students: studentReducer,
    classes: classReducer,
    departments: departmentReducer,
    courses: courseReducer,
    events: eventReducer,
    timetables: timetableReducer,
    notifications: notificationReducer,
    attendance: attendanceReducer,
    expenses: expenseSlice,
    reports: reportReducer,
    contracts: contractSlice,
    performance: performanceReducer,
    survey: surveyReducer,
    fees: feeReducer,
    leave: leaveReducer,
    grades: gradeReducer,
    teacherTimetable: teacherTimetableReducer,
    queries: queriesReducer,
    salary: salaryReducer,
    assignment: assignmentReducer,
    quiz: quizReducer
  }
});

attachStore(store);
export default store;
