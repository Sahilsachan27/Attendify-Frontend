import React, { useState } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import Dashboard from './Dashboard'
import StudentRecords from './StudentRecords'
import RegisterStudent from './RegisterStudent'
import AttendanceRecords from './AttendanceRecords'
import FaceAuthStatus from './FaceAuthStatus'
import GeofenceConfig from './GeofenceConfig'
import TrainModel from './TrainModel'
import AdminProfile from './AdminProfile'
import './ProSidebarStyles.css'

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = {
    dashboard: { icon: '📊', label: 'Dashboard' },
    students: { icon: '👥', label: 'Student Records' },
    register: { icon: '➕', label: 'Register Student' },
    attendance: { icon: '📋', label: 'Attendance Records' },
    faceauth: { icon: '🎭', label: 'Face Auth Status' },
    geofence: { icon: '🌍', label: 'Geofence Config' },
    train: { icon: '🤖', label: 'Train Model' },
    profile: { icon: '👤', label: 'Profile' },
  }

  const handleTabClick = (key) => {
    setActiveTab(key)
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
    <div className="flex h-[100dvh] relative overflow-hidden text-gray-900 bg-transparent font-sans">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block relative z-30">
        <Sidebar
          collapsed={collapsed}
          backgroundColor="transparent"
          width="260px"
          collapsedWidth="70px"
          className="h-screen border-r border-white/40 glass-dark"
        >
          {/* Sidebar Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ✨ Admin Portal
              </h2>
            )}
            {/* Sidebar controls: arrow when open, admin icon when collapsed */}
            <div>
              {!collapsed ? (
                <button
                  onClick={() => setCollapsed(true)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white text-sm hidden lg:flex"
                  aria-label="Collapse sidebar"
                  title="Collapse"
                >
                  ←
                </button>
              ) : (
                // Admin icon with configurable size and position
                <div className="flex w-full justify-center items-center">
                  <button
                    onClick={() => setCollapsed(false)}
                    className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-[0_8px_15px_rgba(99,102,241,0.4)] transition-transform hover:scale-105"
                    aria-label="Open sidebar"
                    title="Open sidebar"
                    style={{
                      width: '40px',
                      height: '40px',
                    }}
                  >
                    🛡️
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Top Gradient Bar */}
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* Menu Items */}
          <Menu
            menuItemStyles={{
              button: ({ active }) => ({
                backgroundColor: active ? 'transparent' : 'transparent',
                color: 'white',
                padding: '10px 16px',
                margin: '4px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(4px)',
                },
              }),
            }}
          >
            {Object.entries(tabs).map(([key, { icon, label }]) => (
              <MenuItem
                key={key}
                icon={<span className="text-lg">{icon}</span>}
                active={activeTab === key}
                onClick={() => handleTabClick(key)}
                style={
                  activeTab === key
                    ? {
                        background:
                          'linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.05))',
                        borderLeft: '4px solid #818cf8',
                      }
                    : {}
                }
              >
                {label}
              </MenuItem>
            ))}
          </Menu>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-0 right-0 px-4">
            <button
              onClick={onLogout}
              className="w-full px-3 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 font-bold 
                         shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 
                         transition-all duration-200 flex items-center justify-center gap-2 text-white"
            >
              <span className="text-lg">🚪</span>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </Sidebar>
      </div>

      {/* Mobile Fullscreen Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col backdrop-blur-xl bg-black/40">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-xl sm:text-2xl drop-shadow-sm">🛡️</span>
              <span className="font-black text-lg text-gray-900 tracking-tight">
                Attendify Admin
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-colors shadow-sm"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center items-center gap-4 px-4 overflow-y-auto w-full max-w-sm mx-auto">
            {Object.entries(tabs).map(([key, { icon, label }]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key)
                  setMobileMenuOpen(false)
                }}
                className={`w-full py-4 px-6 rounded-2xl text-lg font-bold flex items-center gap-4 shadow-sm transition-all
                  ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_8px_20px_rgba(99,102,241,0.3)] scale-105'
                      : 'bg-white/90 text-gray-800 hover:bg-white'
                  }
                `}
              >
                <span className="text-2xl">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              className="w-full py-4 px-6 rounded-2xl text-lg font-bold flex items-center gap-4 mt-8 bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:scale-105 transition-all"
            >
              <span className="text-2xl">🚪</span>
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden relative z-10 w-full">
        {/* Top Navigation Bar */}
        <header className="h-16 glass shadow-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Only visible on mobile: app logo when menu is closed */}
            <div className="w-10 h-10 rounded-xl bg-gradient-1 flex items-center justify-center text-white lg:hidden shadow-md">
              <span className="text-lg">🛡️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                Admin Portal
              </span>
              <span className="text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {tabs[activeTab]?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="relative w-10 h-10 rounded-xl bg-white/50 border border-gray-200/50 
                               hover:bg-white hover:border-indigo-200 transition-all flex items-center justify-center shadow-sm"
            >
              <span className="text-lg">🔔</span>
              <span
                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 
                               rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-sm"
              >
                3
              </span>
            </button>
            <div
              className="flex items-center gap-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white/50 border border-gray-200/50 hover:bg-white hover:border-indigo-200 transition-all cursor-pointer"
              onClick={() => {
                if (window.innerWidth < 1024) setMobileMenuOpen(true)
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-1 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
