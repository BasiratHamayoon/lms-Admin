import api from '@utils/axiosInstance';

const gradeService = {

  getClassGrades: async (classId, params = {}) => {
    const response = await api.get(`/grades/class/${classId}`, { params });
    return response.data;
  },

  getClassSubjectGrades: async (classId, courseId, params = {}) => {
    const response = await api.get(`/grades/class/${classId}/subject/${courseId}`, { params });
    return response.data;
  },

  getStudentGrades: async (studentId, params = {}) => {
    const response = await api.get(`/grades/student/${studentId}`, { params });
    return response.data;
  },

  createGrade: async (gradeData) => {
    const response = await api.post('/grades', gradeData);
    return response.data;
  },

  uploadGradesExcel: async (formData) => {
    const response = await api.post('/grades/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateGrade: async (id, gradeData) => {
    const response = await api.put(`/grades/${id}`, gradeData);
    return response.data;
  },

  addAssessment: async (id, assessmentData) => {
    const response = await api.post(`/grades/${id}/assessment`, assessmentData);
    return response.data;
  },

  publishGrade: async (id) => {
    const response = await api.patch(`/grades/${id}/publish`);
    return response.data;
  },

  bulkPublishGrades: async (gradeIds) => {
    const response = await api.patch('/grades/bulk-publish', { gradeIds });
    return response.data;
  },

  archiveGrade: async (id) => {
    const response = await api.patch(`/grades/${id}/archive`);
    return response.data;
  },

  deleteGrade: async (id) => {
    const response = await api.delete(`/grades/${id}`);
    return response.data;
  },

  deleteAssessment: async (gradeId, assessmentName) => {
    const response = await api.delete(`/grades/${gradeId}/assessment/${encodeURIComponent(assessmentName)}`);
    return response.data;
  },

  getClassOptions: async (params = {}) => {
    const response = await api.get('/class-options', { params });
    return response.data;
  },

  getCourseOptions: async () => {
    const response = await api.get('/course-options');
    return response.data;
  },

  getClassStudents: async (classId) => {
    const response = await api.get(`/grades-class/${classId}/students`);
    return response.data;
  },
};

export default gradeService;