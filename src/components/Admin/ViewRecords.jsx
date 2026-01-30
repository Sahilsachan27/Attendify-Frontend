import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminStyles.css';

function ViewRecords() {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchDailyAttendance();
  }, [selectedDate]);

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getStudents();
      setStudents(response.data.students);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchDailyAttendance = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDailyAttendance(selectedDate);
      setAttendanceRecords(response.data.records);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>Attendance Records</h2>

      <div className="filters">
        <div className="form-group">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{students.length}</p>
        </div>
        <div className="stat-card">
          <h3>Present Today</h3>
          <p className="stat-number">{attendanceRecords.length}</p>
        </div>
        <div className="stat-card">
          <h3>Attendance Rate</h3>
          <p className="stat-number">
            {students.length > 0
              ? ((attendanceRecords.length / students.length) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading records...</div>
      ) : (
        <div className="records-table">
          <h3>Attendance for {selectedDate}</h3>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No attendance records for this date
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{record.student_id}</td>
                    <td>{record.name}</td>
                    <td>{record.time}</td>
                    <td>
                      <span className="status-badge present">Present</span>
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

export default ViewRecords;
