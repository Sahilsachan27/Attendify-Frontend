import React, { useState } from 'react'
import { authAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: '', // Student ID / Admin ID / Email
    password: '',
  })
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
    <div className="flex flex-col items-center justify-center flex-1 w-full p-4 sm:p-6 lg:p-8 relative z-10 min-h-[calc(100vh-4rem)]">
      <div className="card-3d w-full max-w-[420px] p-8 sm:p-10 relative bg-white/80 backdrop-blur-xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight drop-shadow-sm mb-3">
            🎓 Attendify
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-widest">
            AI-Powered System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              📧 Student ID / Email
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. stu001 or admin@example.com"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              🔒 Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-bold shadow-sm flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-3d w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(99,102,241,0.4)]"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              '🚀 Login to Account'
            )}
          </button>
        </form>

        {/* Actions: Login or Register */}
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">
            New to Attendify?
          </p>
          <button
            className="btn-3d w-full py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold border border-indigo-100/50 text-sm"
            type="button"
            onClick={() => navigate('/register')}
          >
            ✍️ Create Student Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
