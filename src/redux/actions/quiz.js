import axiosInstance from '@utils/axiosInstance';

const quizApi = {
  
  getQuizDashboardCards: async () => {
    const response = await axiosInstance.get('/quiz/dashboard-cards');
    return response.data;
  },

  
  getAllSubmissions: async (params = {}) => {
    const { status, page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams();
    
    if (status && status !== 'all') queryParams.append('status', status);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    // --- THIS IS THE CORRECTED LINE ---
    const response = await axiosInstance.get(`/quiz/submissions?${queryParams.toString()}`);
    return response.data;
  },

  getQuizFilterOptions: async () => {
    const response = await axiosInstance.get('/quiz/filter-options');
    return response.data;
  },

  
  getQuizzes: async (params = {}) => {
    const {
      classId,
      section,
      fromDate,
      toDate,
      searchTitle,
      status,
      page = 1,
      limit = 10
    } = params;

    const queryParams = new URLSearchParams();
    
    if (classId && classId !== 'all') queryParams.append('classId', classId);
    if (section && section !== 'all') queryParams.append('section', section);
    if (status && status !== 'all') queryParams.append('status', status);
    if (fromDate) queryParams.append('fromDate', fromDate);
    if (toDate) queryParams.append('toDate', toDate);
    if (searchTitle && searchTitle.trim()) queryParams.append('searchTitle', searchTitle.trim());
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const response = await axiosInstance.get(`/quiz?${queryParams.toString()}`);
    return response.data;
  },

  
  createQuiz: async (formData) => {
    const response = await axiosInstance.post('/quiz/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  
  updateQuiz: async (id, formData) => {
    const response = await axiosInstance.put(`/quiz/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  
  deleteQuiz: async (id) => {
    const response = await axiosInstance.delete(`/quiz/${id}`);
    return response.data;
  },

  
  getQuizDetails: async (id) => {
    const response = await axiosInstance.get(`/quiz/${id}`);
    return response.data;
  },

  
  publishQuiz: async (id) => {
    const response = await axiosInstance.patch(`/quiz/${id}/publish`);
    return response.data;
  },

  
  closeQuiz: async (id) => {
    const response = await axiosInstance.patch(`/quiz/${id}/close`);
    return response.data;
  },

  
  gradeQuizSubmission: async (quizId, submissionId, gradeData) => {
    const response = await axiosInstance.patch(
      `/quiz/${quizId}/submission/${submissionId}/grade`,
      gradeData
    );
    return response.data;
  },

  
  downloadQuizTemplate: async () => {
    const response = await axiosInstance.get('/quiz-template', {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default quizApi;