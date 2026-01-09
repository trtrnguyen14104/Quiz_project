import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (userData) => api.post("/auth/login", userData),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  resendVerification: (email) =>
    api.post("/auth/resend-verification", { email }),
};

export const studentAPI = {
  getDashboard: () => api.get("/student/dashboard"),
  getQuizzes: (params) => api.get("/student/quizzes", { params }),
  getResults: (params) => api.get("/student/results", { params }),
  getClasses: () => api.get("/student/classes"),
  getClassQuizzes: (classId) => api.get(`/student/classes/${classId}/quizzes`),
  getClassStudents: (classId) => api.get(`/student/classes/${classId}/students`),
  getMyCreatedQuizzes: () => api.get("/student/my-created-quizzes"),
  joinClass: (class_code) => api.post("/classes/join", { class_code }),
  getQuizDetail: (quiz_id) => api.get(`/quizzes/${quiz_id}`),
  getQuizWithQuestions: (quiz_id) => api.get(`/quizzes/${quiz_id}/full`),

  // Quiz attempt APIs
  startAttempt: (quizId) => api.post(`/attempts/quiz/${quizId}/start`),
  submitAnswer: (attemptId, data) => api.post(`/attempts/${attemptId}/answer`, data),
  finishAttempt: (attemptId) => api.post(`/attempts/${attemptId}/finish`),
  getAttemptResult: (attemptId) => api.get(`/attempts/${attemptId}/result`),

  // Quiz creation
  createQuiz: (quizData) => api.post("/quizzes/with-questions", quizData),
  updateQuiz: (quizId, quizData) => api.put(`/quizzes/${quizId}/with-questions`, quizData),
  deleteQuiz: (quizId) => api.delete(`/quizzes/${quizId}`),
};

export const teacherAPI = {
  getDashboard: () => api.get("/teacher/dashboard"),
  getClasses: (params) => api.get("/teacher/classes", { params }),
  getClassDetail: (id) => api.get(`/classes/${id}`),
  getClassMembers: (id) => api.get(`/classes/${id}/members`),
  getClassQuizzes: (id) => api.get(`/classes/${id}/quizzes`),
  getQuizzes: (params) => api.get("/teacher/quizzes", { params }),
  getQuizWithQuestions: (quizId) => api.get(`/quizzes/${quizId}/full`),
  getStatistics: () => api.get("/teacher/statistics"),
  createClass: (classData) => api.post("/classes", classData),
  updateClass: (id, classData) => api.put(`/classes/${id}`, classData),
  deleteClass: (id) => api.delete(`/classes/${id}`),
  assignQuizToClass: (classId, quizData) => api.post(`/classes/${classId}/quizzes`, quizData),
  removeQuizFromClass: (classId, classQuizId) => api.delete(`/classes/${classId}/quizzes/${classQuizId}`),
  removeMemberFromClass: (classId, memberId) => api.delete(`/classes/${classId}/members/${memberId}`),
  createQuiz: (quizData) => api.post("/quizzes/with-questions", quizData),
  updateQuiz: (quizId, quizData) => api.put(`/quizzes/${quizId}/with-questions`, quizData),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  getQuestions: () => api.get("/questions"),
  createQuestion: (questionData) => api.post("/questions", questionData),
};

// Common APIs
export const commonAPI = {
  getSubjects: () => api.get("/subjects"),
  getSubjectTopics: (subjectId) => api.get(`/subjects/${subjectId}/topics`),
};

export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (userData) => api.post("/admin/users", userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getQuizzes: (params) => api.get("/admin/quizzes", { params }),
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  updateQuizStatus: (id, status) => api.put(`/admin/quizzes/${id}/status`, { status }),
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),
  getClasses: (params) => api.get("/admin/classes", { params }),
  getStatistics: (params) => api.get("/admin/statistics", { params }),
  getSystemLogs: (params) => api.get("/admin/logs", { params }),
};

export default api;
