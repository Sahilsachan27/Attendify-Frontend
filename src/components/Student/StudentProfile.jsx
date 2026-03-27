import React from 'react'

function StudentProfile({ user }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-6">
      <div className="card-3d-modern p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight border-b border-gray-100 pb-4">
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm">👤</span>
          My Profile
        </h2>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1">{user.name}</h3>
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">
              Student · {user.department || 'N/A'}
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/60 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active Student
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Student ID', value: user.student_id || user.id, icon: '#️⃣' },
            { label: 'Full Name', value: user.name, icon: '📝' },
            { label: 'Department', value: user.department || 'Not Set', icon: '🏢'},
            { label: 'Year / Class', value: `Year ${user.year || 'N/A'}`, icon: '📚' },
          ].map((field, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <span>{field.icon}</span> {field.label}
              </p>
              <p className="text-base font-black text-gray-800 tracking-tight">{field.value}</p>
            </div>
          ))}

          {/* Email — full width */}
          <div className="md:col-span-2 bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 transition-colors">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
              <span>✉️</span> Email Address
            </p>
            <p className="text-base font-black text-gray-800 tracking-tight break-all">{user.email}</p>
          </div>

          {/* Face Registration — full width */}
          <div className={`md:col-span-2 rounded-2xl p-5 border flex items-center justify-between ${user.face_registered ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Face Registration</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">{user.face_registered ? '✅' : '❌'}</span>
                <p className={`text-sm font-black tracking-tight ${user.face_registered ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {user.face_registered ? 'Registered' : 'Not Registered'}
                </p>
              </div>
            </div>
            {!user.face_registered && (
              <button className="btn-3d-primary text-xs px-4 py-2">Register Face</button>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="text-base">🔒</span> Security Notice
          </p>
          <ul className="text-[10px] sm:text-xs font-bold text-amber-700/80 space-y-1.5">
            {[
              'Profile details are read-only to prevent misuse',
              'Contact admin for any profile updates',
              'Face data cannot be edited directly by students',
              'Roll number changes require admin approval',
            ].map((note, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span> {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
