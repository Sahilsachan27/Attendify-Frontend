import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/Landing/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Student/StudentDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // decode JWT payload safely
  const decodeToken = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      // no token -> ensure cleared
      localStorage.removeItem('user');
      setUser(null);
      return;
    }

    const payload = decodeToken(token);
    if (!payload || (payload.exp && Date.now() / 1000 > payload.exp)) {
      // token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return;
    }

    // token valid: prefer stored user object, fallback to token payload (if it contains user fields)
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // some backends include user info in token (sub/name/email). use safe fallback.
      const derivedUser = {
        name: payload.name || payload.sub || '',
        role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'student',
        student_id: payload.student_id || payload.sub || undefined,
      };
      setUser(derivedUser);
    }

    // schedule automatic logout when token expires
    if (payload.exp) {
      const ttl = payload.exp * 1000 - Date.now();
      if (ttl > 0) {
        const t = setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }, ttl);
        return () => clearTimeout(t);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    // clear auth and redirect to landing page
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // ensure app shows landing page (works from any route)
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Login Route */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Register (Student self-registration) */}
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
              ) : (
                <Register />
              )
            }
          />

          {/* Protected Student Routes */}
          <Route
            path="/student/*"
            element={
              user && user.role === 'student' ? (
                <StudentDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              user && user.role === 'admin' ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
