import React from 'react'

function StudentProfile({ user }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-8">
      <div className="card-3d p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight border-b border-gray-100 pb-4">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm">
            👤
          </span>{' '}
          My Profile
        </h2>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 p-6 glass bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg transform rotate-3 hover:-rotate-3 transition-transform">
            {user.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1">
              {user.name}
            </h3>
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Student - {user.department || 'Not Set'}
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/60 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{' '}
              Member since: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Profile Details (Read-Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass bg-gray-50/50 rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors group">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="text-indigo-400 group-hover:scale-125 transition-transform">
                #️⃣
              </span>{' '}
              Student ID
            </p>
            <p className="text-base font-black text-gray-800 tracking-tight">
              {user.student_id || user.id}
            </p>
          </div>

          <div className="glass bg-gray-50/50 rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors group">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="text-indigo-400 group-hover:scale-125 transition-transform">
                📝
              </span>{' '}
              Full Name
            </p>
            <p className="text-base font-black text-gray-800 tracking-tight">
              {user.name}
            </p>
          </div>

          <div className="glass bg-gray-50/50 rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors group md:col-span-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="text-indigo-400 group-hover:scale-125 transition-transform">
                ✉️
              </span>{' '}
              Email Address
            </p>
            <p className="text-base font-black text-gray-800 tracking-tight break-all">
              {user.email}
            </p>
          </div>

          <div className="glass bg-gray-50/50 rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors group">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="text-indigo-400 group-hover:scale-125 transition-transform">
                🏢
              </span>{' '}
              Department
            </p>
            <p className="text-base font-black text-gray-800 tracking-tight">
              {user.department || 'Not Set'}
            </p>
          </div>

          <div className="glass bg-gray-50/50 rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors group">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="text-indigo-400 group-hover:scale-125 transition-transform">
                📚
              </span>{' '}
              Year / Class
            </p>
            <p className="text-base font-black text-gray-800 tracking-tight">
              Year {user.year || 'N/A'}
            </p>
          </div>

          <div
            className={`glass rounded-2xl p-5 border md:col-span-2 flex items-center justify-between ${user.face_registered ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'}`}
          >
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Face Registration
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {user.face_registered ? '✅' : '❌'}
                </span>
                <p
                  className={`text-sm font-black tracking-tight ${user.face_registered ? 'text-emerald-700' : 'text-rose-700'}`}
                >
                  {user.face_registered ? 'Registered' : 'Not Registered'}
                </p>
              </div>
            </div>
            {!user.face_registered && (
              <button className="btn-3d px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm">
                Register Face
              </button>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-200 rounded-full opacity-20 blur-2xl"></div>
          <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
            <span className="text-base">🔒</span> Security Notice
          </p>
          <ul className="text-[10px] sm:text-xs font-bold text-amber-700/80 space-y-1.5 relative z-10">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{' '}
              Profile details are read-only to prevent misuse
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{' '}
              Contact admin for any profile updates
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{' '}
              Face data cannot be edited directly by students
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{' '}
              Roll number changes require admin approval
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
