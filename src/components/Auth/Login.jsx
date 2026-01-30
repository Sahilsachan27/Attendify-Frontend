import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '', // Student ID / Admin ID / Email
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container px-2 py-8 min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
      <div className="login-card w-full max-w-xs sm:max-w-md md:max-w-lg p-4 sm:p-8 rounded-2xl shadow-lg bg-white">
        <div className="login-header">
          <h1>🎓 Smart Attendance</h1>
          <p>AI-Powered Face Recognition System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>📧 Student ID / Email</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter Student ID (e.g., stu001) or Email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login w-full" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </form>

        {/* Actions: Login or Register */}
        <div style={{ marginTop: '1rem' }}>
          <p><strong>New User?</strong></p>
          <button
            className="btn-login w-full mt-3"
            type="button"
            onClick={() => navigate('/register')}
          >
            ✍️ Register as Student
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
