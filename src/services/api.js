import axios from 'axios';

// ✅ Read from environment variable with explicit debugging
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

console.log('🌐 API URL being used:', API_URL);
console.log('📝 Environment variables:', import.meta.env);

if (!API_URL) {
  console.error('❌ VITE_REACT_APP_API_URL is not defined!');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging + auto-logout on 401
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    // If token expired/unauthorized, clear storage and redirect to landing
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        /* ignore */
      }
      // give a moment for any UI updates, then redirect
      window.setTimeout(() => (window.location.href = '/'), 200);
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Admin API
export const adminAPI = {
  registerStudent: (data) => api.post('/admin/register-student', data),
  uploadFace: (studentId, images) =>
    api.post(`/admin/upload-face/${studentId}`, { images }),
  trainModel: () => api.post('/admin/train-model'),
  getTrainingStatus: () => api.get('/admin/training-status'), // NEW
  getStudents: () => api.get('/admin/students'),
  getDailyAttendance: (date) => api.get(`/admin/attendance/daily/${date}`),
};

// Student API
export const studentAPI = {
  markAttendance: (data) => {
    console.log('📝 Marking attendance with data:', {
      student_id: data.student_id,
      latitude: data.latitude,
      longitude: data.longitude,
      hasImage: !!data.image,
    });
    return api.post('/student/mark-attendance', data);
  },
  getAttendance: (studentId) => api.get(`/student/attendance/${studentId}`),
  test: () => api.get('/student/test'),
  // ✅ NEW: Face registration method
  registerFace: (data) => api.post('/student/register-face', data),
};

// Test API connection
export const testAPI = () => api.get('/test');

export default api;
