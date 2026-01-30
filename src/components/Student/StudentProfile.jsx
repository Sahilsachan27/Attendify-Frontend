import React from 'react';

function StudentProfile({ user }) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          👤 My Profile
        </h2>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">Student - {user.department || 'Not Set'}</p>
            <p className="text-xs text-gray-500 mt-0.5">Member since: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Profile Details (Read-Only) */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Student ID</p>
            <p className="text-sm font-bold text-gray-900">{user.student_id || user.id}</p>
          </div>

          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</p>
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
          </div>

          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</p>
            <p className="text-sm font-bold text-gray-900">{user.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Department</p>
              <p className="text-sm font-bold text-gray-900">{user.department || 'Not Set'}</p>
            </div>

            <div className="bg-gray-50 rounded p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Year / Class</p>
              <p className="text-sm font-bold text-gray-900">Year {user.year || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-green-50 rounded p-3 border-2 border-green-200">
            <p className="text-xs font-semibold text-green-700 uppercase mb-1">Face Registration Status</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              <p className="text-sm font-bold text-green-600">
                {user.face_registered ? 'Registered' : 'Not Registered'}
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded p-3">
          <p className="text-xs font-semibold text-yellow-800 mb-2">🔒 Security Notice</p>
          <ul className="text-xs text-yellow-700 space-y-0.5">
            <li>• Profile details are read-only to prevent misuse</li>
            <li>• Contact admin for any profile updates</li>
            <li>• Face data cannot be edited by students</li>
            <li>• Roll number changes require admin approval</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
