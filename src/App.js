import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import StudentDashboard from './components/Student/StudentDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              user.role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/student" replace />
              )
            }
          />
          <Route
            path="/student/*"
            element={<StudentDashboard user={user} onLogout={handleLogout} />}
          />
          <Route
            path="/admin/*"
            element={<AdminDashboard user={user} onLogout={handleLogout} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
