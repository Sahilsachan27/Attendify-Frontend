import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import './StudentStyles.css';

function ViewAttendance({ user }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    percentage: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await studentAPI.getAttendance(user.student_id || user.id);
      const attendanceRecords = response.data.records;
      setRecords(attendanceRecords);

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const thisMonthRecords = attendanceRecords.filter(
        (record) => new Date(record.timestamp).getMonth() === currentMonth
      );

      setStats({
        total: attendanceRecords.length,
        thisMonth: thisMonthRecords.length,
        percentage:
          thisMonthRecords.length > 0
            ? ((thisMonthRecords.length / 30) * 100).toFixed(1)
            : 0,
      });
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-section">
      <h2>📊 My Attendance Records</h2>

      <div className="stats-grid">
        <div className="stat-card gradient-1">
          <div className="stat-icon">📅</div>
          <h3>Total Days</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card gradient-2">
          <div className="stat-icon">🗓️</div>
          <h3>This Month</h3>
          <p className="stat-number">{stats.thisMonth}</p>
        </div>
        <div className="stat-card gradient-3">
          <div className="stat-icon">📈</div>
          <h3>Attendance %</h3>
          <p className="stat-number">{stats.percentage}%</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading your records...</div>
      ) : (
        <div className="records-table-container">
          <table className="records-table">
            <thead>
              <tr>
                <th>📅 Date</th>
                <th>⏰ Time</th>
                <th>🎯 Confidence</th>
                <th>✅ Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.time}</td>
                    <td>{record.face_confidence?.toFixed(1)}%</td>
                    <td>
                      <span className="status-badge present">✅ Present</span>
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

export default ViewAttendance;
