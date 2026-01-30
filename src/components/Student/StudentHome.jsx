import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

function StudentHome({ user }) {
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTodayAttendance();
  }, []);

  const checkTodayAttendance = async () => {
    try {
      const response = await studentAPI.getAttendance(user.student_id || user.id);
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = response.data.records.find(r => r.date === today);
      setTodayStatus(todayRecord || null);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-md">
        <h1 className="text-xl font-bold mb-1">👋 Welcome, {user.name}!</h1>
        <p className="text-sm text-green-100">Student Dashboard - Smart Attendance System</p>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎓</div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Student ID</p>
              <p className="text-base font-bold text-gray-900">{user.student_id || user.id}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-purple-500">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏢</div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Department</p>
              <p className="text-base font-bold text-gray-900">{user.department || 'Not Set'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📚</div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Year / Class</p>
              <p className="text-base font-bold text-gray-900">Year {user.year || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Attendance Status */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          📅 Today's Attendance Status
        </h2>
        
        {loading ? (
          <div className="text-center py-6 text-gray-600 text-sm">Loading...</div>
        ) : todayStatus ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="text-lg font-bold text-green-700">Attendance Marked</h3>
                <p className="text-sm text-green-600">You are present today!</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-600">Time</p>
                <p className="text-sm font-bold text-gray-900">{todayStatus.time}</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-600">Date</p>
                <p className="text-sm font-bold text-gray-900">{todayStatus.date}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">❌</div>
              <div>
                <h3 className="text-lg font-bold text-red-700">Not Marked Yet</h3>
                <p className="text-sm text-red-600">Please mark your attendance today</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          🔧 System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-200">
            <div className="text-2xl">👤</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Face Scan</p>
              <p className="text-xs text-green-600 font-semibold">✅ Active & Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded border border-blue-200">
            <div className="text-2xl">📍</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Location Check</p>
              <p className="text-xs text-blue-600 font-semibold">✅ Active & Monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
