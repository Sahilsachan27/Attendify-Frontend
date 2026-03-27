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
    <div className="card-3d-modern p-6 sm:p-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm text-2xl">
            📅
          </span>
          Attendance Records
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
        <div className="flex-1 max-w-sm">
          <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="input-3d text-sm font-medium cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card-3d-modern border-blue-200 bg-blue-50/50 p-6 flex flex-col items-center text-center">
          <h3 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">Total Students</h3>
          <p className="text-4xl font-black text-blue-900 tracking-tight">{students.length}</p>
        </div>
        <div className="card-3d-modern border-emerald-200 bg-emerald-50/50 p-6 flex flex-col items-center text-center">
          <h3 className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-wider">Present Today</h3>
          <p className="text-4xl font-black text-emerald-900 tracking-tight">{attendanceRecords.length}</p>
        </div>
        <div className="card-3d-modern border-indigo-200 bg-indigo-50/50 p-6 flex flex-col items-center text-center">
          <h3 className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wider">Attendance Rate</h3>
          <p className="text-4xl font-black text-indigo-900 tracking-tight">
            {students.length > 0
              ? ((attendanceRecords.length / students.length) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="w-6 h-6 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading records...</span>
        </div>
      ) : (
        <div className="card-3d-modern !p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-black text-gray-900">Attendance for {selectedDate}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Student ID</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Name</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Time</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-gray-500 font-medium bg-gray-50/50">
                      No attendance records for this date
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
                      <td className="p-4 align-middle">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                          {record.student_id}
                        </span>
                      </td>
                      <td className="p-4 align-middle font-bold text-gray-900">{record.name}</td>
                      <td className="p-4 align-middle text-sm text-gray-600 font-medium">{record.time}</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Present
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewRecords;
