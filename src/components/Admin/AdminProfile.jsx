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
    <div className="admin-section">
      <h2>👤 Admin Profile</h2>

      {/* Profile Info Card */}
      <div className="profile-card">
        <div className="profile-avatar-large">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p className="profile-role">🔐 System Administrator</p>
          <p className="profile-email">📧 {user.email}</p>
        </div>
      </div>

      {/* Account Details */}
      <div className="account-details-section">
        <h3>📋 Account Details</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{user.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role:</span>
            <span className="badge badge-success">Administrator</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Account Status:</span>
            <span className="badge badge-success">✅ Active</span>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="change-password-section">
        <h3>🔒 Change Password</h3>
        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              required
              minLength="6"
            />
            <small>Minimum 6 characters</small>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              required
              minLength="6"
            />
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary btn-large">
            🔄 Update Password
          </button>
        </form>
      </div>

      {/* Security Tips */}
      <div className="security-tips">
        <h4>🛡️ Security Tips:</h4>
        <ul>
          <li>Use a strong password with letters, numbers, and symbols</li>
          <li>Don't share your admin credentials with anyone</li>
          <li>Change your password regularly (every 3 months)</li>
          <li>Enable two-factor authentication if available</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminProfile;
