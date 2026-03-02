import React, { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { studentAPI } from '../../services/api'
import './StudentStyles.css'

function MarkAttendance({ user }) {
  const webcamRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [location, setLocation] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [supportsCamera, setSupportsCamera] = useState(true)
  const [fileImage, setFileImage] = useState(null) // mobile captured image
  const [showFileInput, setShowFileInput] = useState(false) // NEW

  useEffect(() => {
    // Auto-get location on component mount
    getLocation()

    // Detect camera support
    setSupportsCamera(
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    )

    // Cleanup: Turn off camera when component unmounts
    return () => {
      setCameraActive(false)
    }
  }, [])

  const getLocation = () => {
    setMessage('📍 Getting your location...')
    setError('')

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setMessage('✅ Location acquired! Ready to mark attendance.')
          setStep(2)
          setError('')
        },
        (err) => {
          setError(
            '❌ Location access denied. Please enable location services.',
          )
          setMessage('')
          setStep(1)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      setError('❌ Geolocation is not supported by your browser.')
      setStep(1)
    }
  }

  const toggleCamera = () => {
    setCameraActive(!cameraActive)
    if (!cameraActive) {
      setMessage('📸 Camera activated! Position your face clearly.')
    } else {
      setMessage('📷 Camera deactivated.')
    }
  }

  // Handle file input (mobile photo)
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFileImage(reader.result) // data URL
      setMessage('📸 Photo selected. Ready to mark attendance.')
      setError('')
      setStep(2)
    }
    reader.onerror = () => setError('Failed to read selected file')
    reader.readAsDataURL(file)
  }

  const markAttendance = async (imageOverride) => {
    if (!location) {
      setError('❌ Please allow location access first')
      return
    }

    // If called with override (file input), use that, else use webcam screenshot
    const imageSrc =
      imageOverride ||
      (webcamRef.current ? webcamRef.current.getScreenshot() : null) ||
      fileImage
    if (!imageSrc) {
      setError('❌ No image available. Activate camera or select a photo.')
      return
    }

    if (!cameraActive && !imageSrc) {
      setError('❌ Please activate the camera first or select a photo')
      return
    }

    setLoading(true)
    setStep(3)
    setMessage('📸 Capturing your face...')
    setError('')

    try {
      // Use imageSrc for upload
      console.log('📤 Sending attendance request:', {
        student_id: user.student_id || user.id,
        latitude: location.latitude,
        longitude: location.longitude,
        imageSize: imageSrc.length,
      })

      const studentId = user.student_id || user.id
      const response = await studentAPI.markAttendance({
        student_id: studentId,
        image: imageSrc,
        latitude: location.latitude,
        longitude: location.longitude,
      })

      // Success! Auto-close camera after marking attendance
      setTimeout(() => {
        setCameraActive(false)
        setMessage('✅ Attendance marked successfully! Camera closed.')
      }, 2000)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to mark attendance'
      console.error('❌ Attendance error:', errorMsg)

      // Provide helpful error messages
      if (errorMsg.includes('outside campus')) {
        setError(
          `❌ ${errorMsg}\n📍 Please make sure you are inside campus boundaries.`,
        )
      } else if (
        errorMsg.includes('Face not matched') ||
        errorMsg.includes('No face detected')
      ) {
        setError(
          `❌ ${errorMsg}\n💡 Tips:\n- Ensure good lighting\n- Face camera directly\n- Remove glasses/mask if possible\n- Stay 1-2 feet from camera`,
        )
      } else if (errorMsg.includes('already marked')) {
        setError(`⚠️ ${errorMsg}`)
      } else if (errorMsg.includes('not registered')) {
        setError(
          `❌ ${errorMsg}\n📝 Please contact admin to register your face.`,
        )
      } else {
        setError(`❌ ${errorMsg}`)
      }

      setMessage('')
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-8">
      <div className="card-3d p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 flex items-center gap-3 tracking-tight">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm">
            📸
          </span>{' '}
          Mark Your Attendance
        </h2>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-100 pb-6">
          {cameraActive
            ? 'Camera is active. Position your face clearly'
            : 'Click "Activate Camera" to start'}
        </p>

        {/* Step Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8">
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 transition-colors ${step >= 1 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
          >
            <span className="text-sm sm:text-base">
              {step >= 1 ? '✅' : '1️⃣'}
            </span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
              Location
            </span>
          </div>
          <div className="h-0.5 w-4 sm:w-8 bg-gray-200 rounded-full"></div>
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 transition-colors ${step >= 2 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
          >
            <span className="text-sm sm:text-base">
              {step >= 2 ? '✅' : '2️⃣'}
            </span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
              Face Scan
            </span>
          </div>
          <div className="h-0.5 w-4 sm:w-8 bg-gray-200 rounded-full"></div>
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 transition-colors ${step >= 3 ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
          >
            <span className="text-sm sm:text-base">
              {step >= 3 ? '⏳' : '3️⃣'}
            </span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
              Verify
            </span>
          </div>
        </div>

        {/* Camera Toggle Button & Input */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {!supportsCamera && (
            <button
              onClick={() => setShowFileInput(true)}
              className="px-6 py-3 bg-white text-gray-700 rounded-xl font-bold uppercase tracking-widest text-xs border-2 border-gray-200 shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-all w-full sm:w-auto"
            >
              📱 Use Phone Photo
            </button>
          )}
          <button
            onClick={toggleCamera}
            disabled={loading}
            className={`btn-3d px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs w-full sm:w-auto transition-all text-white shadow-lg flex items-center justify-center gap-2 ${cameraActive ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_8px_20px_rgba(225,29,72,0.4)]' : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_8px_20px_rgba(99,102,241,0.4)]'} disabled:opacity-50`}
          >
            {cameraActive ? (
              <>
                <span>📷</span>
                <span>Close Camera</span>
              </>
            ) : (
              <>
                <span>📸</span>
                <span>Activate Camera</span>
              </>
            )}
          </button>
          {cameraActive && (
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl mt-2 sm:mt-0 shadow-sm indicator-pulse">
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(225,29,72,0.6)]"></div>
              <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">
                Live
              </span>
            </div>
          )}
        </div>

        {(showFileInput || !supportsCamera) && (
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="input-field block w-full mb-6 max-w-sm mx-auto p-3"
          />
        )}

        {/* Webcam Feed or File Preview */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] mb-8 flex items-center justify-center mx-auto bg-gray-900 border-4 border-gray-800"
          style={{ width: '100%', maxWidth: 400, aspectRatio: '1/1' }}
        >
          {cameraActive ? (
            <div className="w-full h-full relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'user' }}
                mirrored={true}
                className="w-full h-full object-cover"
                screenshotQuality={1}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1/1',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-4 border-emerald-400/50 rounded-full animate-pulse shadow-[0_0_30px_rgba(52,211,153,0.3)]"></div>
              </div>
            </div>
          ) : fileImage ? (
            <img
              src={fileImage}
              alt="Selected"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-white px-6 w-full flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner border border-gray-700">
                📷
              </div>
              <h3 className="text-lg font-black tracking-tight mb-1 text-gray-300">
                Camera Inactive
              </h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Ready for capture
              </p>
            </div>
          )}
        </div>

        {/* Attendance Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 shadow-inner">
              👤
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Student
            </p>
            <p className="text-sm font-black text-gray-800 tracking-tight truncate">
              {user.name}
            </p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {user.student_id || user.id}
            </p>
          </div>

          <div className="glass bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 shadow-inner ${location ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}
            >
              📍
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Location
            </p>
            <p
              className={`text-sm font-black tracking-tight ${location ? 'text-emerald-700' : 'text-rose-600'}`}
            >
              {location ? 'Acquired' : 'Pending'}
            </p>
            {location && (
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            )}
          </div>

          <div className="glass bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-inner">
              📅
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Date & Time
            </p>
            <p className="text-sm font-black text-gray-800 tracking-tight">
              {new Date().toLocaleDateString()}
            </p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {!location ? (
            <button
              onClick={getLocation}
              className="btn-3d flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_8px_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50"
              disabled={loading}
            >
              📍 Get Location
            </button>
          ) : (
            <>
              <button
                onClick={() => markAttendance(fileImage)}
                disabled={loading || !location || (!cameraActive && !fileImage)}
                className="btn-3d flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_8px_20px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>{' '}
                    Processing...
                  </>
                ) : (
                  '✅ Mark Attendance'
                )}
              </button>
              <button
                onClick={getLocation}
                disabled={loading}
                className="btn-3d px-6 py-4 bg-white text-gray-700 rounded-xl font-black uppercase tracking-widest text-xs border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50"
              >
                🔄 Refresh
              </button>
            </>
          )}
        </div>

        {/* Messages */}
        {message && (
          <div className="glass bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 mb-6 shadow-sm flex gap-3 items-start animate-fade-in">
            <span className="text-xl">✨</span>
            <p className="text-sm font-bold text-emerald-800 leading-relaxed">
              {message}
            </p>
          </div>
        )}

        {error && (
          <div className="glass bg-rose-50/80 border border-rose-200 rounded-xl p-4 mb-6 shadow-sm flex gap-3 items-start animate-fade-in">
            <span className="text-xl">⚠️</span>
            <pre className="text-sm font-bold text-rose-800 leading-relaxed font-sans whitespace-pre-wrap">
              {error}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="glass bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-200 rounded-full opacity-20 blur-2xl"></div>
          <h3 className="text-sm font-black text-indigo-900 mb-4 flex items-center gap-2 tracking-tight">
            💡 Quick Tips for Success
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-indigo-800/80">
            <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-indigo-50/50">
              <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600">
                1
              </span>
              <span>Look directly at the camera</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-indigo-50/50">
              <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600">
                2
              </span>
              <span>Ensure good lighting (no backlight)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-indigo-50/50">
              <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600">
                3
              </span>
              <span>Remove glasses, masks, or hats</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-indigo-50/50">
              <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600">
                4
              </span>
              <span>Stay 1-2 feet from the lens</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarkAttendance
