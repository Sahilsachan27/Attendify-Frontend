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
    <div className="card-3d-modern p-6 sm:p-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm text-2xl">
            🎭
          </span>
          Face Authentication Status
        </h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card-3d-modern border-emerald-200 bg-emerald-50/50 p-6 flex flex-col items-center text-center">
          <span className="text-3xl mb-3">✅</span>
          <h4 className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-wider">Successful Matches</h4>
          <p className="text-4xl font-black text-emerald-900 tracking-tight">{authLogs.length}</p>
        </div>
        <div className="card-3d-modern border-rose-200 bg-rose-50/50 p-6 flex flex-col items-center text-center">
          <span className="text-3xl mb-3">❌</span>
          <h4 className="text-sm font-bold text-rose-600 mb-2 uppercase tracking-wider">Failed Attempts</h4>
          <p className="text-4xl font-black text-rose-900 tracking-tight">0</p>
        </div>
        <div className="card-3d-modern border-blue-200 bg-blue-50/50 p-6 flex flex-col items-center text-center">
          <span className="text-3xl mb-3">📊</span>
          <h4 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">Average Confidence</h4>
          <p className="text-4xl font-black text-blue-900 tracking-tight">
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

      {/* Auth Logs Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="w-6 h-6 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading authentication logs...</span>
        </div>
      ) : (
        <div className="card-3d-modern !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Student Name</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Student ID</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Match Result</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest min-w-[150px]">Confidence Score</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Timestamp</th>
                  <th className="p-4 font-bold text-gray-500 text-[11px] uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {authLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-500 font-medium bg-gray-50/50">
                      No authentication logs for today
                    </td>
                  </tr>
                ) : (
                  authLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm border border-indigo-200">
                            {log.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900">{log.name}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                          {log.student_id}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="text-sm">✅</span> {log.matchResult}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${log.matchConfidence}%`,
                                backgroundColor:
                                  log.matchConfidence > 80
                                    ? '#10b981' // emerald
                                    : log.matchConfidence > 60
                                    ? '#f59e0b' // amber
                                    : '#ef4444', // red
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-gray-600 font-mono w-12">
                            {log.matchConfidence.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm whitespace-nowrap">
                          🕐 {log.time}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified
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

export default FaceAuthStatus;
