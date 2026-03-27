import React, { useState, useEffect } from 'react'
import { studentAPI } from '../../services/api'

function StudentHome({ user }) {
  const [todayStatus, setTodayStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkTodayAttendance()
  }, [])

  const checkTodayAttendance = async () => {
    try {
      const response = await studentAPI.getAttendance(user.student_id || user.id)
      const today = new Date().toISOString().split('T')[0]
      const todayRecord = response.data.records.find((r) => r.date === today)
      setTodayStatus(todayRecord || null)
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in py-6">

      {/* Welcome Banner */}
      <div className="card-3d-modern p-6 sm:p-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white relative overflow-hidden group">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1 tracking-tight">👋 Welcome back, {user.name}!</h1>
            <p className="text-sm text-white/80 font-semibold uppercase tracking-widest">Student Dashboard · Smart Attendance</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-xl">
            🎓
          </div>
        </div>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '🎓', label: 'Student ID', value: user.student_id || user.id, accent: 'blue' },
          { icon: '🏢', label: 'Department', value: user.department || 'Not Set', accent: 'purple' },
          { icon: '📚', label: 'Year / Class', value: `Year ${user.year || 'N/A'}`, accent: 'amber' },
        ].map((info, idx) => (
          <div key={idx} className="card-3d-modern p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shrink-0 shadow-sm">
              {info.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{info.label}</p>
              <p className="text-lg font-black text-gray-800 tracking-tight truncate">{info.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Attendance */}
      <div className="card-3d-modern p-6 sm:p-8">
        <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight border-b border-gray-100 pb-4">
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm">📅</span>
          Today's Attendance
        </h2>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-8">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-500">Checking status...</span>
          </div>
        ) : todayStatus ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">✓</div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-black text-emerald-800 mb-0.5">Attendance Marked</h3>
                <p className="text-sm font-semibold text-emerald-600 mb-4">You are present today!</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 p-3 rounded-xl border border-emerald-100/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Time</p>
                    <p className="text-base font-black text-gray-800 font-mono">{todayStatus.time}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-emerald-100/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date</p>
                    <p className="text-base font-black text-gray-800">{todayStatus.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center text-white text-2xl shadow-lg shrink-0 animate-pulse">!</div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-black text-rose-800 mb-0.5">Not Marked Yet</h3>
                <p className="text-sm font-semibold text-rose-600">Please mark your attendance today</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="card-3d-modern p-6 sm:p-8">
        <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-3 tracking-tight">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-xl shadow-sm">🔧</span>
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '👤', label: 'Face Scan', status: 'Active & Ready', ok: true },
            { icon: '📍', label: 'Location Check', status: 'Active & Monitoring', ok: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest truncate">{item.label}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.ok ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${item.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{item.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudentHome
