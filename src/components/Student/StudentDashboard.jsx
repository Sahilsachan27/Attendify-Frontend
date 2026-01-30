import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import StudentHome from './StudentHome';
import MarkAttendance from './MarkAttendance';
import MyAttendance from './MyAttendance';
import StudentProfile from './StudentProfile';
import Instructions from './Instructions';
import '../Admin/ProSidebarStyles.css';

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = {
    home: { icon: '🏠', label: 'Dashboard' },
    mark: { icon: '📸', label: 'Mark Attendance' },
    attendance: { icon: '📝', label: 'My Attendance' },
    profile: { icon: '👤', label: 'My Profile' },
    instructions: { icon: 'ℹ️', label: 'Instructions' },
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <StudentHome user={user} />;
      case 'mark':
        return <MarkAttendance user={user} />;
      case 'attendance':
        return <MyAttendance user={user} />;
      case 'profile':
        return <StudentProfile user={user} />;
      case 'instructions':
        return <Instructions />;
      default:
        return <StudentHome user={user} />;
    }
  };

  // Student icon positioning config (edit these values to control placement)
  const iconConfig = {
    align: 'center',    // 'left' | 'center' | 'right'
    size: 38,           // px (auto scales on retina)
    offsetX: 4,         // px (positive = move right, negative = move left)
    offsetY: 0          // px (positive = move down, negative = move up)
  };

  const alignClass =
    iconConfig.align === 'center'
      ? 'justify-center'
      : iconConfig.align === 'right'
      ? 'justify-end'
      : 'justify-start';

  // Calculate sidebar width based on collapsed state
  const sidebarWidth = collapsed ? 70 : 260;

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={collapsed}
          width="260px"
          collapsedWidth="70px"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 999,
            border: "none",
            background:
              "linear-gradient(180deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 100%)",
          }}
        >
          <div className="px-3 py-3 border-b border-white/10 flex items-center justify-between">
            {collapsed ? (
              <div className={`flex items-center ${alignClass} w-full`}>
                <button
                  type="button"
                  onClick={() => setCollapsed(false)}
                  className="rounded-full bg-gradient-to-br from-green-500 to-emerald-600 
                             flex items-center justify-center text-white text-lg shadow-sm
                             hover:scale-105 transition-transform"
                  style={{
                    width: `${iconConfig.size}px`,
                    height: `${iconConfig.size}px`,
                    transform: `translate(${iconConfig.offsetX}px, ${iconConfig.offsetY}px)`
                  }}
                  title="Open sidebar"
                  aria-label="Open sidebar"
                >
                  👨‍🎓
                </button>
              </div>
            ) : (
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                🎓 Attendify Student
              </h2>
            )}

            {/* controls: keep arrow only when expanded */}
            <div className="flex items-center gap-2">
              {!collapsed && (
                <button
                  onClick={() => setCollapsed(true)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white text-xs hidden lg:flex"
                  aria-label="Collapse sidebar"
                  title="Collapse"
                >
                  ←
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white text-xs lg:hidden"
                aria-label="Close sidebar"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />

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
                icon={<span className="text-base sm:text-lg">{icon}</span>}
                active={activeTab === key}
                onClick={() => handleTabClick(key)}
                style={
                  activeTab === key
                    ? {
                        background:
                          'linear-gradient(90deg, rgb(16, 185, 129), rgb(5, 150, 105))',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        transform: 'translateX(4px)',
                      }
                    : {}
                }
              >
                <span className="text-sm sm:text-base">{label}</span>
              </MenuItem>
            ))}
          </Menu>

          <div className="absolute bottom-4 left-0 right-0 px-3">
            <button
              onClick={onLogout}
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 font-semibold 
                         shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 
                         transition-all duration-200 flex items-center justify-center gap-2 text-white"
            >
              <span>🚪</span>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </Sidebar>
      </div>

      {/* Mobile Fullscreen Menu (triggered by avatar) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col backdrop-blur-md bg-black/30">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👨‍🎓</span>
              <span className="font-bold text-lg text-gray-900">Attendify Student</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-2xl"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center items-center gap-4 px-4">
            {Object.entries(tabs).map(([key, { icon, label }]) => (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className={`w-full max-w-xs py-4 px-6 rounded-xl text-lg font-semibold flex items-center gap-3 justify-center shadow transition-all
                  ${activeTab === key
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-green-50'}
                `}
              >
                <span className="text-2xl">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              className="w-full max-w-xs py-4 px-6 rounded-xl text-lg font-semibold flex items-center gap-3 justify-center bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow hover:scale-105 transition-all mt-8"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col overflow-hidden w-full"
        style={{
          marginLeft: `0px`,
        }}
      >
        <div
          className="min-h-screen bg-gray-50"
          style={{
            // Dynamically set margin-left based on sidebar state for desktop
            marginLeft: window.innerWidth >= 1024 ? `${sidebarWidth}px` : '0px'
          }}
        >
          <header className="h-14 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Hide sidebar toggle on mobile, since we use the avatar */}
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-lg hidden sm:inline">👨‍🎓</span>
                <span className="text-gray-500 hidden sm:inline">Student</span>
                <span className="text-gray-300 hidden sm:inline">›</span>
                <span className="text-gray-900 font-medium">
                  {tabs[activeTab].label}
                </span>
              </div>
            </div>
            {/* Avatar acts as mobile menu toggle */}
            <div
              className="flex items-center gap-2 px-2 py-1.5 sm:px-3 rounded-lg bg-gray-100 border border-gray-300 hover:bg-white hover:border-green-500 transition-all cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
              style={{ userSelect: 'none' }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500">Student</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
