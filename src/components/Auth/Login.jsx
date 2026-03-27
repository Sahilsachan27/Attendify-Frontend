import React, { useState } from 'react'
import { authAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await authAPI.login(credentials)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      onLogin(user)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 40%, #faf5ff 70%, #ffffff 100%)',
      }}
    >
      {/* Background Blobs */}
      <div
        className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a5b4fc, #818cf8)' }}
      />
      <div
        className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c4b5fd, #8b5cf6)' }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[420px] bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10"
        style={{
          boxShadow:
            '0 8px 60px -12px rgba(99,102,241,0.25), 0 2px 20px -4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <img src="/attendifyy.png" alt="Attendify" className="h-9 w-auto" />
            <span
              className="text-3xl font-black tracking-tight"
              style={{
                background:
                  'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ATTENDIFY
            </span>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">
            AI-Powered Smart Attendance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] ml-1 flex items-center gap-1.5">
              <span>📧</span> Student ID / Email
            </label>
            <input
              type="text"
              className="input-3d w-full text-sm font-medium"
              placeholder="e.g. stu001 or admin@example.com"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] ml-1 flex items-center gap-1.5">
              <span>🔒</span> Password
            </label>
            <input
              type="password"
              className="input-3d w-full text-sm font-medium"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-3d-primary w-full py-4 mt-1 rounded-2xl font-black text-base disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              '🚀 Login to Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 pt-7 border-t border-gray-100 text-center">
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.12em] mb-4">
            New to Attendify?
          </p>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="btn-3d-secondary w-full py-3.5 rounded-2xl font-bold text-sm"
          >
            ✍️ Create Student Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
