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
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/geofence-config`,
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
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/geofence-config`,
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
      <div className="admin-section">
        <h2>🌍 Geofence Configuration</h2>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="admin-section">
      <h2>🌍 Geofence Configuration</h2>

      {/* Current Status */}
      <div className="geofence-status-card">
        <div className="status-header">
          <h3>Current Geofence Status</h3>
          <span
            className={`status-indicator ${
              config.enabled ? 'status-active' : 'status-inactive'
            }`}
          >
            {config.enabled ? '✅ Active' : '❌ Inactive'}
          </span>
        </div>
        <div className="status-details">
          <div className="detail-item">
            <span className="detail-label">📍 Latitude:</span>
            <span className="detail-value">{config.latitude}°</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📍 Longitude:</span>
            <span className="detail-value">{config.longitude}°</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📏 Radius:</span>
            <span className="detail-value">{config.radius} meters</span>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="geofence-form">
        <h3>⚙️ Geofence Settings</h3>

        <div className="form-group">
          <label className="toggle-wrap">
            <input
              type="checkbox"
              name="enabled"
              checked={config.enabled}
              onChange={handleInputChange}
              className="toggle-checkbox"
            />
            <span className="toggle-label">
              {config.enabled ? 'Geofencing Enabled' : 'Geofencing Disabled'}
            </span>
          </label>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>📍 Campus Latitude</label>
            <input
              type="number"
              name="latitude"
              value={config.latitude}
              onChange={handleInputChange}
              step="0.000001"
              required
              placeholder="28.6139"
            />
            <small>Example: 28.6139 (New Delhi)</small>
          </div>

          <div className="form-group">
            <label>📍 Campus Longitude</label>
            <input
              type="number"
              name="longitude"
              value={config.longitude}
              onChange={handleInputChange}
              step="0.000001"
              required
              placeholder="77.2090"
            />
            <small>Example: 77.2090 (New Delhi)</small>
          </div>
        </div>

        <div className="form-group">
          <label>📏 Allowed Radius (meters)</label>
          <input
            type="number"
            name="radius"
            value={config.radius}
            onChange={handleInputChange}
            min="50"
            max="5000"
            required
          />
          <input
            type="range"
            name="radius"
            value={config.radius}
            onChange={handleInputChange}
            min="50"
            max="5000"
            className="range-slider"
          />
          <small>
            Students must be within {config.radius}m to mark attendance
          </small>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <h4>ℹ️ How to find your campus coordinates:</h4>
          <ol>
            <li>Open Google Maps</li>
            <li>Right-click on your campus location</li>
            <li>Click on the coordinates to copy them</li>
            <li>Paste them in the fields above</li>
          </ol>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-primary btn-large">
          💾 Save Configuration
        </button>
      </form>
    </div>
  )
}

export default GeofenceConfig
