import React, { useState, useEffect } from 'react'
import { studentAPI } from '../../services/api'

function MyAttendance({ user }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      const response = await studentAPI.getAttendance(user.student_id || user.id)
      setRecords(response.data.records)
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const thisMonthCount = records.filter(
    (r) => new Date(r.date).getMonth() === new Date().getMonth()
  ).length

  const lastUpdated = records.length > 0
    ? new Date(records[0].timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : 'N/A'

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in py-6">
      <div className="card-3d-modern p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1 flex items-center gap-3 tracking-tight">
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm">📝</span>
          My Attendance Records
        </h2>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-5">
          Complete history of your attendance
        </p>

        {/* Summary Stats */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex-none px-5 py-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 min-w-[165px]">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-emerald-700 font-black text-base shadow-sm border border-emerald-100">{records.length}</div>
            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Total Present</span>
          </div>
          <div className="flex-none px-5 py-3.5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3 min-w-[150px]">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-blue-700 font-black text-base shadow-sm border border-blue-100">{thisMonthCount}</div>
            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">This Month</span>
          </div>
          <div className="flex-none px-5 py-3.5 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-3 min-w-[160px]">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-purple-700 font-black text-xs shadow-sm border border-purple-100">{lastUpdated}</div>
            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Last Updated</span>
          </div>
        </div>

        {/* History List */}
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> History Logs
        </h3>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-500">Loading records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-gray-100 text-center">
            <span className="text-4xl mb-3 opacity-40">📭</span>
            <p className="text-gray-500 font-medium text-sm">No attendance records yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record, index) => (
              <div
                key={index}
                className="bg-white hover:bg-gray-50 transition-colors p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex flex-col items-center justify-center shadow-sm shrink-0">
                    <span className="text-sm font-black leading-none">{new Date(record.date).getDate() || '-'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      {new Date(record.date).toLocaleString('default', { month: 'short' }) || '-'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800 tracking-tight">{record.date}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Checked in at {record.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    <span className="text-sm">📍</span> Campus
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="text-sm">✅</span> Present
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAttendance
