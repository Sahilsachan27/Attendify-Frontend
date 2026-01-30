import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

function MyAttendance({ user }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await studentAPI.getAttendance(user.student_id || user.id);
      setRecords(response.data.records);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          📝 My Attendance Records
        </h2>
        <p className="text-sm text-gray-600 mb-4">Complete history of your attendance</p>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded p-3 border-2 border-green-200">
            <p className="text-xs font-semibold text-green-700 mb-1">Total Days Present</p>
            <p className="text-2xl font-black text-green-600">{records.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded p-3 border-2 border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">This Month</p>
            <p className="text-2xl font-black text-blue-600">
              {records.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded p-3 border-2 border-purple-200">
            <p className="text-xs font-semibold text-purple-700 mb-1">Last Updated</p>
            <p className="text-sm font-black text-purple-600">
              {records.length > 0 ? new Date(records[0].timestamp).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Attendance Table */}
        {loading ? (
          <div className="text-center py-8 text-gray-600 text-sm">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-base text-gray-600 mb-1">📭 No attendance records yet</p>
            <p className="text-sm text-gray-500">Start marking your attendance to see records here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="text-left p-2 font-semibold text-gray-700 text-xs">📅 Date</th>
                  <th className="text-left p-2 font-semibold text-gray-700 text-xs">⏰ Time</th>
                  <th className="text-left p-2 font-semibold text-gray-700 text-xs">📍 Location</th>
                  <th className="text-left p-2 font-semibold text-gray-700 text-xs">✅ Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-2 font-medium text-gray-900 text-sm">{record.date}</td>
                    <td className="p-2 text-gray-700 text-sm">{record.time}</td>
                    <td className="p-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        📍 Inside Geofence
                      </span>
                    </td>
                    <td className="p-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        ✅ Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAttendance;
