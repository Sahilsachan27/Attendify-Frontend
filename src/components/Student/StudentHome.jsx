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
      const response = await studentAPI.getAttendance(
        user.student_id || user.id,
      )
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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-8">
      {/* Welcome Header */}
      <div className="card-3d p-6 sm:p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight drop-shadow-md">
              👋 Welcome back, {user.name}!
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-bold uppercase tracking-widest drop-shadow-sm">
              Student Dashboard - Smart Attendance System
            </p>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl sm:text-4xl shadow-xl transform rotate-3 group-hover:-rotate-6 transition-transform">
            🎓
          </div>
        </div>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            icon: '🎓',
            label: 'Student ID',
            value: user.student_id || user.id,
            gradient: 'from-blue-500 to-cyan-400',
          },
          {
            icon: '🏢',
            label: 'Department',
            value: user.department || 'Not Set',
            gradient: 'from-purple-500 to-fuchsia-400',
          },
          {
            icon: '📚',
            label: 'Year / Class',
            value: `Year ${user.year || 'N/A'}`,
            gradient: 'from-orange-400 to-amber-400',
          },
        ].map((info, idx) => (
          <div
            key={idx}
            className="card-3d p-5 sm:p-6 group flex flex-col justify-between overflow-hidden relative border-t-[6px] border-t-white/40"
          >
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${info.gradient} rounded-full opacity-10 blur-xl group-hover:scale-150 transition-transform duration-500`}
            ></div>
            <div className="flex items-center gap-4 relative z-10">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-2xl shadow-lg text-white transform group-hover:rotate-6 transition-transform`}
              >
                {info.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {info.label}
                </p>
                <p className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight truncate">
                  {info.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Attendance Status */}
      <div className="card-3d p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight border-b border-gray-100 pb-4">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm">
            📅
          </span>{' '}
          Today's Attendance
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-sm" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Checking Status...
            </p>
          </div>
        ) : todayStatus ? (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-400 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white shrink-0 animate-bounce-in">
                ✓
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight mb-1">
                  Attendance Marked
                </h3>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">
                  You are present today!
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass bg-white/60 p-3 rounded-xl border border-emerald-100/50">
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Time
                    </p>
                    <p className="text-base sm:text-lg font-black text-gray-800 font-mono tracking-tighter">
                      {todayStatus.time}
                    </p>
                  </div>
                  <div className="glass bg-white/60 p-3 rounded-xl border border-emerald-100/50">
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Date
                    </p>
                    <p className="text-base sm:text-lg font-black text-gray-800 tracking-tight">
                      {todayStatus.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-400 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-400 to-red-500 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(244,63,94,0.4)] text-white shrink-0 animate-pulse">
                !
              </div>
              <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl font-black text-rose-800 tracking-tight mb-1">
                  Not Marked Yet
                </h3>
                <p className="text-sm font-bold text-rose-600 uppercase tracking-widest">
                  Please mark your attendance today
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="card-3d p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
          <span className="p-2 bg-purple-50 text-purple-600 rounded-xl shadow-sm">
            🔧
          </span>{' '}
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-gray-100/50 hover:border-indigo-200 transition-colors group">
            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 uppercase tracking-widest truncate">
                Face Scan
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Active & Ready
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-gray-100/50 hover:border-indigo-200 transition-colors group">
            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              📍
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 uppercase tracking-widest truncate">
                Location Check
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Active & Monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentHome
