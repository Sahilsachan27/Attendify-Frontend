import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminStyles.css';

function StudentRecords() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getStudents();
      setStudents(response.data.students);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDept === 'all' || student.department === filterDept;
    
    return matchesSearch && matchesDept;
  });

  const departments = [...new Set(students.map(s => s.department))];

  return (
    <div className="admin-section">
      <div className="section-header-row">
        <h2>👥 Student Records</h2>
        <button className="btn-primary">➕ Add New Student</button>
      </div>

      {/* Search and Filters */}
      <div className="filters-row">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Student Statistics */}
      <div className="mini-stats">
        <div className="mini-stat">
          <span className="mini-stat-label">Total Students</span>
          <span className="mini-stat-value">{students.length}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-label">Face Registered</span>
          <span className="mini-stat-value">
            {students.filter(s => s.face_registered).length}
          </span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-label">Pending Setup</span>
          <span className="mini-stat-value">
            {students.filter(s => !s.face_registered).length}
          </span>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="loading">Loading student records...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>Face Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    {searchTerm || filterDept !== 'all'
                      ? 'No students match your filters'
                      : 'No students registered yet'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <span className="student-id">{student.student_id}</span>
                    </td>
                    <td>
                      <div className="student-name-cell">
                        <div className="student-avatar">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td>{student.email}</td>
                    <td>{student.department}</td>
                    <td>Year {student.year}</td>
                    <td>
                      {student.face_registered ? (
                        <span className="badge badge-success">
                          ✅ Registered
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          ⏳ Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-view" title="View Details">
                          👁️
                        </button>
                        <button className="btn-icon btn-edit" title="Edit">
                          ✏️
                        </button>
                        <button className="btn-icon btn-delete" title="Delete">
                          🗑️
                        </button>
                      </div>
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

export default StudentRecords;
