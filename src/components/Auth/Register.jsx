import React, { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { adminAPI, studentAPI } from '../../services/api'

function Register() {
  const webcamRef = useRef(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    password: '',
    department: '',
    year: '',
  })
  const [images, setImages] = useState([])
  const [supportsCamera, setSupportsCamera] = useState(true) // NEW: detect media support
  const [studentIdStatus, setStudentIdStatus] = useState(null) // null | 'available' | 'taken' | 'checking'
  const [studentIdMessage, setStudentIdMessage] = useState('')

  useEffect(() => {
    // detect getUserMedia support (may be blocked on insecure origins)
    const hasMedia = !!(
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    )
    setSupportsCamera(hasMedia)
  }, [])

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  // ✅ NEW: Real-time Student ID validation (Updated to show only name)
  const checkStudentId = async (studentId) => {
    if (!studentId || studentId.length < 3) {
      setStudentIdStatus(null)
      setStudentIdMessage('')
      return
    }

    setStudentIdStatus('checking')
    setStudentIdMessage('⏳ Checking...')

    try {
      const response = await adminAPI.checkStudentId(
        studentId.trim().toUpperCase(),
      )
      const data = response.data

      if (data.exists) {
        setStudentIdStatus('taken')
        // ✅ UPDATED: Show only name, no email
        setStudentIdMessage(`❌ Already registered by ${data.registered_name}`)
      } else {
        setStudentIdStatus('available')
        setStudentIdMessage('✅ Student ID available')
      }
    } catch (err) {
      console.error('Error checking Student ID:', err)
      setStudentIdStatus(null)
      setStudentIdMessage('')
    }
  }

  // ✅ Debounced change handler for Student ID
  const handleStudentIdChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, student_id: value })

    // Clear previous timeout
    if (window.studentIdTimeout) {
      clearTimeout(window.studentIdTimeout)
    }

    // Set new timeout (500ms delay after user stops typing)
    window.studentIdTimeout = setTimeout(() => {
      checkStudentId(value)
    }, 500)
  }

  const capture = () => {
    const shot = webcamRef.current?.getScreenshot()
    if (shot) {
      setImages((prev) => [...prev, shot])
      setMessage(`📸 Captured ${images.length + 1} image(s).`)
    }
  }

  // Handle native file input (mobile camera fallback)
  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const toDataUrl = (file) =>
      new Promise((res, rej) => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result)
        reader.onerror = rej
        reader.readAsDataURL(file)
      })

    try {
      const newImages = []
      for (const f of files.slice(0, 10)) {
        const dataUrl = await toDataUrl(f)
        newImages.push(dataUrl)
      }
      setImages((prev) => [...prev, ...newImages])
      setMessage(`📸 Captured ${images.length + newImages.length} image(s).`)
    } catch (err) {
      setError('Failed to read selected images.')
    }
  }

  const submitRegistration = async () => {
    if (images.length < 5) {
      setError('Please capture at least 5 images.')
      return
    }

    // Switch to processing view immediately
    setStep(3)
    setLoading(true)
    setError('')
    setMessage('⏳ Creating account...')

    try {
      // Step 1: Register student account
      await adminAPI.registerStudent(formData)
      setMessage('✅ Account created!\n⏳ Uploading face images to cloud...')

      // ✅ Step 2: Use studentAPI instead of direct fetch
      const response = await studentAPI.registerFace({
        student_id: formData.student_id.trim().toUpperCase(),
        images: images,
      })

      const data = response.data

      if (!data.success) {
        throw new Error(data.error || 'Face image upload failed')
      }

      // Check if auto-training was successful
      if (data.training_result?.success) {
        setMessage(
          `✅ Registration complete!\n✅ ${data.face_images_count} images uploaded\n✅ AI model trained automatically\n🎉 You can now login!`,
        )
      } else {
        setMessage(
          `✅ Registration complete!\n✅ ${data.face_images_count} images uploaded\n⚠️ AI model training pending (admin will train manually)\n🎉 You can now login!`,
        )
      }

      // Optional: Auto-redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/login'
      }, 3000)
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || 'Registration failed'

      // ✅ ENHANCED ERROR DISPLAY FOR DUPLICATE STUDENT_ID
      if (
        errorMessage.includes('Student ID') &&
        errorMessage.includes('already registered')
      ) {
        setError(
          `❌ ${errorMessage}\n\n💡 Tip: Try using a different Student ID like:\n• ${formData.student_id}A\n• ${formData.student_id}_NEW\n• Or contact admin if this is your correct ID`,
        )
      } else if (
        errorMessage.includes('Email') &&
        errorMessage.includes('already registered')
      ) {
        setError(
          `❌ ${errorMessage}\n\n💡 Tip: Use a different email address or login with your existing account.`,
        )
      } else {
        setError(`❌ ${errorMessage}`)
      }

      setMessage('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8 pb-24 relative z-10 min-h-[calc(100vh-4rem)]">
      <div className="card-3d w-full max-w-[450px] p-6 sm:p-8 relative bg-white/80 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight drop-shadow-sm mb-2">
            ✍️ Registration
          </h1>
          <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            Create Account & Register Face
          </p>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-5">
            {/* Student ID with Real-Time Validation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                📝 Student ID
              </label>
              <input
                className={`input-field ${
                  studentIdStatus === 'available'
                    ? 'border-green-500'
                    : studentIdStatus === 'taken'
                      ? 'border-red-500'
                      : ''
                }`}
                name="student_id"
                value={formData.student_id}
                onChange={handleStudentIdChange}
                placeholder="stu001"
                required
              />
              {/* Real-time feedback */}
              {studentIdMessage && (
                <div
                  className={`mt-1 text-xs font-bold ${
                    studentIdStatus === 'available'
                      ? 'text-green-600'
                      : studentIdStatus === 'taken'
                        ? 'text-red-600'
                        : 'text-gray-500'
                  }`}
                >
                  {studentIdMessage}
                </div>
              )}
            </div>

            {/* Basic fields */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                👤 Full Name
              </label>
              <input
                className="input-field"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                📧 Email
              </label>
              <input
                className="input-field"
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="student@example.com"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                🔒 Password
              </label>
              <input
                className="input-field"
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Min. 6 characters"
                required
                minLength={6}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                🏢 Department
              </label>
              <input
                className="input-field"
                name="department"
                value={formData.department}
                onChange={onChange}
                placeholder="Computer Science"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                📚 Year
              </label>
              <select
                className="input-field text-gray-700 cursor-pointer"
                name="year"
                value={formData.year}
                onChange={onChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
                <option value="4">Fourth</option>
              </select>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-semibold shadow-sm mb-2 whitespace-pre-wrap">
                {error}
              </div>
            )}
            <button
              className="btn-3d w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => setStep(2)}
              disabled={studentIdStatus === 'taken'}
            >
              Next: Face Capture →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* Webcam for supported/desktop browsers */}
            {supportsCamera ? (
              <>
                <div
                  className="mx-auto rounded-3xl overflow-hidden shadow-md border-[6px] border-white"
                  style={{ width: '100%', maxWidth: 360, aspectRatio: '1/1' }}
                >
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 640,
                      height: 640,
                      facingMode: 'user',
                    }}
                    mirrored={true}
                    className="w-full h-full object-cover"
                    playsInline
                  />
                </div>
                <div className="flex flex-col gap-3 w-full mt-2">
                  <button
                    className="btn-3d w-full py-3 sm:py-4 bg-indigo-50 text-indigo-700 border border-indigo-100/50 rounded-xl font-bold min-w-[120px] shadow-sm disabled:opacity-50"
                    type="button"
                    onClick={() => {
                      const shot = webcamRef.current?.getScreenshot()
                      if (shot) {
                        setImages((prev) => [...prev, shot])
                        setMessage(`📸 Captured ${images.length + 1} image(s).`)
                      }
                    }}
                    disabled={loading || images.length >= 10}
                  >
                    📷 Capture ({images.length}/10)
                  </button>
                  <div className="flex gap-3">
                    <button
                      className="btn-3d flex-1 py-3 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-bold shadow-sm disabled:opacity-50"
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      ← Back
                    </button>
                    <button
                      className="btn-3d flex-1 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-black shadow-[0_4px_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:shadow-none"
                      type="button"
                      onClick={submitRegistration}
                      disabled={loading || images.length < 5}
                    >
                      {loading ? '⏳ Wait...' : '✅ Save'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Mobile fallback: native camera via file input (works on HTTP/LAN) */
              <>
                <div className="mx-auto text-center w-full bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                  <p className="mb-4 text-indigo-800 font-bold text-sm">
                    📱 Browser blocked camera. Use phone camera below.
                  </p>
                  <input
                    id="mobile-photo-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleFileInput}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    className="btn-3d flex-1 py-3 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-bold"
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn-3d flex-1 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-black"
                    type="button"
                    onClick={submitRegistration}
                    disabled={loading || images.length < 5}
                  >
                    {loading ? '⏳ Wait...' : '✅ Save'}
                  </button>
                </div>
              </>
            )}

            {/* Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`cap-${i}`}
                    className="w-full h-16 sm:h-20 object-cover rounded-lg shadow-sm border border-gray-200"
                  />
                ))}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-semibold shadow-sm mt-2 whitespace-pre-wrap">
                {error}
              </div>
            )}
          </div>
        )}

        {/* NEW STEP 3: Dedicated Processing/Uploading Screen */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-10 text-center min-h-[350px]">
            {loading && !error && (
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6 drop-shadow-sm"></div>
            )}

            {/* Success Icon */}
            {!loading && !error && message.includes('complete') && (
              <div className="text-6xl mb-6 animate-fade-in drop-shadow-md">
                🎉
              </div>
            )}

            <h3 className="text-2xl font-black text-gray-900 mb-3 drop-shadow-sm">
              {loading
                ? 'Processing...'
                : error
                  ? 'Registration Failed'
                  : 'Success!'}
            </h3>

            <div className="text-sm font-bold text-gray-600 mb-8 max-w-[250px] mx-auto whitespace-pre-line leading-relaxed">
              {message || (loading ? 'Uploading data to server...' : '')}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl w-full text-sm font-semibold shadow-sm mb-6 text-left whitespace-pre-line">
                {error}
              </div>
            )}

            {error && (
              <button
                onClick={() => setStep(2)}
                className="btn-3d w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm shadow-sm mt-auto"
              >
                ← Go Back and Try Again
              </button>
            )}

            {!loading && !error && (
              <button
                onClick={() => (window.location.href = '/login')}
                className="btn-3d w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black text-sm shadow-[0_4px_15px_rgba(16,185,129,0.3)] mt-auto"
              >
                Proceed to Login →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
