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
      const response = await studentAPI.getAttendance(
        user.student_id || user.id,
      )
      setRecords(response.data.records)
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-8">
      <div className="card-3d p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 flex items-center gap-3 tracking-tight">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm">
            📝
          </span>{' '}
          My Attendance Records
        </h2>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-100 pb-6">
          Complete history of your attendance
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">
              Total Days Present
            </p>
            <p className="text-3xl font-black text-emerald-600 tracking-tighter relative z-10">
              {records.length}
            </p>
          </div>
          <div className="glass bg-blue-50/50 rounded-2xl p-5 border border-blue-100 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">
              This Month
            </p>
            <p className="text-3xl font-black text-blue-600 tracking-tighter relative z-10">
              {
                records.filter(
                  (r) => new Date(r.date).getMonth() === new Date().getMonth(),
                ).length
              }
            </p>
          </div>
          <div className="glass bg-purple-50/50 rounded-2xl p-5 border border-purple-100 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">
              Last Updated
            </p>
            <p className="text-xl sm:text-2xl font-black text-purple-600 tracking-tight relative z-10 mt-1">
              {records.length > 0
                ? new Date(records[0].timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Attendance List */}
        <div className="mt-8">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> History
            Logs
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 glass rounded-2xl border border-gray-100">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-sm" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                Loading records...
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 glass rounded-2xl border border-gray-100 text-center">
              <span className="text-4xl mb-3 opacity-50 drop-shadow-sm">
                📭
              </span>
              <p className="text-gray-500 font-bold text-sm tracking-wide">
                No attendance records yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record, index) => (
                <div
                  key={index}
                  className="glass bg-white hover:bg-gray-50 transition-colors p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 flex flex-col items-center justify-center shadow-inner border border-white">
                      <span className="text-xs font-black leading-none">
                        {new Date(record.date).getDate() || '-'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
                        {new Date(record.date).toLocaleString('default', {
                          month: 'short',
                        }) || '-'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 tracking-tight">
                        {record.date}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        Checked in at {record.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] sm:text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm whitespace-nowrap inline-flex items-center gap-1.5">
                      <span className="text-sm">📍</span> Campus
                    </span>
                    <span className="text-[10px] sm:text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm whitespace-nowrap inline-flex items-center gap-1.5">
                      <span className="text-sm">✅</span> Present
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAttendance
