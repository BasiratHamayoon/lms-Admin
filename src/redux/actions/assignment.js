import axiosInstance from '@utils/axiosInstance';

const assignmentApi = {
  // GET /assignment - Get teacher's assignments with filters, search, and pagination
  getTeacherAssignments: async (params = {}) => {
    const {
      status,
      classId,
      courseId,
      search,
      page = 1,
      limit = 20
    } = params;

    const queryParams = new URLSearchParams();

    if (status && status !== 'all') queryParams.append('status', status);
    if (classId && classId !== 'all') queryParams.append('classId', classId);
    if (courseId && courseId !== 'all') queryParams.append('courseId', courseId);
    if (search && search.trim()) queryParams.append('search', search.trim());

    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const response = await axiosInstance.get(`/assignment?${queryParams.toString()}`);
    return response.data;
  },

  // POST /assignment/ - Create assignment
  createAssignment: async (formData) => {
    const response = await axiosInstance.post('/assignment/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // PUT /assignment/:id - Update assignment
  updateAssignment: async (id, formData) => {
    const response = await axiosInstance.put(`/assignment/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // DELETE /assignment/:id - Delete assignment
  deleteAssignment: async (id) => {
    const response = await axiosInstance.delete(`/assignment/${id}`);
    return response.data;
  },

  // PATCH /assignment/:id/publish - Publish assignment
  publishAssignment: async (id) => {
    const response = await axiosInstance.patch(`/assignment/${id}/publish`);
    return response.data;
  },

  // PATCH /assignment/:id/assign - Assign to specific students
  assignToStudents: async (id, data) => {
    const response = await axiosInstance.patch(`/assignment/${id}/assign`, data);
    return response.data;
  },

  // GET /assignment/:id/submissions - Get all submissions for an assignment
  getAssignmentSubmissions: async (assignmentId) => {
    const response = await axiosInstance.get(`/assignment/${assignmentId}/submissions`);
    return response.data;
  },

  // GET /assignment/:assignmentId/submission/:submissionId - Get single submission
  getSingleSubmission: async (assignmentId, submissionId) => {
    const response = await axiosInstance.get(`/assignment/${assignmentId}/submission/${submissionId}`);
    return response.data;
  },

  // PATCH /assignment/:assignmentId/submission/:submissionId/grade - Grade submission
  gradeSubmission: async (assignmentId, submissionId, gradeData) => {
    const response = await axiosInstance.patch(
      `/assignment/${assignmentId}/submission/${submissionId}/grade`,
      gradeData
    );
    return response.data;
  },

  // GET /assignment/options/classes - Get class options
  getClassOptions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.courseId) queryParams.append('courseId', params.courseId);
    if (params.teacherId) queryParams.append('teacherId', params.teacherId);
    if (params.academicYear) queryParams.append('academicYear', params.academicYear);
    if (params.active !== undefined) queryParams.append('active', params.active);

    const response = await axiosInstance.get(`/assignment/options/classes?${queryParams.toString()}`);
    return response.data;
  },

  // GET /assignment/options/courses - Get course options
  getCourseOptions: async () => {
    const response = await axiosInstance.get('/assignment/options/courses');
    return response.data;
  },

  // GET /assignment/class/:classId/students - Get students for a class
  getClassStudents: async (classId) => {
    const response = await axiosInstance.get(`/assignment/class/${classId}/students`);
    return response.data;
  }
};

export default assignmentApi;