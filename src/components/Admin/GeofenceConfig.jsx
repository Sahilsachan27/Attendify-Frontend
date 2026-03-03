import React, { useState, useEffect } from 'react'
import './AdminStyles.css'

function GeofenceConfig() {
  const [config, setConfig] = useState({
    latitude: '28.6139',
    longitude: '77.2090',
    radius: '500',
    enabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Fetch actual config from backend on mount
  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/geofence-config`,
      )
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (err) {
      console.error('Failed to fetch config:', err)
      setError('Failed to load geofencing configuration.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/geofence-config`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        },
      )

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Geofence configuration saved successfully!')
        setConfig(data.config)
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error(data.error || 'Failed to update configuration')
      }
    } catch (err) {
      setError(`❌ ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-lg" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
          Loading Geofence Data...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-8">
      <div className="flex items-center gap-4 mb-2 sm:mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg text-white">
          🌍
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Geofence Config
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
            Manage Campus Boundaries
          </p>
        </div>
      </div>

      {/* Current Status */}
      <div className="card-3d p-6 sm:p-8 relative overflow-hidden group">
        <div
          className={`absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700 ${config.enabled ? 'bg-emerald-500' : 'bg-rose-500'}`}
        ></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10 border-b border-gray-100 pb-6">
          <h3 className="text-lg font-black text-gray-800 tracking-tight">
            Active Coverage Area
          </h3>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm shadow-sm ${
              config.enabled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.enabled ? 'bg-emerald-400' : 'bg-rose-400'}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${config.enabled ? 'bg-emerald-500' : 'bg-rose-500'}`}
              ></span>
            </span>
            {config.enabled ? 'System Active' : 'System Offline'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative z-10">
          <div className="glass p-4 rounded-2xl flex flex-col gap-1 border border-indigo-50 hover:border-indigo-100 transition-colors">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
              <span className="text-base">📍</span> Latitude
            </span>
            <span className="text-xl font-black text-gray-800 font-mono tracking-tighter">
              {config.latitude}°
            </span>
          </div>
          <div className="glass p-4 rounded-2xl flex flex-col gap-1 border border-purple-50 hover:border-purple-100 transition-colors">
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest flex items-center gap-2">
              <span className="text-base">📍</span> Longitude
            </span>
            <span className="text-xl font-black text-gray-800 font-mono tracking-tighter">
              {config.longitude}°
            </span>
          </div>
          <div className="glass p-4 rounded-2xl flex flex-col gap-1 border border-pink-50 hover:border-pink-100 transition-colors">
            <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest flex items-center gap-2">
              <span className="text-base">📏</span> Radius Limit
            </span>
            <span className="text-xl font-black text-gray-800 flex items-baseline gap-1">
              {config.radius}{' '}
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                meters
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <form
        onSubmit={handleSave}
        className="card-3d p-6 sm:p-8 flex flex-col gap-6"
      >
        <h3 className="text-lg font-black text-gray-800 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-gray-100 rounded-lg text-xl shadow-sm">
            ⚙️
          </span>{' '}
          Update Settings
        </h3>

        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors group">
          <div className="flex flex-col gap-1">
            <span className="font-black text-gray-800">Master Toggle</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {config.enabled
                ? 'Enforcing location checks'
                : 'Location checks disabled'}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="enabled"
              checked={config.enabled}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500 shadow-inner"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              📍 Campus Latitude
            </label>
            <input
              type="number"
              name="latitude"
              value={config.latitude}
              onChange={handleInputChange}
              step="0.000001"
              required
              placeholder="28.6139"
              className="input-field font-mono text-lg"
            />
            <small className="text-xs text-indigo-500 font-semibold ml-1">
              Example: 28.6139 (New Delhi)
            </small>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              📍 Campus Longitude
            </label>
            <input
              type="number"
              name="longitude"
              value={config.longitude}
              onChange={handleInputChange}
              step="0.000001"
              required
              placeholder="77.2090"
              className="input-field font-mono text-lg"
            />
            <small className="text-xs text-indigo-500 font-semibold ml-1">
              Example: 77.2090 (New Delhi)
            </small>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
            <span>📏 Allowed Radius Limit</span>
            <span className="text-indigo-600">{config.radius} meters</span>
          </label>
          <div className="flex gap-4 items-center bg-white p-2 rounded-2xl border border-gray-200 shadow-sm relative">
            <input
              type="range"
              name="radius"
              value={config.radius}
              onChange={handleInputChange}
              min="50"
              max="5000"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 ml-2"
            />
            <input
              type="number"
              name="radius"
              value={config.radius}
              onChange={handleInputChange}
              min="50"
              max="5000"
              required
              className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <small className="text-xs text-gray-500 font-semibold ml-1">
            Students must be within{' '}
            <span className="text-gray-900 font-bold">{config.radius}m</span> of
            the campus to mark attendance
          </small>
        </div>

        {/* Info Box */}
        <div className="glass p-5 rounded-2xl border border-blue-100 bg-blue-50/50 flex flex-col gap-3">
          <h4 className="font-bold text-blue-800 flex items-center gap-2 text-sm uppercase tracking-wider">
            <span>ℹ️</span> Need Campus Coordinates?
          </h4>
          <ol className="list-decimal list-inside text-sm text-blue-900/80 font-medium space-y-1.5 ml-1">
            <li>Open Google Maps and find your building</li>
            <li>Right-click precisely on the location</li>
            <li>Click the first item (coordinates) to copy them</li>
            <li>Paste latitude and longitude into the fields above</li>
          </ol>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl text-sm font-bold shadow-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-bold shadow-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-3d w-full sm:w-auto self-end py-4 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(99,102,241,0.4)] mt-4"
        >
          💾 Save Configuration
        </button>
      </form>
    </div>
  )
}

export default GeofenceConfig
