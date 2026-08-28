import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@utils/axiosInstance';

export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (
    {
      page = 1,
      limit = 10,
      search = '',
      courseId,
      teacherId,
      academicYear,
      active,
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append('search', search);
      if (courseId) params.append('courseId', courseId);
      if (teacherId) params.append('teacherId', teacherId);
      if (academicYear) params.append('academicYear', academicYear);
      if (active !== undefined && active !== null && active !== '') {
        params.append('active', String(active));
      }

      const { data } = await api.get(`/classes?${params.toString()}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch classes'
      );
    }
  }
);

export const fetchClassById = createAsyncThunk(
  'classes/fetchClassById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/classes/${id}`);
      return data.data.class;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch class'
      );
    }
  }
);

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (formData, { rejectWithValue }) => {
    try {
      const nameObj =
        typeof formData.name === 'object'
          ? { en: formData.name.en || '', ar: formData.name.ar || '' }
          : { en: formData.name || '', ar: '' };

      const sectionObj =
        typeof formData.section === 'object'
          ? { en: formData.section.en || '', ar: formData.section.ar || '' }
          : { en: formData.section || '', ar: '' };

      const payload = {
        name: nameObj,
        section: sectionObj,
        courseIds: formData.courseId
          ? [formData.courseId]
          : Array.isArray(formData.courseIds)
          ? formData.courseIds
          : [],

        teacherIds: formData.teacherId
          ? [formData.teacherId]
          : Array.isArray(formData.teacherIds)
          ? formData.teacherIds
          : [],
        startTime: formData.startTime
          ? new Date(
              `${new Date().toISOString().split('T')[0]}T${
                formData.startTime
              }:00.000Z`
            ).toISOString()
          : undefined,

        endTime: formData.endTime
          ? new Date(
              `${new Date().toISOString().split('T')[0]}T${
                formData.endTime
              }:00.000Z`
            ).toISOString()
          : undefined,

        days: Array.isArray(formData.days)
          ? formData.days
          : formData.days
          ? String(formData.days).split(',')
          : [],

        academicYear: formData.academicYear,
        semester: formData.semester,
      };

      const { data } = await api.post('/classes', payload);
      return data.data.class;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create class'
      );
    }
  }
);

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const payload = {};

      if (formData.name) {
        payload.name = {
          en: formData.name.en || '',
          ar: formData.name.ar || '',
        };
      }

      if (formData.section) {
        payload.section = {
          en: formData.section.en || '',
          ar: formData.section.ar || '',
        };
      }

      if (formData.courseId || Array.isArray(formData.courseIds)) {
        payload.courseIds = formData.courseId
          ? [formData.courseId]
          : formData.courseIds;
      }

      if (formData.teacherId || Array.isArray(formData.teacherIds)) {
        payload.teacherIds = formData.teacherId
          ? [formData.teacherId]
          : formData.teacherIds;
      }

      if (formData.startTime) {
        payload.startTime = new Date(
          `${new Date().toISOString().split('T')[0]}T${
            formData.startTime
          }:00.000Z`
        ).toISOString();
      }

      if (formData.endTime) {
        payload.endTime = new Date(
          `${new Date().toISOString().split('T')[0]}T${
            formData.endTime
          }:00.000Z`
        ).toISOString();
      }

      if (formData.days) {
        payload.days = Array.isArray(formData.days)
          ? formData.days
          : String(formData.days).split(',');
      }

      if (formData.academicYear) payload.academicYear = formData.academicYear;
      if (formData.semester) payload.semester = formData.semester;
      if (formData.status === 'active') payload.active = true;
      if (formData.status === 'inactive') payload.active = false;

      const { data } = await api.patch(`/classes/${id}`, payload);
      return data.data.class;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update class'
      );
    }
  }
);

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/classes/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete class'
      );
    }
  }
);

export const fetchClassStats = createAsyncThunk(
  'classes/fetchClassStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/classes/stats');
      console.log('Fetching Class Stats', data.data);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch class stats'
      );
    }
  }
);

export const fetchStudentsPerClassChart = createAsyncThunk(
  '/classes/students-class',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('classes/students-class');
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch students per class chart data'
      );
    }
  }
);

export const fetchClassStatusChart = createAsyncThunk(
  'classes/fetchClassStatusChart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/classes/status');
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch class status chart data'
      );
    }
  }
);

export const fetchCourseOptions = createAsyncThunk(
  'classes/fetchCourseOptions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/course-options');
      return data.data.courses;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch course options'
      );
    }
  }
);

export const fetchTeacherOptions = createAsyncThunk(
  'classes/fetchTeacherOptions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/teacher-options');
      return data.data.teachers;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch teacher options'
      );
    }
  }
);

export const fetchClassOptions = createAsyncThunk(
  'classes/fetchClassOptions',
  async (
    { courseId, teacherId, academicYear, active } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (courseId) params.append('courseId', courseId);
      if (teacherId) params.append('teacherId', teacherId);
      if (academicYear) params.append('academicYear', academicYear);
      if (active !== undefined && active !== null && active !== '') {
        params.append('active', String(active));
      }

      const { data } = await api.get(
        `/classes-options?${params.toString()}`
      );

      console.log("Class Options API Response:", data.data);


      return data.data.options || data.data.classes || data.data || [];

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch class options'
      );
    }
  }
);