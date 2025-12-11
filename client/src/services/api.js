import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (userData) => api.post('/auth/login', userData),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
};

export const studentAPI = {
  getQuizzes: () => api.get('/quizzes'), 
  getResults: () => api.get('/attempts'), 
  getClasses: () => api.get('/classes'), 
  joinClass: (classCode) => api.post('/classes/join', { classCode }),
  submitQuiz: (quizId, answers) => api.post(`/attempts/${quizId}`, { answers }),
  getQuizDetail: (quizId) => api.get(`/quizzes/${quizId}`),
};

export const teacherAPI = {
  getClasses: () => api.get('/classes'),
  createClass: (classData) => api.post('/classes', classData),
  updateClass: (id, classData) => api.put(`/classes/${id}`, classData),
  deleteClass: (id) => api.delete(`/classes/${id}`),
  getQuizzes: () => api.get('/quizzes'),
  createQuiz: (quizData) => api.post('/quizzes', quizData),
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  getQuestions: () => api.get('/questions'),
  createQuestion: (questionData) => api.post('/questions', questionData),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getQuizzes: () => api.get('/admin/quizzes'),
  getClasses: () => api.get('/admin/classes'),
  getStats: () => api.get('/admin/stats'),
};

export default api;