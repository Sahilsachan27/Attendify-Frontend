import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminStyles.css';

function AttendanceRecords() {
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDailyAttendance(selectedDate);
      setRecords(response.data.records);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>📋 Attendance Records</h2>

      {/* Date Filter */}
      <div className="date-filter-section">
        <div className="date-picker-group">
          <label>📅 Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="date-input"
          />
        </div>
        <button className="btn-primary" onClick={fetchAttendance}>
          🔄 Refresh
        </button>
      </div>

      {/* Attendance Summary */}
      <div className="attendance-summary">
        <div className="summary-card">
          <span className="summary-icon">✅</span>
          <div>
            <h4>Present</h4>
            <p className="summary-number">{records.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">📅</span>
          <div>
            <h4>Date</h4>
            <p className="summary-text">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {loading ? (
        <div className="loading">Loading attendance records...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Time</th>
                <th>Location Status</th>
                <th>Face Confidence</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No attendance records for {selectedDate}
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr key={index}>
                    <td>
                      <span className="student-id">{record.student_id}</span>
                    </td>
                    <td>
                      <div className="student-name-cell">
                        <div className="student-avatar">
                          {record.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{record.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="time-badge">🕐 {record.time}</span>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        📍 Inside Geofence ({record.distance_from_campus?.toFixed(0)}m)
                      </span>
                    </td>
                    <td>
                      <span className="confidence-badge">
                        {record.face_confidence?.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">✅ Present</span>
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

export default AttendanceRecords;
