import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import './AdminStyles.css'
import './Dashboard.css'

function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    presentCount: 0,
    absentCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: '🎓 Student Management',
      desc: 'Manage all student records efficiently',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      title: '👤 Face Recognition',
      desc: '99.9% accurate AI-powered authentication',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      title: '📍 Geo-fencing Active',
      desc: 'Zero proxy attendance guaranteed',
      gradient: 'from-cyan-500 to-blue-600',
    },
  ]

  useEffect(() => {
    fetchDashboardStats()
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const [studentsRes, attendanceRes] = await Promise.all([
        adminAPI.getStudents(),
        adminAPI.getDailyAttendance(today),
      ])

      setStats({
        totalStudents: studentsRes.data.count,
        todayAttendance: attendanceRes.data.count,
        presentCount: attendanceRes.data.count,
        absentCount: studentsRes.data.count - attendanceRes.data.count,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Stats Slider - Responsive height */}
      <div className="relative h-40 sm:h-56 rounded-[2rem] overflow-hidden card-3d-modern !p-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} flex items-center justify-center 
                       transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
          >
            <div className="text-center text-white px-6 sm:px-12 backdrop-blur-md bg-white/20 p-8 rounded-3xl border border-white/30 shadow-lg">
              <h2 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-4 tracking-tight drop-shadow-sm">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-lg font-medium opacity-90 drop-shadow-sm">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 bg-white/30 p-2 rounded-full backdrop-blur-md border border-white/40">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-500 
                         ${index === currentSlide ? 'w-8 bg-white shadow-md' : 'w-2.5 bg-white/60 hover:bg-white'}`}
            />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400 flex items-center justify-center gap-2">
          <div className="w-6 h-6 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading stats...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards - Fully responsive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: '👥',
                label: 'Total Students',
                value: stats.totalStudents,
                sublabel: 'Registered',
                gradient: 'from-blue-500 to-cyan-500',
                colorType: 'blue',
              },
              {
                icon: '✅',
                label: 'Present Today',
                value: stats.presentCount,
                sublabel:
                  stats.totalStudents > 0
                    ? `${((stats.presentCount / stats.totalStudents) * 100).toFixed(1)}%`
                    : '0%',
                gradient: 'from-emerald-500 to-teal-500',
                colorType: 'emerald',
              },
              {
                icon: '❌',
                label: 'Absent Today',
                value: stats.absentCount,
                sublabel:
                  stats.totalStudents > 0
                    ? `${((stats.absentCount / stats.totalStudents) * 100).toFixed(1)}%`
                    : '0%',
                gradient: 'from-rose-500 to-pink-500',
                colorType: 'rose',
              },
              {
                icon: '📅',
                label: 'Today',
                value: stats.todayAttendance,
                sublabel: new Date().toLocaleDateString(),
                gradient: 'from-indigo-500 to-purple-500',
                colorType: 'indigo',
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="card-3d-modern p-5 sm:p-6 group flex flex-col justify-between overflow-hidden relative"
              >
                <div
                  className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.colorType}-100 rounded-full opacity-50 blur-xl group-hover:scale-150 transition-transform duration-500`}
                ></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${stat.colorType}-50 flex items-center justify-center text-2xl border border-${stat.colorType}-100 text-${stat.colorType}-600 transform group-hover:rotate-6 transition-transform`}
                  >
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-bold text-${stat.colorType}-600 bg-${stat.colorType}-50 px-2 py-1 rounded-lg uppercase tracking-wider`}>
                    {stat.sublabel}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* System Status - Responsive grid */}
          <div className="card-3d-modern p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                🔧
              </span>{' '}
              System Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: '✅',
                  title: 'Face Recognition',
                  status: 'Active',
                  active: true,
                },
                {
                  icon: '✅',
                  title: 'Geofencing',
                  status: 'Active',
                  active: true,
                },
                {
                  icon: '☁️',
                  title: 'Database',
                  status: 'Connected',
                  active: true,
                },
                {
                  icon: '🤖',
                  title: 'AI Model',
                  status: 'Ready',
                  active: true,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-300 transition-colors group box-border shadow-sm"
                >
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform border border-gray-100">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${item.active ? 'bg-emerald-500 shadow-sm' : 'bg-rose-500'}`}
                      ></div>
                      <p
                        className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${item.active ? 'text-emerald-700' : 'text-rose-700'}`}
                      >
                        {item.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions - Responsive grid */}
          <div className="card-3d-modern p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                ⚡
              </span>{' '}
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: '➕',
                  label: 'Register Student',
                  gradient: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
                  actionName: 'register',
                },
                {
                  icon: '📊',
                  label: 'View Attendance',
                  gradient: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
                  actionName: 'attendance',
                },
                {
                  icon: '🤖',
                  label: 'Train Model',
                  gradient: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200',
                  actionName: 'train',
                },
                {
                  icon: '⚙️',
                  label: 'Settings',
                  gradient: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200',
                  actionName: 'profile',
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate && onNavigate(action.actionName)}
                  className={`p-5 sm:p-6 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-3 min-h-[120px]
                             ${
                               action.actionName === 'register' ? 'btn-3d-primary' : 
                               action.actionName === 'attendance' ? 'btn-3d-success' : 
                               action.actionName === 'train' ? 'btn-3d-secondary' : 
                               'btn-3d-secondary'
                             }`}
                >
                  <span className="text-3xl bg-white p-3 rounded-xl shadow-sm">
                    {action.icon}
                  </span>
                  <span className="text-center tracking-wide">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
