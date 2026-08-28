import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosInstance'; 


export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async ({ page = 1, limit = 10, search = '', classId = '', status = '', sortBy = '', sortOrder = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append('search', search);
      if (classId) params.append('classId', classId);
      if (status) params.append('status', status);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await api.get(`/students?${params.toString()}`);
      
      
      return {
        ...response.data.data,
        _requestedPage: page,
        _requestedLimit: limit
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch students'
      );
    }
  }
);


export const fetchStudentById = createAsyncThunk(
  'students/fetchStudentById',
  async (id, { rejectWithValue }) => {
    try {
      
      const response = await api.get(`/students/${id}`);
      return response.data.data.student;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch student'
      );
    }
  }
);


export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (formData, { rejectWithValue }) => {
    try {
      const firstNameEn = formData.firstName_en?.trim() || '';
      const lastNameEn  = formData.lastName_en?.trim()  || '';
      const firstNameAr = (formData.firstName_ar?.trim() || firstNameEn);
      const lastNameAr  = (formData.lastName_ar?.trim()  || lastNameEn);

      const payload = {
        name: {
          en: { firstName: firstNameEn, lastName: lastNameEn },
          ar: { firstName: firstNameAr, lastName: lastNameAr }
        },
        email: formData.email?.trim(),
        password: formData.password,
        phoneNumber: formData.phone?.trim() || undefined,
        joiningDate: formData.joiningDate || undefined,
        
        
        classId: formData.classId || undefined,
        rollNumber: formData.rollNumber || undefined,
        section: formData.section || undefined,
        academicYear: formData.academicYear || undefined,
      };

      
      const { data } = await api.post('/students', payload);
      return data.data.student;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create student'
      );
    }
  }
);


export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const payload = {
        name: {   
          en: {
            firstName: formData.firstName_en?.trim(),
            lastName: formData.lastName_en?.trim(),
          },
          ar: {
            firstName: formData.firstName_ar?.trim(),
            lastName: formData.lastName_ar?.trim(),
          }
        },
        email: formData.email?.trim(),
        phoneNumber: formData.phone?.trim(),
        joiningDate: formData.joiningDate,
        languagePreference: formData.languagePreference
      };

      
      const { data } = await api.put(`/students/${id}`, payload);
      return data.data.student;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update student'
      );
    }
  }
);


export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/students/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete student'
      );
    }
  }
);


export const assignStudentToClass = createAsyncThunk(
  'students/assignClass',
  async ({ id, classData }, { rejectWithValue }) => {
    try {
      
      const { data } = await api.post(`/students/${id}/assign-class`, classData);
      return { id, enrollment: data.data.enrollment };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to assign class'
      );
    }
  }
);


export const promoteStudent = createAsyncThunk(
  'students/promoteStudent',
  async ({ id, promotionData }, { rejectWithValue }) => {
    try {
      
      const { data } = await api.post(`/students/${id}/promote`, promotionData);
      return { id, promotion: data.data.promotion };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to promote student'
      );
    }
  }
);


export const fetchStudentStats = createAsyncThunk(
  'students/fetchStudentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/students-stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchStudentMonthChart = createAsyncThunk(
  'students/fetchStudentMonthChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/students-year-chart'); 
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chart data');
    }
  }
);

export const fetchStudentCourseChart = createAsyncThunk(
  'students/fetchStudentCourseChart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/students-class-chart'); 
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course chart data');
    }
  }
);