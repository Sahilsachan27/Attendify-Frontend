import React, { useState } from 'react';
import './AdminStyles.css';

function AdminProfile({ user }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('❌ New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('❌ Password must be at least 6 characters');
      return;
    }

    try {
      // Here you would call your API to change password
      setMessage('✅ Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('❌ Failed to change password');
    }
  };

  return (
    <div className="card-3d-modern p-6 sm:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shadow-sm text-blue-600">
          👤
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Admin Profile
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
            Manage your account settings
          </p>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="flex items-center gap-6 p-6 sm:p-8 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm mb-8">
        <div className="w-20 h-20 rounded-2xl bg-white text-blue-600 flex items-center justify-center text-4xl font-black shadow-sm border border-blue-100 shadow-blue-200/50">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{user.name}</h3>
          <p className="text-sm font-semibold text-blue-600">🔐 System Administrator</p>
          <p className="text-sm font-medium text-gray-600 tracking-wide">📧 {user.email}</p>
        </div>
      </div>

      {/* Account Details */}
      <div className="mb-8">
        <h3 className="text-lg font-black text-gray-800 tracking-tight border-b border-gray-100 pb-4 mb-4">📋 Account Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-1 shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name:</span>
            <span className="font-bold text-gray-900">{user.name}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-1 shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email:</span>
            <span className="font-bold text-gray-900">{user.email}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-1 items-start shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Role:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
              Administrator
            </span>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-1 items-start shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Account Status:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
               ✅ Active
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mb-8">
        <h3 className="text-lg font-black text-gray-800 tracking-tight border-b border-gray-100 pb-4">🔒 Change Password</h3>
        <form onSubmit={handlePasswordChange} className="mt-6 flex flex-col gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              required
              minLength="6"
              className="input-3d text-sm font-medium"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              required
              minLength="6"
              className="input-3d text-sm font-medium"
            />
            <small className="text-xs text-blue-500 font-semibold ml-1">Minimum 6 characters</small>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              required
              minLength="6"
              className="input-3d text-sm font-medium"
            />
          </div>

          {message && <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl text-sm font-bold shadow-sm">{message}</div>}
          {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-bold shadow-sm">{error}</div>}

          <button type="submit" className="w-full sm:w-auto self-end btn-3d-primary mt-2">
            🔄 Update Password
          </button>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex flex-col gap-3 shadow-sm">
        <h4 className="font-bold text-emerald-800 flex items-center gap-2 text-sm uppercase tracking-wider">
          <span>🛡️</span> Security Tips:
        </h4>
        <ul className="text-sm text-emerald-900/80 font-medium space-y-2 ml-1">
          <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Use a strong password with letters, numbers, and symbols</li>
          <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Don't share your admin credentials with anyone</li>
          <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Change your password regularly (every 3 months)</li>
          <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Enable two-factor authentication if available</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminProfile;
