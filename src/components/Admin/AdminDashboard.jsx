import React, { useState } from 'react'
import Dashboard from './Dashboard'
import StudentRecords from './StudentRecords'
import RegisterStudent from './RegisterStudent'
import AttendanceRecords from './AttendanceRecords'
import ViewRecords from './ViewRecords'
import FaceAuthStatus from './FaceAuthStatus'
import GeofenceConfig from './GeofenceConfig'
import TrainModel from './TrainModel'
import AdminProfile from './AdminProfile'

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = {
    dashboard: { icon: 'dashboard', label: 'Dashboard' },
    register: { icon: 'person_add', label: 'Register Student' },
    students: { icon: 'inventory', label: 'Student Records' },
    attendance: { icon: 'event_available', label: 'Attendance Records' },
    viewrecords: { icon: 'visibility', label: 'View Records' },
    geofence: { icon: 'distance', label: 'Geofence Config' },
    faceauth: { icon: 'face', label: 'Face Auth Status' },
    train: { icon: 'model_training', label: 'Train Model' },
    profile: { icon: 'admin_panel_settings', label: 'Admin Profile' },
  }

  const handleTabClick = (key) => {
    setActiveTab(key)
    if (window.innerWidth < 1024) setMobileMenuOpen(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />
      case 'students':
        return <StudentRecords />
      case 'register':
        return <RegisterStudent />
      case 'attendance':
        return <AttendanceRecords />
      case 'viewrecords':
        return <ViewRecords />
      case 'faceauth':
        return <FaceAuthStatus />
      case 'geofence':
        return <GeofenceConfig />
      case 'train':
        return <TrainModel />
      case 'profile':
        return <AdminProfile user={user} />
      default:
        return <Dashboard onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="flex h-[100dvh] relative overflow-hidden text-gray-900 bg-[#f4f7fb] font-sans selection:bg-blue-500/10">
      
      {/* 3D Glassmorphic Desktop Sidebar from Stitch MCP */}
      <aside className="hidden lg:flex flex-col h-full p-6 fixed left-0 top-0 z-40 bg-[#f0f4f8]/90 backdrop-blur-2xl h-screen w-72 border-r border-[#e2e8f0]/80 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] font-sans antialiased tracking-tight">
        {/* Header Section */}
        <div className="mb-6 px-4">
          {/* Profile Glimpse */}
          <div className="p-4 rounded-3xl bg-white/60 shadow-sm border border-white/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 shadow-md border-2 border-white flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-[#2d3338]">{user?.name || 'Administrator'}</span>
              <span className="text-[11px] text-[#596065] truncate uppercase tracking-widest font-bold">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {Object.entries(tabs).map(([key, { icon, label }]) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className={`w-full text-left px-4 py-3.5 flex items-center gap-4 transition-all duration-300 active:scale-95 ease-out group rounded-2xl ${
                  isActive
                    ? 'bg-white text-blue-700 font-extrabold shadow-md border 1 border-white/80'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 hover:shadow-sm font-semibold'
                }`}
              >
                <span
                  className={`material-symbols-outlined transition-colors ${isActive ? 'text-blue-600' : 'group-hover:text-gray-600'}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                <span className="text-[15px]">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer CTA */}
        <div className="mt-auto pt-6">
          <button
            onClick={onLogout}
            className="w-full py-4 px-6 rounded-2xl bg-red-50 text-red-600 font-bold shadow-sm border border-red-100/50 flex items-center justify-center gap-3 hover:bg-red-100 active:scale-95 transition-all group"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">logout</span>
            System Sync Out
          </button>
        </div>
      </aside>

      {/* Mobile Fullscreen Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#f4f7fb] animate-fade-in">
          <div className="flex items-center justify-between px-6 py-4 bg-[#f0f4f8]/90 backdrop-blur-xl border-b border-[#e2e8f0]/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-sm">cloud_sync</span>
              </div>
              <span className="font-bold text-lg text-[#2d3338] tracking-tight">Nexus Admin</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-2 p-6 overflow-y-auto">
            {Object.entries(tabs).map(([key, { icon, label }]) => {
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => handleTabClick(key)}
                  className={`w-full py-4 px-6 rounded-2xl text-left font-semibold flex items-center gap-4 transition-all shadow-sm ${
                    isActive
                      ? 'bg-white text-blue-700 border border-blue-100'
                      : 'bg-transparent text-[#596065] hover:bg-white border hover:border-gray-100'
                  }`}
                  style={{ borderColor: isActive ? '' : 'transparent' }}
                >
                  <span className={`material-symbols-outlined text-xl ${isActive ? 'text-blue-600' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {icon}
                  </span>
                  <span>{label}</span>
                </button>
              )
            })}
            <button
              onClick={onLogout}
              className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold flex items-center justify-center gap-3 shadow-xl shadow-red-500/20"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Space with padding to account for fixed sidebar */}
      <div className="flex-1 flex flex-col overflow-x-hidden relative z-10 w-full lg:ml-72 bg-[#f4f7fb]">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between px-6 lg:px-8 py-4 sticky top-0 z-30 bg-[#f4f7fb]/80 backdrop-blur-md bg-gradient-to-b from-[#f0f4f8] to-transparent font-sans">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 lg:hidden"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight text-[#2d3338]">
              {tabs[activeTab]?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <input 
                className="bg-[#f2f4f7] border-none rounded-full px-6 py-2.5 text-sm w-64 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-[#2d3338]" 
                placeholder="Search parameters..." 
                type="text" 
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
            </div>
            <div className="flex items-center gap-2 lg:border-l lg:border-gray-200 lg:pl-4 lg:ml-2">
              <button className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[#2d3338] transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[#2d3338] transition-colors hidden sm:flex">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth z-10 relative">
          {renderContent()}
        </main>
        
        {/* Decorative Background Elements behind content */}
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none -z-0 rounded-full"></div>
        <div className="fixed top-20 right-40 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] pointer-events-none -z-0 rounded-full"></div>
      </div>
    </div>
  )
}

export default AdminDashboard

