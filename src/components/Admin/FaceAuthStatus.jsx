import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminStyles.css';

function FaceAuthStatus() {
  const [authLogs, setAuthLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthLogs();
  }, []);

  const fetchAuthLogs = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await adminAPI.getDailyAttendance(today);
      
      // Format data for face auth display
      const logs = response.data.records.map(record => ({
        ...record,
        matchResult: 'Success',
        matchConfidence: record.face_confidence || 0,
      }));
      
      setAuthLogs(logs);
    } catch (error) {
      console.error('Failed to fetch auth logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>🎭 Face Authentication Status</h2>

      {/* Stats Overview */}
      <div className="auth-stats-grid">
        <div className="auth-stat-card card-green">
          <div className="stat-icon">✅</div>
          <div>
            <h4>Successful Matches</h4>
            <p className="stat-number">{authLogs.length}</p>
          </div>
        </div>
        <div className="auth-stat-card card-red">
          <div className="stat-icon">❌</div>
          <div>
            <h4>Failed Attempts</h4>
            <p className="stat-number">0</p>
          </div>
        </div>
        <div className="auth-stat-card card-blue">
          <div className="stat-icon">📊</div>
          <div>
            <h4>Average Confidence</h4>
            <p className="stat-number">
              {authLogs.length > 0
                ? (
                    authLogs.reduce((sum, log) => sum + log.matchConfidence, 0) /
                    authLogs.length
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Auth Logs Table */}
      {loading ? (
        <div className="loading">Loading authentication logs...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Match Result</th>
                <th>Confidence Score</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {authLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No authentication logs for today
                  </td>
                </tr>
              ) : (
                authLogs.map((log, index) => (
                  <tr key={index}>
                    <td>
                      <div className="student-name-cell">
                        <div className="student-avatar">
                          {log.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{log.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="student-id">{log.student_id}</span>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        ✅ {log.matchResult}
                      </span>
                    </td>
                    <td>
                      <div className="confidence-bar-container">
                        <div
                          className="confidence-bar"
                          style={{
                            width: `${log.matchConfidence}%`,
                            backgroundColor:
                              log.matchConfidence > 80
                                ? '#10b981'
                                : log.matchConfidence > 60
                                ? '#f59e0b'
                                : '#ef4444',
                          }}
                        ></div>
                        <span className="confidence-text">
                          {log.matchConfidence.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="time-badge">
                        🕐 {log.time}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        ✅ Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FaceAuthStatus;
