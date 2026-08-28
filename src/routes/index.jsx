import { createBrowserRouter } from 'react-router-dom';
import Login from '@pages/auth/Login';
import DashboardLayout from '@layouts/DashboardLayout';
import Dashboard from '@pages/private/Dashboard';
import Staff from '@pages/private/Staff';
import Students from '@pages/private/Students';
import Leave from '@pages/private/Leave'; 
import Classes from '@pages/private/Classes';
import Departments from '@pages/private/Departments';
import Courses from '@pages/private/Courses';
import Timetable from '@pages/private/Timetable';
import Events from '@pages/private/Events';
import Notifications from '@pages/private/Notifications';
import Settings from '@pages/private/Settings';
import RedirectRoute from './RedirectRoutes';
import PrivateRoutes from './PrivateRoutes';
import Queries from '@pages/private/Queries';
import Attendance from '@pages/private/Attendance';
import Salary from '@pages/private/Salary';
import Performance from '@pages/private/Performance';
import Contract from '@pages/private/Contract';
import Reports from '@pages/private/Reports';
import Fee from '@pages/private/Fee';
import Expense from '@pages/private/Expense';
import Assignment from '@pages/private/Assignment';
import Quiz from '@pages/private/Quiz';
import Grade from '@pages/private/Grade';
import Survey from '@pages/private/Survey';
import TeacherTimetable from '@pages/private/TeacherTimetable';

export default createBrowserRouter([
  {
    path: '/signin',
    element: (
      <RedirectRoute>
        <Login />
      </RedirectRoute>
    )
  },
  {
    path: '/',
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'staff',
        element: <Staff />
      },
      {
        path: 'students',
        element: <Students />
      },
      {
         path: 'assignment',
        element: <Assignment /> 
      },
      {
        path: 'quizzes', // Add this route
        element: <Quiz />
      },
      {
        path: 'grades',
        element: <Grade />
      },
      {
        path: 'attendance', 
        element: <Attendance />
      },
      {
        path: 'salary',
        element: <Salary />
      },
      {
      path: 'contracts',
      element: <Contract />
    },
      {
        path: 'leave', 
        element: <Leave />
      },
      {
        path: 'performance', 
        element: <Performance />
      },
      {
        path: 'surveys', // Add this route
        element: <Survey />
      },
      {
        path: 'classes',
        element: <Classes />
      },
      {
        path: 'teacher-Timetable', // Add this route
        element: <TeacherTimetable />
      },
      {
        path: 'departments',
        element: <Departments />
      },
      {
        path: 'timetable',
        element: <Timetable />
      },
      {
        path: 'courses',
        element: <Courses />
      },
      {
        path: 'events',
        element: <Events />
      },
      {
        path: 'notifications', 
        element: <Notifications />
      },
      {
        path: 'queries', 
        element: <Queries />
      },
      {
        path: 'expenses',
        element: <Expense />
      },
      {
        path: 'fee',
        element: <Fee />
      },
      {
        path: 'reports', 
        element: <Reports />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
]);