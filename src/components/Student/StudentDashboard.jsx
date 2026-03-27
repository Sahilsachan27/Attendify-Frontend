import React, { useState } from 'react'
import StudentHome from './StudentHome'
import MarkAttendance from './MarkAttendance'
import MyAttendance from './MyAttendance'
import StudentProfile from './StudentProfile'
import Instructions from './Instructions'

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = {
    home: { icon: 'home', label: 'Dashboard' },
    mark: { icon: 'photo_camera', label: 'Mark Attendance' },
    attendance: { icon: 'event_note', label: 'My Attendance' },
    profile: { icon: 'person', label: 'My Profile' },
    instructions: { icon: 'info', label: 'Instructions' },
  }

  const handleTabClick = (key) => {
    setActiveTab(key)
    setMobileMenuOpen(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <StudentHome user={user} />
      case 'mark': return <MarkAttendance user={user} />
      case 'attendance': return <MyAttendance user={user} />
      case 'profile': return <StudentProfile user={user} />
      case 'instructions': return <Instructions />
      default: return <StudentHome user={user} />
    }
  }

  return (
    <div className="flex h-[100dvh] relative overflow-hidden text-gray-900 bg-[#f4f7fb] font-sans selection:bg-blue-500/10">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col h-screen p-6 fixed left-0 top-0 z-40 bg-[#f0f4f8]/90 backdrop-blur-2xl w-72 border-r border-[#e2e8f0]/80 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] font-sans antialiased tracking-tight">

        {/* Profile Chip */}
        <div className="mb-6 px-2">
          <div className="p-4 rounded-3xl bg-white/60 shadow-sm border border-white/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 shadow-md border-2 border-white flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-[#2d3338]">{user?.name || 'Student'}</span>
              <span className="text-[11px] text-[#596065] truncate uppercase tracking-widest font-bold">Student Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {Object.entries(tabs).map(([key, { icon, label }]) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className={`w-full text-left px-4 py-3.5 flex items-center gap-4 transition-all duration-300 active:scale-95 ease-out group rounded-2xl ${
                  isActive
                    ? 'bg-white text-emerald-700 font-extrabold shadow-md border border-white/80'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 hover:shadow-sm font-semibold'
                }`}
              >
                <span
                  className={`material-symbols-outlined transition-colors ${isActive ? 'text-emerald-600' : 'group-hover:text-slate-700'}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                <span className="text-[15px]">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6">
          <button
            onClick={onLogout}
            className="w-full py-4 px-6 rounded-2xl bg-red-50 text-red-600 font-bold shadow-sm border border-red-100/50 flex items-center justify-center gap-3 hover:bg-red-100 active:scale-95 transition-all group"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Fullscreen Menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#f4f7fb] animate-fade-in">
          <div className="flex items-center justify-between px-6 py-4 bg-[#f0f4f8]/90 backdrop-blur-xl border-b border-[#e2e8f0]/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <span className="font-black text-lg text-gray-900 tracking-tight">Student Portal</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 shadow-sm border border-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center gap-2 px-6 overflow-y-auto">
            {Object.entries(tabs).map(([key, { icon, label }]) => (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className={`w-full py-4 px-6 rounded-2xl text-base font-bold flex items-center gap-4 shadow-sm transition-all ${
                  activeTab === key
                    ? 'bg-white text-emerald-700 shadow-md border border-white/80'
                    : 'bg-white/60 text-gray-600 hover:bg-white border border-white/40'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${activeTab === key ? 'text-emerald-600' : 'text-gray-400'}`}
                  style={{ fontVariationSettings: activeTab === key ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              className="w-full py-4 px-6 rounded-2xl text-base font-bold flex items-center gap-4 mt-4 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-x-hidden relative z-10 w-full lg:ml-72 bg-[#f4f7fb]">
        {/* Top Nav */}
        <header className="flex items-center justify-between px-6 lg:px-8 py-4 sticky top-0 z-30 bg-[#f4f7fb]/80 backdrop-blur-md bg-gradient-to-b from-[#f0f4f8] to-transparent font-sans">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-white/60 flex items-center justify-center shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-gray-600">menu</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-medium hidden sm:inline">Student</span>
              <span className="text-gray-300 hidden sm:inline">›</span>
              <span className="text-gray-900 font-black tracking-tight text-lg">{tabs[activeTab].label}</span>
            </div>
          </div>

          {/* Profile chip */}
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/60 border border-white/60 hover:bg-white hover:shadow-md transition-all cursor-pointer backdrop-blur-md"
            onClick={() => setMobileMenuOpen(true)}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-black text-gray-800 tracking-tight leading-tight">{user?.name}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-12 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard
