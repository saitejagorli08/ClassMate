import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const studentService = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  getMe: () => api.get('/students/me'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  uploadPhoto: (id, file) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return api.post(`/students/${id}/photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  bulkImport: (file) => {
    const fd = new FormData();
    fd.append('csv', file);
    return api.post('/students/import/csv', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const facultyService = {
  getAll: (params) => api.get('/faculty', { params }),
  getById: (id) => api.get(`/faculty/${id}`),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),
};

export const departmentService = {
  getAll: (params) => api.get('/departments', { params }),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const courseService = {
  getAll: (params) => api.get('/courses', { params }),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const subjectService = {
  getAll: (params) => api.get('/subjects', { params }),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const classService = {
  getAll: (params) => api.get('/classes', { params }),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
};

export const attendanceService = {
  mark: (data) => api.post('/attendance/mark', data),
  markBulk: (data) => api.post('/attendance/mark-bulk', data),
  getByClass: (classId, params) => api.get(`/attendance/class/${classId}`, { params }),
  getByStudent: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  correct: (data) => api.put('/attendance/correct', data),
};

export const examinationService = {
  create: (data) => api.post('/examinations', data),
  getAll: (params) => api.get('/examinations', { params }),
  enterResults: (data) => api.post('/examinations/results', data),
  getStudentResults: (studentId, params) => api.get(`/examinations/results/student/${studentId}`, { params }),
  getClassResults: (examinationId) => api.get(`/examinations/results/class/${examinationId}`),
};

export const assignmentService = {
  getAll: (params) => api.get('/assignments', { params }),
  create: (data) => api.post('/assignments', data),
  submit: (id, data) => api.post(`/assignments/${id}/submit`, data),
  getSubmissions: (id, params) => api.get(`/assignments/${id}/submissions`, { params }),
  gradeSubmission: (id, submissionId, data) => api.put(`/assignments/${id}/submissions/${submissionId}`, data),
};

export const feeService = {
  getAll: (params) => api.get('/fees', { params }),
  create: (data) => api.post('/fees', data),
  recordPayment: (id, data) => api.post(`/fees/${id}/pay`, data),
};

export const announcementService = {
  getAll: (params) => api.get('/announcements', { params }),
  create: (data) => api.post('/announcements', data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

export const analyticsService = {
  admin: () => api.get('/analytics/admin'),
  faculty: () => api.get('/analytics/faculty'),
  student: () => api.get('/analytics/student'),
};

export const aiService = {
  chat: (message, studentId) => api.post('/ai/chat', { message, studentId }),
  generateQuiz: (data) => api.post('/ai/quiz', data),
  getPerformance: (examinationId) => api.get(`/ai/performance/${examinationId}`),
  getAdminInsights: () => api.get('/ai/admin-insights'),
  askAssistant: (data) => api.post('/ai/chat', data),
};

export const academicService = {
  getDepartments: departmentService.getAll,
  createDepartment: departmentService.create,
  getCourses: courseService.getAll,
  createCourse: courseService.create,
  getSubjects: subjectService.getAll,
  createSubject: subjectService.create,
  getClasses: classService.getAll,
  createClass: classService.create,
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  create: (data) => api.post('/users', data),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  deactivate: (id) => api.delete(`/users/${id}`),
};
