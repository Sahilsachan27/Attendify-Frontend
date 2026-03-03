import React, { useState } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import StudentHome from './StudentHome'
import MarkAttendance from './MarkAttendance'
import MyAttendance from './MyAttendance'
import StudentProfile from './StudentProfile'
import Instructions from './Instructions'
import '../Admin/ProSidebarStyles.css'

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = {
    home: { icon: '🏠', label: 'Dashboard' },
    mark: { icon: '📸', label: 'Mark Attendance' },
    attendance: { icon: '📝', label: 'My Attendance' },
    profile: { icon: '👤', label: 'My Profile' },
    instructions: { icon: 'ℹ️', label: 'Instructions' },
  }

  const handleTabClick = (key) => {
    setActiveTab(key)
    setMobileMenuOpen(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <StudentHome user={user} />
      case 'mark':
        return <MarkAttendance user={user} />
      case 'attendance':
        return <MyAttendance user={user} />
      case 'profile':
        return <StudentProfile user={user} />
      case 'instructions':
        return <Instructions />
      default:
        return <StudentHome user={user} />
    }
  }

  // Student icon positioning config (edit these values to control placement)
  const iconConfig = {
    align: 'center', // 'left' | 'center' | 'right'
    size: 38, // px (auto scales on retina)
    offsetX: 4, // px (positive = move right, negative = move left)
    offsetY: 0, // px (positive = move down, negative = move up)
  }

  const alignClass =
    iconConfig.align === 'center'
      ? 'justify-center'
      : iconConfig.align === 'right'
        ? 'justify-end'
        : 'justify-start'

  // Calculate sidebar width based on collapsed state
  const sidebarWidth = collapsed ? 70 : 260

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
            {collapsed ? (
              <div className="flex items-center justify-center w-full">
                <button
                  type="button"
                  onClick={() => setCollapsed(false)}
                  className="rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg shadow-sm hover:scale-105 transition-transform w-10 h-10"
                  title="Open sidebar"
                >
                  🎓
                </button>
              </div>
            ) : (
              <h2 className="text-lg font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ✨ Attendify Student
              </h2>
            )}

            {/* controls */}
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white text-sm"
                title="Collapse"
              >
                ←
              </button>
            )}
          </div>

          <div className="p-4 flex flex-col gap-2">
            <Menu
              menuItemStyles={{
                button: ({ active }) => ({
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '10px 12px',
                  margin: '4px 10px',
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
                  icon={
                    <span
                      className={`text-xl transition-transform ${activeTab === key ? 'scale-110 drop-shadow-md' : 'opacity-80'}`}
                    >
                      {icon}
                    </span>
                  }
                  active={activeTab === key}
                  onClick={() => handleTabClick(key)}
                  style={
                    activeTab === key
                      ? {
                          background:
                            'linear-gradient(90deg, rgba(16, 185, 129, 0.15), transparent)',
                        }
                      : {}
                  }
                >
                  {!collapsed && <span className="tracking-wide">{label}</span>}
                </MenuItem>
              ))}
            </Menu>
          </div>

          <div className="absolute bottom-6 left-0 right-0 px-4">
            <button
              onClick={onLogout}
              className="w-full px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-red-500 to-rose-600 font-bold 
                         shadow-[0_8px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_8px_25px_rgba(225,29,72,0.5)] 
                         hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-white border border-red-400"
            >
              <span className="text-lg drop-shadow-sm">🚪</span>
              {!collapsed && (
                <span className="tracking-wide text-base">Sign Out</span>
              )}
            </button>
          </div>
        </Sidebar>
      </div>

      {/* Mobile Fullscreen Menu (triggered by avatar) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col backdrop-blur-xl bg-black/40">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-xl sm:text-2xl drop-shadow-sm">👨‍🎓</span>
              <span className="font-black text-lg text-gray-900 tracking-tight">
                Attendify Student
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
                onClick={() => handleTabClick(key)}
                className={`w-full py-4 px-6 rounded-2xl text-lg font-bold flex items-center gap-4 shadow-sm transition-all
                  ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] scale-105'
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full lg:w-auto h-[100dvh] min-w-0">
        <div className="flex-1 overflow-y-auto">
          <header className="h-16 lg:h-20 glass border-b border-white/40 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 mb-4 lg:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-xl sm:text-2xl hidden sm:inline drop-shadow-sm">
                  👨‍🎓
                </span>
                <span className="text-gray-500 hidden sm:inline font-bold uppercase tracking-widest text-[10px]">
                  Student
                </span>
                <span className="text-gray-300 hidden sm:inline">›</span>
                <span className="text-gray-900 font-black tracking-tight text-base sm:text-xl">
                  {tabs[activeTab].label}
                </span>
              </div>
            </div>

            {/* Profile Dropdown Area & Mobile Logout */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-3 px-2 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-white/50 border border-white/60 hover:bg-white hover:shadow-md transition-all cursor-pointer backdrop-blur-md"
                onClick={() => setMobileMenuOpen(true)}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-inner border border-white/20">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-black text-gray-800 tracking-tight leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">
                    Student
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-8 pb-32 lg:pb-12 max-w-7xl mx-auto w-full transition-all duration-300">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
export default StudentDashboard
