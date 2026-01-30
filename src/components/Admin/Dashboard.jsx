import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminStyles.css';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    presentCount: 0,
    absentCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: '🎓 Student Management', desc: 'Manage all student records efficiently', gradient: 'from-indigo-500 to-purple-600' },
    { title: '👤 Face Recognition', desc: '99.9% accurate AI-powered authentication', gradient: 'from-rose-500 to-pink-600' },
    { title: '📍 Geo-fencing Active', desc: 'Zero proxy attendance guaranteed', gradient: 'from-cyan-500 to-blue-600' },
  ];

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [studentsRes, attendanceRes] = await Promise.all([
        adminAPI.getStudents(),
        adminAPI.getDailyAttendance(today),
      ]);
      
      setStats({
        totalStudents: studentsRes.data.count,
        todayAttendance: attendanceRes.data.count,
        presentCount: attendanceRes.data.count,
        absentCount: studentsRes.data.count - attendanceRes.data.count,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Stats Slider - Responsive height */}
      <div className="relative h-32 sm:h-40 rounded-xl overflow-hidden shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} flex items-center justify-center 
                       transition-all duration-700 ${index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
          >
            <div className="text-center text-white px-4 sm:px-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{slide.title}</h2>
              <p className="text-sm sm:text-base">{slide.desc}</p>
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 
                         ${index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600 flex items-center justify-center gap-2">
          <div className="w-6 h-6 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards - Fully responsive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: '👥', label: 'Total Students', value: stats.totalStudents, sublabel: 'Registered', color: 'blue' },
              { icon: '✅', label: 'Present Today', value: stats.presentCount, sublabel: stats.totalStudents > 0 ? `${((stats.presentCount / stats.totalStudents) * 100).toFixed(1)}%` : '0%', color: 'emerald' },
              { icon: '❌', label: 'Absent Today', value: stats.absentCount, sublabel: stats.totalStudents > 0 ? `${((stats.absentCount / stats.totalStudents) * 100).toFixed(1)}%` : '0%', color: 'rose' },
              { icon: '📅', label: 'Today', value: stats.todayAttendance, sublabel: new Date().toLocaleDateString(), color: 'purple' },
            ].map((stat, idx) => (
              <div key={idx} className={`bg-white rounded-lg shadow border-l-4 border-${stat.color}-500 p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-2xl sm:text-3xl">{stat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase mb-0.5 truncate">{stat.label}</h3>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="text-xs text-gray-500 truncate block">{stat.sublabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* System Status - Responsive grid */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              🔧 System Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: '✅', title: 'Face Recognition', status: 'Active', active: true },
                { icon: '✅', title: 'Geofencing', status: 'Active', active: true },
                { icon: '☁️', title: 'Database', status: 'Connected', active: true },
                { icon: '🤖', title: 'AI Model', status: 'Ready', active: true },
              ].map((item, index) => (
                <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h4>
                    <p className={`text-xs font-medium ${item.active ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions - Responsive grid */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              ⚡ Quick Actions
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: '➕', label: 'Register Student', gradient: 'from-blue-500 to-blue-600' },
                { icon: '📊', label: 'View Attendance', gradient: 'from-emerald-500 to-teal-600' },
                { icon: '🤖', label: 'Train Model', gradient: 'from-purple-500 to-indigo-600' },
                { icon: '⚙️', label: 'Settings', gradient: 'from-amber-500 to-orange-600' },
              ].map((action, index) => (
                <button
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg bg-gradient-to-br ${action.gradient} text-white font-medium text-xs sm:text-sm
                             shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 
                             flex flex-col items-center gap-2`}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
