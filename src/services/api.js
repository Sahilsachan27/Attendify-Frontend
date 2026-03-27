import axios from 'axios';

// ✅ Read from environment variable with explicit debugging
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

console.log('🌐 API URL being used:', API_URL);
console.log('📝 Environment variables:', import.meta.env);

if (!API_URL) {
  console.error('❌ VITE_REACT_APP_API_URL is not defined!');
}

const api = axios.create({
  baseURL: API_URL,  // https://attendifyy.onrender.com/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('🔗 Making request to:', config.baseURL + config.url);
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),  // ✅ Removed /api prefix
};

export const adminAPI = {
  registerStudent: (data) => api.post('/admin/register-student', data),  // ✅ Removed /api prefix
  trainModel: () => api.post('/admin/train-model'),  // ✅ Removed /api prefix
  getTrainingStatus: () => api.get('/admin/training-status'),  // ✅ Removed /api prefix
  getStudents: () => api.get('/admin/students'),  // ✅ Removed /api prefix
  getDailyAttendance: (date) => api.get(`/admin/attendance/daily/${date}`),  // ✅ Removed /api prefix
  checkStudentId: (studentId) => api.get(`/admin/check-student-id/${studentId}`),  // ✅ NEW: Check if Student ID exists
  deleteStudent: (studentId) => api.delete(`/admin/delete-student/${studentId}`),  // ✅ NEW: Full delete (MongoDB + Cloudinary)
};

export const studentAPI = {
  markAttendance: (data) => api.post('/student/mark-attendance', data),  // ✅ Removed /api prefix
  getAttendance: (studentId) => api.get(`/student/attendance/${studentId}`),  // ✅ Removed /api prefix
  registerFace: (data) => api.post('/student/register-face', data),  // ✅ Removed /api prefix
};

export default api;
